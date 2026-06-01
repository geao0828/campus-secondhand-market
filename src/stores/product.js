import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { productAPI, reviewAPI } from '../api'

export const useProductStore = defineStore('product', () => {
  const categories = ref([
    { id: 'digital', name: '数码', icon: 'Monitor' },
    { id: 'books', name: '书籍', icon: 'Reading' },
    { id: 'clothing', name: '服饰', icon: 'Shop' },
    { id: 'daily', name: '生活用品', icon: 'ShoppingBag' }
  ])

  const products = ref([])
  const hotProducts = ref([])
  const newProducts = ref([])
  const reviews = ref([])

  const banners = ref([
    { id: 1, image: 'https://picsum.photos/1200/400?random=101', title: '热门推荐', subtitle: '精选校园好物', link: '/products?sort=hot' },
    { id: 2, image: 'https://picsum.photos/1200/400?random=102', title: '最新发布', subtitle: '发现新鲜闲置', link: '/products?sort=new' },
    { id: 3, image: 'https://picsum.photos/1200/400?random=103', title: '书籍专区', subtitle: '教材教辅低价淘', link: '/products?category=books' }
  ])

  const getProductById = (id) => {
    const targetId = Number(id)
    return (
      products.value.find((p) => Number(p.id) === targetId) ||
      hotProducts.value.find((p) => Number(p.id) === targetId) ||
      newProducts.value.find((p) => Number(p.id) === targetId)
    )
  }
  const getReviewsByProductId = (productId) => reviews.value.filter((r) => r.productId === Number(productId))

  const fetchProducts = async (params = {}) => {
    try {
      let allProducts = []
      let currentPage = 1
      const pageSize = params.pageSize || 10
      
      while (true) {
        const res = await productAPI.getProducts({
          ...params,
          page: currentPage,
          pageSize: pageSize
        })
        const data = res.data?.list || res.data || []
        console.log(`商品列表API第${currentPage}页响应:`, data.length, '条')
        
        if (data.length === 0) break
        
        allProducts = [...allProducts, ...data]
        
        if (data.length < pageSize) break
        
        currentPage++
      }
      
      console.log('解析后的商品数据:', allProducts)
      products.value = allProducts
    } catch (e) {
      console.error('获取商品列表失败:', e)
      products.value = []
    }
  }

  const fetchHotProducts = async () => {
    try {
      const res = await productAPI.getHotProducts()
      const data = res.data?.list || res.data || []
      hotProducts.value = data.filter((p) => p.status === 'active')
    } catch (e) {
      console.error('获取热门商品失败:', e)
      hotProducts.value = []
    }
  }

  const fetchNewProducts = async () => {
    try {
      const res = await productAPI.getNewProducts()
      const data = res.data?.list || res.data || []
      newProducts.value = data.filter((p) => p.status === 'active')
    } catch (e) {
      console.error('获取最新商品失败:', e)
      newProducts.value = []
    }
  }

  const fetchReviews = async (productId) => {
    try {
      const res = await reviewAPI.getProductReviews(productId)
      reviews.value = res.data?.list || res.data || []
    } catch (e) {
      console.error('获取评价失败:', e)
      reviews.value = []
    }
  }

  const addReview = async (productId, review) => {
    const res = await reviewAPI.createReview(productId, review)
    if (res.data) {
      reviews.value.unshift(res.data)
    }
    return res
  }

  const addProduct = async (data) => {
    const res = await productAPI.publishProduct(data)
    if (res.data) {
      products.value.unshift(res.data)
    }
    return res
  }

  const updateProduct = async (id, data) => {
    const res = await productAPI.updateProduct(id, data)
    if (res.data) {
      const index = products.value.findIndex((p) => p.id === id)
      if (index > -1) {
        products.value[index] = { ...products.value[index], ...res.data }
      }
    }
    return res
  }

  const delistProduct = async (id) => {
    const res = await productAPI.deleteProduct(id)
    const p = products.value.find((item) => item.id === id)
    if (p) p.status = 'inactive'
    return res
  }

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
