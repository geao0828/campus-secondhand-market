/**
 * API 接口统一出口
 * @description 封装所有与后端交互的 API 接口，按功能模块划分
 */
import request from '../utils/request'

/**
 * 商品相关 API
 */
export const productAPI = {
  // 获取商品列表（支持分页和筛选）
  getProducts: (params) => request({ url: '/products', method: 'get', params }),
  // 获取商品详情
  getProductDetail: (id) => request({ url: `/products/${id}`, method: 'get' }),
  // 获取热门商品
  getHotProducts: () => request({ url: '/products/hot', method: 'get' }),
  // 获取最新商品
  getNewProducts: () => request({ url: '/products/new', method: 'get' }),
  // 按分类获取商品
  getProductsByCategory: (categoryId, params) =>
    request({ url: `/products/category/${categoryId}`, method: 'get', params }),
  // 搜索商品
  searchProducts: (keyword, params) =>
    request({ url: '/products/search', method: 'get', params: { keyword, ...params } }),
  // 发布商品
  publishProduct: (data) => request({ url: '/products', method: 'post', data }),
  // 更新商品信息
  updateProduct: (id, data) => request({ url: `/products/${id}`, method: 'put', data }),
  // 删除商品
  deleteProduct: (id) => request({ url: `/products/${id}`, method: 'delete' })
}

/**
 * 分类相关 API
 */
export const categoryAPI = {
  // 获取所有分类
  getCategories: () => request({ url: '/categories', method: 'get' })
}

/**
 * 订单相关 API
 */
export const orderAPI = {
  // 获取订单列表
  getOrders: (params) => request({ url: '/orders', method: 'get', params }),
  // 获取订单详情
  getOrderDetail: (id) => request({ url: `/orders/${id}`, method: 'get' }),
  // 创建订单
  createOrder: (data) => request({ url: '/orders', method: 'post', data }),
  // 取消订单
  cancelOrder: (id) => request({ url: `/orders/${id}/cancel`, method: 'post' }),
  // 确认收货
  confirmReceive: (id) => request({ url: `/orders/${id}/confirm`, method: 'post' }),
  // 支付订单
  payOrder: (id) => request({ url: `/orders/${id}/pay`, method: 'post' })
}

/**
 * 用户相关 API
 */
export const userAPI = {
  // 用户登录
  login: (data) => request({ url: '/user/login', method: 'post', data }),
  // 用户注册
  register: (data) => request({ url: '/user/register', method: 'post', data }),
  // 获取用户信息
  getUserInfo: () => request({ url: '/user/info', method: 'get' }),
  // 更新用户信息
  updateUserInfo: (data) => request({ url: '/user/info', method: 'put', data }),
  // 获取我的发布
  getMyProducts: () => request({ url: '/user/products', method: 'get' }),
  // 获取我的订单
  getMyOrders: () => request({ url: '/user/orders', method: 'get' }),
  // 获取我的收藏
  getMyFavorites: () => request({ url: '/user/favorites', method: 'get' }),
  // 添加收藏
  addFavorite: (productId) => request({ url: `/user/favorites/${productId}`, method: 'post' }),
  // 取消收藏
  removeFavorite: (productId) => request({ url: `/user/favorites/${productId}`, method: 'delete' })
}

/**
 * 购物车相关 API
 */
export const cartAPI = {
  // 获取购物车列表
  getCart: () => request({ url: '/cart', method: 'get' }),
  // 添加到购物车
  addToCart: (productId, quantity) =>
    request({ url: '/cart', method: 'post', data: { productId, quantity } }),
  // 更新购物车商品数量
  updateCartItem: (productId, quantity) =>
    request({ url: `/cart/${productId}`, method: 'put', data: { quantity } }),
  // 从购物车移除商品
  removeFromCart: (productId) => request({ url: `/cart/${productId}`, method: 'delete' }),
  // 清空购物车
  clearCart: () => request({ url: '/cart', method: 'delete' })
}

/**
 * 商品评价相关 API
 */
export const reviewAPI = {
  // 获取商品评价列表
  getProductReviews: (productId) => request({ url: `/products/${productId}/reviews`, method: 'get' }),
  // 提交商品评价
  createReview: (productId, data) =>
    request({ url: `/products/${productId}/reviews`, method: 'post', data })
}

/**
 * 文件上传 API
 */
export const uploadAPI = {
  /**
   * 上传图片
   * @param {File} file - 图片文件
   * @param {string} type - 上传类型（product/avatar）
   */
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
