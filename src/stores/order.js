/**
 * 订单状态管理
 * @description 管理订单列表、我的发布商品等
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { orderAPI, productAPI, userAPI } from '../api'

export const useOrderStore = defineStore('order', () => {
  // ==================== 状态定义 ====================

  /** 订单列表 */
  const orders = ref([])

  /** 我的发布商品列表 */
  const myProducts = ref([])

  // ==================== 订单操作 ====================

  /**
   * 创建新订单
   * @param {Object} orderData - 订单数据
   */
  const createOrder = async (orderData) => {
    const res = await orderAPI.createOrder(orderData)
    if (res.data) {
      orders.value.unshift({
        ...res.data,
        status: res.data.status || 'pending',
        statusText: res.data.statusText || '待付款'
      })
    }
    return res
  }

  /**
   * 获取订单列表
   * @param {Object} params - 查询参数
   */
  const fetchOrders = async (params) => {
    const res = await orderAPI.getOrders(params)
    orders.value = res.data?.list || res.data || []
  }

  /**
   * 支付订单
   * @param {number|string} orderId - 订单ID
   */
  const payOrder = async (orderId) => {
    const res = await orderAPI.payOrder(orderId)
    const order = orders.value.find((o) => o.id === orderId)
    if (order) {
      order.status = 'shipped'
      order.statusText = '待发货'
    }
    return res
  }

  /**
   * 确认收货
   * @param {number|string} orderId - 订单ID
   */
  const confirmReceive = async (orderId) => {
    const res = await orderAPI.confirmReceive(orderId)
    const order = orders.value.find((o) => o.id === orderId)
    if (order) {
      order.status = 'completed'
      order.statusText = '已完成'
    }
    return res
  }

  /**
   * 取消订单
   * @param {number|string} orderId - 订单ID
   */
  const cancelOrder = async (orderId) => {
    const res = await orderAPI.cancelOrder(orderId)
    const index = orders.value.findIndex((o) => o.id === orderId)
    if (index > -1) orders.value.splice(index, 1)
    return res
  }

  /**
   * 标记订单已评价
   * @param {number|string} orderId - 订单ID
   */
  const markReviewed = (orderId) => {
    const order = orders.value.find((o) => o.id === orderId)
    if (order) order.reviewed = true
  }

  /**
   * 按状态筛选订单
   * @param {string} status - 订单状态（pending/shipped/completed/all）
   */
  const getOrdersByStatus = (status) => {
    if (!status || status === 'all') return orders.value
    return orders.value.filter((o) => o.status === status)
  }

  // ==================== 我的发布商品 ====================

  /**
   * 获取我发布的商品列表
   */
  const fetchMyProducts = async () => {
    try {
      const res = await userAPI.getMyProducts()
      const data = res.data?.list || res.data || []
      myProducts.value = data
    } catch (e) {
      console.error('获取我的发布失败:', e)
      myProducts.value = []
    }
  }

  /**
   * 添加商品到我的发布列表（本地添加，后端同步）
   * @param {Object} data - 商品数据
   */
  const addMyProduct = (data) => {
    myProducts.value.unshift({
      id: data.id,
      name: data.name,
      price: data.price,
      category: data.category,
      condition: data.condition,
      description: data.description,
      image: data.image,
      stock: data.stock,
      views: 0,
      status: 'active',
      publishTime: data.publishTime || data.createdAt || new Date().toISOString(),
      seller: data.seller
    })
  }

  /**
   * 更新我发布的商品信息
   * @param {number|string} id - 商品ID
   * @param {Object} data - 更新后的数据
   */
  const updateMyProduct = async (id, data) => {
    const res = await productAPI.updateProduct(id, data)
    if (res.data) {
      const index = myProducts.value.findIndex((p) => p.id === id)
      if (index > -1) {
        myProducts.value[index] = { ...myProducts.value[index], ...res.data }
      }
    }
    return res
  }

  /**
   * 删除我发布的商品
   * @param {number|string} id - 商品ID
   */
  const removeMyProduct = async (id) => {
    const res = await productAPI.deleteProduct(id)
    const index = myProducts.value.findIndex((p) => p.id === id)
    if (index > -1) myProducts.value.splice(index, 1)
    return res
  }

  // ==================== 暴露给外部使用 ====================
  return {
    orders,
    myProducts,
    createOrder,
    fetchOrders,
    payOrder,
    confirmReceive,
    cancelOrder,
    markReviewed,
    getOrdersByStatus,
    fetchMyProducts,
    addMyProduct,
    updateMyProduct,
    removeMyProduct
  }
})
