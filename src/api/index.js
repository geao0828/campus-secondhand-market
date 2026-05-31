/**
 * API 统一出口，对接后端接口
 */
import request from '../utils/request'

export const productAPI = {
  getProducts: (params) => request({ url: '/products', method: 'get', params }),
  getProductDetail: (id) => request({ url: `/products/${id}`, method: 'get' }),
  getHotProducts: () => request({ url: '/products/hot', method: 'get' }),
  getNewProducts: () => request({ url: '/products/new', method: 'get' }),
  getProductsByCategory: (categoryId, params) =>
    request({ url: `/products/category/${categoryId}`, method: 'get', params }),
  searchProducts: (keyword, params) =>
    request({ url: '/products/search', method: 'get', params: { keyword, ...params } }),
  publishProduct: (data) => request({ url: '/products', method: 'post', data }),
  updateProduct: (id, data) => request({ url: `/products/${id}`, method: 'put', data }),
  deleteProduct: (id) => request({ url: `/products/${id}`, method: 'delete' })
}

export const categoryAPI = {
  getCategories: () => request({ url: '/categories', method: 'get' })
}

export const orderAPI = {
  getOrders: (params) => request({ url: '/orders', method: 'get', params }),
  getOrderDetail: (id) => request({ url: `/orders/${id}`, method: 'get' }),
  createOrder: (data) => request({ url: '/orders', method: 'post', data }),
  cancelOrder: (id) => request({ url: `/orders/${id}/cancel`, method: 'post' }),
  confirmReceive: (id) => request({ url: `/orders/${id}/confirm`, method: 'post' }),
  payOrder: (id) => request({ url: `/orders/${id}/pay`, method: 'post' })
}

export const userAPI = {
  login: (data) => request({ url: '/user/login', method: 'post', data }),
  register: (data) => request({ url: '/user/register', method: 'post', data }),
  getUserInfo: () => request({ url: '/user/info', method: 'get' }),
  updateUserInfo: (data) => request({ url: '/user/info', method: 'put', data }),
  getMyProducts: () => request({ url: '/user/products', method: 'get' }),
  getMyOrders: () => request({ url: '/user/orders', method: 'get' }),
  getMyFavorites: () => request({ url: '/user/favorites', method: 'get' }),
  addFavorite: (productId) => request({ url: `/user/favorites/${productId}`, method: 'post' }),
  removeFavorite: (productId) => request({ url: `/user/favorites/${productId}`, method: 'delete' })
}

export const cartAPI = {
  getCart: () => request({ url: '/cart', method: 'get' }),
  addToCart: (productId, quantity) =>
    request({ url: '/cart', method: 'post', data: { productId, quantity } }),
  updateCartItem: (productId, quantity) =>
    request({ url: `/cart/${productId}`, method: 'put', data: { quantity } }),
  removeFromCart: (productId) => request({ url: `/cart/${productId}`, method: 'delete' }),
  clearCart: () => request({ url: '/cart', method: 'delete' })
}

export const reviewAPI = {
  getProductReviews: (productId) => request({ url: `/products/${productId}/reviews`, method: 'get' }),
  createReview: (productId, data) =>
    request({ url: `/products/${productId}/reviews`, method: 'post', data })
}

export const uploadAPI = {
  uploadImage(file, type = 'product') {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', type)
    return request({
      url: '/upload/image',
      method: 'post',
      data: formData
    })
  }
}
