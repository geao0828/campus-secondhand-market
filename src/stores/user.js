import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { userAPI, cartAPI, productAPI } from '../api'

export const useUserStore = defineStore('user', () => {
  const user = ref(null)
  const isLoggedIn = computed(() => !!user.value)
  const favorites = ref([])
  const cart = ref([])

  const cartCount = computed(() => cart.value.reduce((sum, item) => sum + item.quantity, 0))

  const initFromStorage = () => {
    const saved = localStorage.getItem('campus_user')
    if (saved) {
      try {
        user.value = JSON.parse(saved)
      } catch {
        localStorage.removeItem('campus_user')
      }
    }
  }

  const persist = () => {
    if (user.value) {
      localStorage.setItem('campus_user', JSON.stringify(user.value))
    } else {
      localStorage.removeItem('campus_user')
    }
  }

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

  const logout = () => {
    user.value = null
    favorites.value = []
    cart.value = []
    localStorage.removeItem('token')
    localStorage.removeItem('campus_user')
    localStorage.removeItem('campus_favorites')
    localStorage.removeItem('campus_cart')
  }

  const updateProfile = async (data) => {
    const res = await userAPI.updateUserInfo(data)
    if (res.data) {
      user.value = { ...user.value, ...res.data }
      persist()
    }
    return res
  }

  const fetchFavorites = async () => {
    if (!user.value) return
    try {
      const res = await userAPI.getMyFavorites()
      const data = res.data?.list || res.data || []
      console.log('收藏API返回数据:', data)
      
      const productList = []
      for (const item of data) {
        if (item.product) {
          productList.push(item.product)
        } else if (item.productId) {
          try {
            const productRes = await productAPI.getProductDetail(item.productId)
            if (productRes.data) {
              productList.push(productRes.data)
            }
          } catch (e) {
            console.error(`获取商品${item.productId}详情失败:`, e)
          }
        } else if (item.id && typeof item === 'object') {
          productList.push(item)
        }
      }
      
      favorites.value = productList
      console.log('解析后的收藏列表:', favorites.value)
      localStorage.setItem('campus_favorites', JSON.stringify(favorites.value))
    } catch (e) {
      console.error('获取收藏失败:', e)
      favorites.value = []
    }
  }

  const fetchCart = async () => {
    if (!user.value) return
    const res = await cartAPI.getCart()
    cart.value = res.data?.list || res.data || []
    localStorage.setItem('campus_cart', JSON.stringify(cart.value))
  }

  const addToCart = async (product, quantity = 1) => {
    const res = await cartAPI.addToCart(product.id, quantity)
    const existItem = cart.value.find((item) => item.product.id === product.id)
    if (existItem) {
      existItem.quantity += quantity
    } else {
      cart.value.push({ product, quantity })
    }
    localStorage.setItem('campus_cart', JSON.stringify(cart.value))
    return res
  }

  const removeFromCart = async (productId) => {
    const res = await cartAPI.removeFromCart(productId)
    const index = cart.value.findIndex((item) => item.product.id === productId)
    if (index > -1) cart.value.splice(index, 1)
    localStorage.setItem('campus_cart', JSON.stringify(cart.value))
    return res
  }

  const updateCartQuantity = async (productId, quantity) => {
    const res = await cartAPI.updateCartItem(productId, quantity)
    const item = cart.value.find((item) => item.product.id === productId)
    if (item) item.quantity = quantity
    localStorage.setItem('campus_cart', JSON.stringify(cart.value))
    return res
  }

  const clearCart = async () => {
    const res = await cartAPI.clearCart()
    cart.value = []
    localStorage.setItem('campus_cart', JSON.stringify(cart.value))
    return res
  }

  const addFavorite = async (product) => {
    const res = await userAPI.addFavorite(product.id)
    if (!favorites.value.find((f) => f.id === product.id)) {
      favorites.value.push(product)
      localStorage.setItem('campus_favorites', JSON.stringify(favorites.value))
    }
    return res
  }

  const removeFavorite = async (productId) => {
    const res = await userAPI.removeFavorite(productId)
    const index = favorites.value.findIndex((f) => f.id === productId)
    if (index > -1) {
      favorites.value.splice(index, 1)
      localStorage.setItem('campus_favorites', JSON.stringify(favorites.value))
    }
    return res
  }

  const isFavorite = (productId) => favorites.value.some((f) => f.id === productId)

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
