import { defineStore } from 'pinia'
import { ref } from 'vue'
import { orderAPI, productAPI, userAPI } from '../api'

export const useOrderStore = defineStore('order', () => {
  const orders = ref([])
  const myProducts = ref([])

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

  const fetchOrders = async (params) => {
    const res = await orderAPI.getOrders(params)
    orders.value = res.data?.list || res.data || []
  }

  const payOrder = async (orderId) => {
    const res = await orderAPI.payOrder(orderId)
    const order = orders.value.find((o) => o.id === orderId)
    if (order) {
      order.status = 'shipped'
      order.statusText = '待发货'
    }
    return res
  }

  const confirmReceive = async (orderId) => {
    const res = await orderAPI.confirmReceive(orderId)
    const order = orders.value.find((o) => o.id === orderId)
    if (order) {
      order.status = 'completed'
      order.statusText = '已完成'
    }
    return res
  }

  const cancelOrder = async (orderId) => {
    const res = await orderAPI.cancelOrder(orderId)
    const index = orders.value.findIndex((o) => o.id === orderId)
    if (index > -1) orders.value.splice(index, 1)
    return res
  }

  const markReviewed = (orderId) => {
    const order = orders.value.find((o) => o.id === orderId)
    if (order) order.reviewed = true
  }

  const getOrdersByStatus = (status) => {
    if (!status || status === 'all') return orders.value
    return orders.value.filter((o) => o.status === status)
  }

  const fetchMyProducts = async () => {
    try {
      const res = await userAPI.getMyProducts()
      myProducts.value = res.data?.list || res.data || []
    } catch (e) {
      console.error('获取我的发布失败:', e)
      myProducts.value = []
    }
  }

  const addMyProduct = async (data) => {
    const res = await productAPI.publishProduct(data)
    if (res.data) {
      myProducts.value.unshift({
        id: res.data.id,
        views: 0,
        status: 'active',
        publishTime: new Date().toLocaleDateString(),
        ...data
      })
    }
    return res
  }

  const updateMyProduct = async (id, data) => {
    const res = await productAPI.updateProduct(id, data)
    if (res.data) {
      const index = myProducts.value.findIndex((p) => p.id === id)
      if (index > -1) myProducts.value[index] = { ...myProducts.value[index], ...res.data }
    }
    return res
  }

  const removeMyProduct = async (id) => {
    const res = await productAPI.deleteProduct(id)
    const index = myProducts.value.findIndex((p) => p.id === id)
    if (index > -1) myProducts.value.splice(index, 1)
    return res
  }

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
