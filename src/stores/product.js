/**
 * 商品状态管理
 * @description 管理商品列表、热门商品、最新商品、评价等状态
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { productAPI, reviewAPI } from '../api'

export const useProductStore = defineStore('product', () => {
  // ==================== 状态定义 ====================

  /** 商品分类列表 */
  const categories = ref([
    { id: 'digital', name: '数码', icon: 'Monitor' },
    { id: 'books', name: '书籍', icon: 'Reading' },
    { id: 'clothing', name: '服饰', icon: 'Shop' },
    { id: 'daily', name: '生活用品', icon: 'ShoppingBag' }
  ])

  /** 所有商品列表 */
  const products = ref([])

  /** 热门商品列表 */
  const hotProducts = ref([])

  /** 最新商品列表 */
  const newProducts = ref([])

  /** 商品评价列表 */
  const reviews = ref([])

  /** 首页轮播图数据 */
  const banners = ref([
    { id: 1, image: 'https://picsum.photos/1200/400?random=101', title: '热门推荐', subtitle: '精选校园好物', link: '/products?sort=hot' },
    { id: 2, image: 'https://picsum.photos/1200/400?random=102', title: '最新发布', subtitle: '发现新鲜闲置', link: '/products?sort=new' },
    { id: 3, image: 'https://picsum.photos/1200/400?random=103', title: '书籍专区', subtitle: '教材教辅低价淘', link: '/products?category=books' }
  ])

  // ==================== 计算属性/方法 ====================

  /**
   * 根据ID获取商品详情
   * @param {number|string} id - 商品ID
   * @returns {Object|undefined} 商品对象
   */
  const getProductById = (id) => {
    const targetId = Number(id)
    return (
      products.value.find((p) => Number(p.id) === targetId) ||
      hotProducts.value.find((p) => Number(p.id) === targetId) ||
      newProducts.value.find((p) => Number(p.id) === targetId)
    )
  }

  /**
   * 根据商品ID获取评价列表
   * @param {number|string} productId - 商品ID
   */
  const getReviewsByProductId = (productId) => reviews.value.filter((r) => r.productId === Number(productId))

  // ==================== 商品数据获取 ====================

  /**
   * 获取所有商品（自动分页加载）
   * @param {Object} params - 查询参数（page, pageSize等）
   */
  const fetchProducts = async (params = {}) => {
    try {
      let allProducts = []
      let currentPage = 1
      const pageSize = params.pageSize || 10

      // 循环获取所有分页数据
      while (true) {
        const res = await productAPI.getProducts({
          ...params,
          page: currentPage,
          pageSize: pageSize
        })
        const data = res.data?.list || res.data || []

        // 没有数据时停止
        if (data.length === 0) break

        allProducts = [...allProducts, ...data]

        // 数据少于每页数量，说明是最后一页
        if (data.length < pageSize) break

        currentPage++
      }

      products.value = allProducts
    } catch (e) {
      console.error('获取商品列表失败:', e)
      products.value = []
    }
  }

  /**
   * 获取热门商品（仅在售商品）
   */
  const fetchHotProducts = async () => {
    try {
      const res = await productAPI.getHotProducts()
      const data = res.data?.list || res.data || []
      // 只保留状态为 active 的商品
      hotProducts.value = data.filter((p) => p.status === 'active')
    } catch (e) {
      console.error('获取热门商品失败:', e)
      hotProducts.value = []
    }
  }

  /**
   * 获取最新商品（仅在售商品）
   */
  const fetchNewProducts = async () => {
    try {
      const res = await productAPI.getNewProducts()
      const data = res.data?.list || res.data || []
      // 只保留状态为 active 的商品
      newProducts.value = data.filter((p) => p.status === 'active')
    } catch (e) {
      console.error('获取最新商品失败:', e)
      newProducts.value = []
    }
  }

  /**
   * 获取商品评价列表
   * @param {number|string} productId - 商品ID
   */
  const fetchReviews = async (productId) => {
    try {
      const res = await reviewAPI.getProductReviews(productId)
      reviews.value = res.data?.list || res.data || []
    } catch (e) {
      console.error('获取评价失败:', e)
      reviews.value = []
    }
  }

  // ==================== 商品操作 ====================

  /**
   * 添加商品评价
   * @param {number|string} productId - 商品ID
   * @param {Object} review - 评价内容
   */
  const addReview = async (productId, review) => {
    const res = await reviewAPI.createReview(productId, review)
    if (res.data) {
      reviews.value.unshift(res.data)
    }
    return res
  }

  /**
   * 发布新商品
   * @param {Object} data - 商品信息
   */
  const addProduct = async (data) => {
    const res = await productAPI.publishProduct(data)
    if (res.data) {
      // 添加到商品列表头部
      products.value.unshift(res.data)
    }
    return res
  }

  /**
   * 更新商品信息
   * @param {number|string} id - 商品ID
   * @param {Object} data - 更新后的商品信息
   */
  const updateProduct = async (id, data) => {
    const res = await productAPI.updateProduct(id, data)
    if (res.data) {
      const index = products.value.findIndex((p) => p.id === id)
      if (index > -1) {
        // 合并更新商品信息
        products.value[index] = { ...products.value[index], ...res.data }
      }
    }
    return res
  }

  /**
   * 下架商品（软删除）
   * @param {number|string} id - 商品ID
   */
  const delistProduct = async (id) => {
    const res = await productAPI.deleteProduct(id)
    const p = products.value.find((item) => item.id === id)
    if (p) {
      // 软删除：只修改状态为 inactive
      p.status = 'inactive'
    }
    return res
  }

  // ==================== 暴露给外部使用 ====================
  return {
    categories,
    products,
    hotProducts,
    newProducts,
    banners,
    reviews,
    getProductById,
    getReviewsByProductId,
    fetchProducts,
    fetchHotProducts,
    fetchNewProducts,
    fetchReviews,
    addReview,
    addProduct,
    updateProduct,
    delistProduct
  }
})
