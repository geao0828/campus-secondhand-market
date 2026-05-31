import { defineStore } from 'pinia'
import { ref } from 'vue'
import { mockOrders, mockMyProducts } from '../data/mock'
// import { orderAPI } from '../api'

export const useOrderStore = defineStore('order', () => {
  const orders = ref([...mockOrders])

  const myProducts = ref([...mockMyProducts])

  const createOrder = (orderData) => {
    const newOrder = {
      id: `ORD${Date.now()}`,
      ...orderData,
      status: 'pending',
      statusText: '待付款',
      createTime: new Date().toLocaleString(),
      reviewed: false
    }
    orders.value.unshift(newOrder)
    return newOrder
    // 对接后端: return orderAPI.createOrder(orderData)
  }

  const payOrder = (orderId) => {
    const order = orders.value.find((o) => o.id === orderId)
    if (order) {
      order.status = 'shipped'
      order.statusText = '待发货'
    }
    // orderAPI.payOrder(orderId)
  }

  const confirmReceive = (orderId) => {
    const order = orders.value.find((o) => o.id === orderId)
    if (order) {
      order.status = 'completed'
      order.statusText = '已完成'
    }
    // orderAPI.confirmReceive(orderId)
  }

  const cancelOrder = (orderId) => {
    const index = orders.value.findIndex((o) => o.id === orderId)
    if (index > -1) orders.value.splice(index, 1)
    // orderAPI.cancelOrder(orderId)
  }

  const markReviewed = (orderId) => {
    const order = orders.value.find((o) => o.id === orderId)
    if (order) order.reviewed = true
  }

  const getOrdersByStatus = (status) => {
    if (!status || status === 'all') return orders.value
    return orders.value.filter((o) => o.status === status)
  }

  const addMyProduct = (data) => {
    myProducts.value.unshift({
      id: Date.now(),
      views: 0,
      status: 'active',
      publishTime: new Date().toLocaleDateString(),
      ...data
    })
  }

  const updateMyProduct = (id, data) => {
    const index = myProducts.value.findIndex((p) => p.id === id)
    if (index > -1) myProducts.value[index] = { ...myProducts.value[index], ...data }
  }

  const removeMyProduct = (id) => {
    const index = myProducts.value.findIndex((p) => p.id === id)
    if (index > -1) myProducts.value.splice(index, 1)
  }

  return {
    orders,
    myProducts,
    createOrder,
    payOrder,
    confirmReceive,
    cancelOrder,
    markReviewed,
    getOrdersByStatus,
    addMyProduct,
    updateMyProduct,
    removeMyProduct
  }
})
