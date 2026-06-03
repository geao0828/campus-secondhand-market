<template>
  <div class="order-page page-content">
    <el-card>
      <template #header>
        <div class="header-row">
          <span><el-icon><List /></el-icon> 订单管理</span>
        </div>
      </template>

      <el-tabs v-model="activeTab">
        <el-tab-pane label="全部订单" name="all" />
        <el-tab-pane label="待付款" name="pending" />
        <el-tab-pane label="待发货" name="shipped" />
        <el-tab-pane label="已完成" name="completed" />
      </el-tabs>

      <el-empty v-if="!filteredOrders.length" description="暂无订单" />

      <div v-for="order in filteredOrders" :key="order.id" class="order-item">
        <div class="order-top">
          <span>订单号：{{ order.id }}</span>
          <el-tag :type="statusType(order.status)">{{ order.statusText }}</el-tag>
        </div>
        <div class="order-body">
          <img :src="order.productImage" alt="" />
          <div class="info">
            <h4>{{ order.productName }}</h4>
            <p>卖家：{{ order.seller }}</p>
            <p>下单：{{ order.createTime }}</p>
            <p>地址：{{ order.address }}</p>
          </div>
          <div class="amount">
            <p>¥{{ order.price }}</p>
            <span>x{{ order.quantity }}</span>
          </div>
        </div>
        <div class="order-foot">
          <span>实付 <strong>¥{{ order.price * order.quantity }}</strong></span>
          <div class="btns">
            <el-button v-if="order.status === 'pending'" type="primary" @click="handlePay(order)">立即付款</el-button>
            <el-button v-if="order.status === 'pending'" @click="handleCancel(order)">取消订单</el-button>
            <el-button v-if="order.status === 'shipped'" type="success" @click="handleConfirm(order)">确认收货</el-button>
            <el-button
              v-if="order.status === 'completed' && !order.reviewed"
              type="warning"
              @click="openReview(order)"
            >
              评价商品
            </el-button>
            <el-tag v-if="order.reviewed" type="info" size="small">已评价</el-tag>
          </div>
        </div>
      </div>
    </el-card>

    <el-dialog v-model="showReview" title="评价商品" width="480px" destroy-on-close>
      <el-form :model="reviewForm" label-width="80px">
        <el-form-item label="评分">
          <el-rate v-model="reviewForm.rating" show-text />
        </el-form-item>
        <el-form-item label="评价">
          <el-input v-model="reviewForm.content" type="textarea" :rows="4" placeholder="分享你的购买体验" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showReview = false">取消</el-button>
        <el-button type="primary" @click="submitReview">提交</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useOrderStore } from '../stores/order'
import { useProductStore } from '../stores/product'
import { useUserStore } from '../stores/user'
import { List } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const orderStore = useOrderStore()
const productStore = useProductStore()
const userStore = useUserStore()

onMounted(() => {
  orderStore.fetchOrders()
})

const activeTab = ref('all')
const showReview = ref(false)
const currentOrder = ref(null)
const reviewForm = ref({ rating: 5, content: '' })

const filteredOrders = computed(() => orderStore.getOrdersByStatus(activeTab.value))

const statusType = (status) => ({ pending: 'warning', shipped: 'primary', completed: 'success' }[status] || 'info')

const handlePay = (order) => {
  ElMessageBox.confirm(`确认支付 ¥${order.price * order.quantity}？`, '支付确认')
    .then(() => {
      orderStore.payOrder(order.id)
      ElMessage.success('支付成功，等待卖家发货')
    })
    .catch(() => {})
}

const handleCancel = (order) => {
  ElMessageBox.confirm('确定取消该订单？', '提示', { type: 'warning' })
    .then(() => {
      orderStore.cancelOrder(order.id)
      ElMessage.success('订单已取消')
    })
    .catch(() => {})
}

const handleConfirm = (order) => {
  ElMessageBox.confirm('确认已收到商品？', '确认收货')
    .then(() => {
      orderStore.confirmReceive(order.id)
      ElMessage.success('已确认收货')
    })
    .catch(() => {})
}

const openReview = (order) => {
  currentOrder.value = order
  reviewForm.value = { rating: 5, content: '' }
  showReview.value = true
}

const submitReview = () => {
  if (!reviewForm.value.content.trim()) {
    ElMessage.warning('请填写评价内容')
    return
  }
  productStore.addReview(currentOrder.value.productId, {
    userId: userStore.user?.id || 0,
    userName: userStore.user?.name || '匿名用户',
    rating: reviewForm.value.rating,
    content: reviewForm.value.content
  })
  orderStore.markReviewed(currentOrder.value.id)
  showReview.value = false
  ElMessage.success('评价已提交')
}
</script>

<style scoped>
@import '../styles/OrderView.css';
</style>
