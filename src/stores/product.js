import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { mockProducts, mockReviews } from '../data/mock'
// import { productAPI } from '../api'

export const useProductStore = defineStore('product', () => {
  const categories = ref([
    { id: 'digital', name: '数码', icon: 'Monitor' },
    { id: 'books', name: '书籍', icon: 'Reading' },
    { id: 'clothing', name: '服饰', icon: 'Shop' },
    { id: 'daily', name: '生活用品', icon: 'ShoppingBag' }
  ])

  const products = ref([...mockProducts])

  const banners = ref([
    { id: 1, image: 'https://picsum.photos/1200/400?random=101', title: '热门推荐', subtitle: '精选校园好物', link: '/products?sort=hot' },
    { id: 2, image: 'https://picsum.photos/1200/400?random=102', title: '最新发布', subtitle: '发现新鲜闲置', link: '/products?sort=new' },
    { id: 3, image: 'https://picsum.photos/1200/400?random=103', title: '书籍专区', subtitle: '教材教辅低价淘', link: '/products?category=books' }
  ])

  const reviews = ref([...mockReviews])

  const hotProducts = computed(() => products.value.filter((p) => p.isHot && p.status !== 'inactive'))
  const newProducts = computed(() =>
    [...products.value]
      .filter((p) => p.isNew && p.status !== 'inactive')
      .sort((a, b) => new Date(b.publishTime) - new Date(a.publishTime))
  )

  const getProductById = (id) => products.value.find((p) => p.id === Number(id))
  const getReviewsByProductId = (productId) => reviews.value.filter((r) => r.productId === Number(productId))

  const addReview = (productId, review) => {
    reviews.value.unshift({
      id: Date.now(),
      productId: Number(productId),
      ...review,
      time: new Date().toLocaleString()
    })
  }

  const addProduct = (data) => {
    const id = Date.now()
    const item = {
      id,
      ...data,
      image: data.image || data.images?.[0] || `https://picsum.photos/400/300?random=${id}`,
      images: data.images?.length ? data.images : [data.image || `https://picsum.photos/400/300?random=${id}`],
      originalPrice: data.originalPrice || data.price * 1.5,
      isHot: false,
      isNew: true,
      status: 'active',
      publishTime: new Date().toLocaleString(),
      seller: data.seller || { id: 1, name: '我', avatar: '', rating: 5, soldCount: 0 }
    }
    products.value.unshift(item)
    return item
    // 对接后端: return productAPI.publishProduct(data)
  }

  const updateProduct = (id, data) => {
    const index = products.value.findIndex((p) => p.id === id)
    if (index > -1) {
      products.value[index] = { ...products.value[index], ...data }
    }
    // 对接后端: return productAPI.updateProduct(id, data)
  }

  const delistProduct = (id) => {
    const p = products.value.find((item) => item.id === id)
    if (p) p.status = 'inactive'
    // 对接后端: return productAPI.deleteProduct(id)
  }

  const fetchProducts = async () => {
    // const res = await productAPI.getProducts()
    // products.value = res.data
  }

  return {
    categories,
    products,
    banners,
    reviews,
    hotProducts,
    newProducts,
    getProductById,
    getReviewsByProductId,
    addReview,
    addProduct,
    updateProduct,
    delistProduct,
    fetchProducts
  }
})
