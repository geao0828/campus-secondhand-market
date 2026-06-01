/**
 * 用户状态管理
 * @description 管理用户信息、登录状态、购物车、收藏等
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { userAPI, cartAPI, productAPI } from '../api'

export const useUserStore = defineStore('user', () => {
  // ==================== 状态定义 ====================

  /** 当前登录用户信息 */
  const user = ref(null)

  /** 是否已登录（计算属性） */
  const isLoggedIn = computed(() => !!user.value)

  /** 收藏商品列表 */
  const favorites = ref([])

  /** 购物车商品列表 */
  const cart = ref([])

  /** 购物车商品总数量（计算属性） */
  const cartCount = computed(() => cart.value.reduce((sum, item) => sum + item.quantity, 0))

  // ==================== 本地存储 ====================

  /**
   * 从本地存储恢复用户数据
   * 用于页面刷新后保持登录状态
   */
  const initFromStorage = () => {
    const saved = localStorage.getItem('campus_user')
    if (saved) {
      try {
        user.value = JSON.parse(saved)
      } catch {
        // JSON解析失败，删除损坏的数据
        localStorage.removeItem('campus_user')
      }
    }
  }

  /**
   * 将用户数据保存到本地存储
   */
  const persist = () => {
    if (user.value) {
      localStorage.setItem('campus_user', JSON.stringify(user.value))
    } else {
      localStorage.removeItem('campus_user')
    }
  }

  // ==================== 用户操作 ====================

  /**
   * 用户登录
   * @param {Object} credentials - 登录凭证（username, password）
   */
  const login = async (credentials) => {
    const res = await userAPI.login(credentials)
    user.value = res.data?.user || res.user
    const token = res.data?.token || res.token
    if (token) {
      localStorage.setItem('token', token)
    }
    persist()
    return res
  }

  /**
   * 用户登出
   * 清除所有本地存储的用户相关数据
   */
  const logout = () => {
    user.value = null
    favorites.value = []
    cart.value = []
    localStorage.removeItem('token')
    localStorage.removeItem('campus_user')
    localStorage.removeItem('campus_favorites')
    localStorage.removeItem('campus_cart')
  }

  /**
   * 更新用户个人信息
   * @param {Object} data - 要更新的用户信息
   */
  const updateProfile = async (data) => {
    const res = await userAPI.updateUserInfo(data)
    if (res.data) {
      user.value = { ...user.value, ...res.data }
      persist()
    }
    return res
  }

  // ==================== 收藏管理 ====================

  /**
   * 获取我的收藏列表
   * 兼容多种数据格式：直接包含商品 或 只有商品ID
   */
  const fetchFavorites = async () => {
    if (!user.value) return
    try {
      const res = await userAPI.getMyFavorites()
      const data = res.data?.list || res.data || []

      const productList = []
      for (const item of data) {
        // 情况1: 直接包含商品对象
        if (item.product) {
          productList.push(item.product)
        }
        // 情况2: 只有商品ID，需要单独获取商品详情
        else if (item.productId) {
          try {
            const productRes = await productAPI.getProductDetail(item.productId)
            if (productRes.data) {
              productList.push(productRes.data)
            }
          } catch (e) {
            console.error(`获取商品${item.productId}详情失败:`, e)
          }
        }
        // 情况3: 直接就是商品对象
        else if (item.id && typeof item === 'object') {
          productList.push(item)
        }
      }

      favorites.value = productList
      localStorage.setItem('campus_favorites', JSON.stringify(favorites.value))
    } catch (e) {
      console.error('获取收藏失败:', e)
      favorites.value = []
    }
  }

  /**
   * 添加商品到收藏
   * @param {Object} product - 商品对象
   */
  const addFavorite = async (product) => {
    const res = await userAPI.addFavorite(product.id)
    // 避免重复添加
    if (!favorites.value.find((f) => f.id === product.id)) {
      favorites.value.push(product)
      localStorage.setItem('campus_favorites', JSON.stringify(favorites.value))
    }
    return res
  }

  /**
   * 取消收藏
   * @param {number|string} productId - 商品ID
   */
  const removeFavorite = async (productId) => {
    const res = await userAPI.removeFavorite(productId)
    const index = favorites.value.findIndex((f) => f.id === productId)
    if (index > -1) {
      favorites.value.splice(index, 1)
      localStorage.setItem('campus_favorites', JSON.stringify(favorites.value))
    }
    return res
  }

  /**
   * 检查商品是否已收藏
   * @param {number|string} productId - 商品ID
   */
  const isFavorite = (productId) => favorites.value.some((f) => f.id === productId)

  // ==================== 购物车管理 ====================

  /**
   * 获取购物车列表
   */
  const fetchCart = async () => {
    if (!user.value) return
    const res = await cartAPI.getCart()
    cart.value = res.data?.list || res.data || []
    localStorage.setItem('campus_cart', JSON.stringify(cart.value))
  }

  /**
   * 添加商品到购物车
   * @param {Object} product - 商品对象
   * @param {number} quantity - 数量，默认1
   */
  const addToCart = async (product, quantity = 1) => {
    const res = await cartAPI.addToCart(product.id, quantity)
    const existItem = cart.value.find((item) => item.product.id === product.id)
    if (existItem) {
      // 已存在，增加数量
      existItem.quantity += quantity
    } else {
      // 不存在，添加新项
      cart.value.push({ product, quantity })
    }
    localStorage.setItem('campus_cart', JSON.stringify(cart.value))
    return res
  }

  /**
   * 从购物车移除商品
   * @param {number|string} productId - 商品ID
   */
  const removeFromCart = async (productId) => {
    const res = await cartAPI.removeFromCart(productId)
    const index = cart.value.findIndex((item) => item.product.id === productId)
    if (index > -1) cart.value.splice(index, 1)
    localStorage.setItem('campus_cart', JSON.stringify(cart.value))
    return res
  }

  /**
   * 更新购物车商品数量
   * @param {number|string} productId - 商品ID
   * @param {number} quantity - 新数量
   */
  const updateCartQuantity = async (productId, quantity) => {
    const res = await cartAPI.updateCartItem(productId, quantity)
    const item = cart.value.find((item) => item.product.id === productId)
    if (item) item.quantity = quantity
    localStorage.setItem('campus_cart', JSON.stringify(cart.value))
    return res
  }

  /**
   * 清空购物车
   */
  const clearCart = async () => {
    const res = await cartAPI.clearCart()
    cart.value = []
    localStorage.setItem('campus_cart', JSON.stringify(cart.value))
    return res
  }

  // ==================== 暴露给外部使用 ====================
  return {
    user,
    isLoggedIn,
    favorites,
    cart,
    cartCount,
    initFromStorage,
    login,
    logout,
    updateProfile,
    fetchFavorites,
    fetchCart,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    addFavorite,
    removeFavorite,
    isFavorite
  }
})
