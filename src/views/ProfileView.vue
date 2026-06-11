<template>
  <div class="profile-page page-content">
    <el-row :gutter="24">
      <el-col :xs="24" :md="6">
        <el-card class="side-card">
          <div class="profile-head">
            <el-avatar :size="72" :src="userStore.user?.avatar">
              {{ (userStore.user?.name || 'U')[0] }}
            </el-avatar>
            <h3>{{ userStore.user?.name || '未登录' }}</h3>
            <p v-if="userStore.isLoggedIn">学号/ID: {{ userStore.user?.id }}</p>
            <el-button v-if="!userStore.isLoggedIn" type="primary" size="small" @click="promptLogin">去登录</el-button>
            <el-button v-else type="danger" link @click="handleLogout">退出登录</el-button>
          </div>
          <el-menu :default-active="activeMenu" @select="(k) => (activeMenu = k)">
            <el-menu-item index="info"><el-icon><User /></el-icon>个人信息</el-menu-item>
            <el-menu-item index="products"><el-icon><Goods /></el-icon>我的发布</el-menu-item>
            <el-menu-item index="orders"><el-icon><List /></el-icon>我的订单</el-menu-item>
            <el-menu-item index="favorites"><el-icon><Star /></el-icon>我的收藏</el-menu-item>
          </el-menu>
        </el-card>
      </el-col>

      <el-col :xs="24" :md="18">
        <el-card v-show="activeMenu === 'info'">
          <template #header>修改个人信息</template>
          <el-form :model="userInfo" label-width="90px" style="max-width: 480px">
            <el-form-item label="头像">
              <el-upload
                class="avatar-uploader"
                :show-file-list="false"
                accept="image/jpeg,image/png,image/webp,image/gif"
                :disabled="!userStore.isLoggedIn"
                :http-request="handleAvatarUpload"
                :before-upload="beforeAvatarUpload"
              >
                <div class="avatar-upload-box">
                  <el-avatar :size="80" :src="displayAvatar" />
                  <span v-if="userStore.isLoggedIn" class="avatar-tip">点击上传头像</span>
                </div>
              </el-upload>
            </el-form-item>
            <el-form-item label="用户名">
              <el-input v-model="userInfo.name" />
            </el-form-item>
            <el-form-item label="手机号">
              <el-input v-model="userInfo.phone" />
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input v-model="userInfo.email" />
            </el-form-item>
            <el-form-item label="收货地址">
              <el-input v-model="userInfo.address" type="textarea" :rows="2" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="saveInfo">保存</el-button>
            </el-form-item>
          </el-form>
        </el-card>

        <el-card v-show="activeMenu === 'products'">
          <template #header>我的发布</template>
          <el-empty v-if="!orderStore.myProducts.length" description="暂无发布" />
          <el-row v-else :gutter="16">
            <el-col v-for="p in orderStore.myProducts" :key="p.id" :xs="12" :sm="8">
              <ProductCard :product="mapMyProduct(p)" />
            </el-col>
          </el-row>
        </el-card>

        <el-card v-show="activeMenu === 'orders'">
          <template #header>我的订单</template>
          <el-button type="primary" link @click="$router.push('/orders')">查看全部订单 →</el-button>
          <el-table :data="orderStore.orders" style="margin-top: 12px">
            <el-table-column prop="id" label="订单号" width="140" />
            <el-table-column prop="productName" label="商品" />
            <el-table-column label="金额" width="100">
              <template #default="{ row }">¥{{ row.price * row.quantity }}</template>
            </el-table-column>
            <el-table-column label="状态" width="100">
            <template #default="{ row }">
              <el-tag :type="getStatusType(row.status)" size="small">{{ getStatusText(row.status) }}</el-tag>
            </template>
          </el-table-column>
          </el-table>
        </el-card>

        <el-card v-show="activeMenu === 'favorites'">
          <template #header>我的收藏</template>
          <el-empty v-if="!userStore.favorites.length" description="暂无收藏，去逛逛吧" />
          <el-row v-else :gutter="16">
            <el-col v-for="product in userStore.favorites" :key="product.id" :xs="12" :sm="8">
              <ProductCard :product="product" />
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, reactive, watch, computed, onMounted } from 'vue'
import { useUserStore } from '../stores/user'
import { useOrderStore } from '../stores/order'
import ProductCard from '../components/ProductCard.vue'

import { createUploadHandler } from '../utils/upload'
import { User, Goods, List, Star } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const userStore = useUserStore()
const orderStore = useOrderStore()

onMounted(() => {
  orderStore.fetchMyProducts()
  orderStore.fetchOrders()
  userStore.fetchFavorites()
})

const activeMenu = ref('info')

watch(activeMenu, (menu) => {
  if (menu === 'products') {
    orderStore.fetchMyProducts()
  } else if (menu === 'orders') {
    orderStore.fetchOrders()
  } else if (menu === 'favorites') {
    userStore.fetchFavorites()
  }
})
const userInfo = reactive({
  name: '',
  phone: '',
  email: '',
  address: '',
  avatar: ''
})

const displayAvatar = computed(() => userInfo.avatar || userStore.user?.avatar || '')

watch(
  () => userStore.user,
  (u) => {
    if (u) {
      userInfo.name = u.name || ''
      userInfo.phone = u.phone || ''
      userInfo.email = u.email || ''
      userInfo.address = u.address || ''
      userInfo.avatar = u.avatar || ''
    }
  },
  { immediate: true }
)

const beforeAvatarUpload = (file) => {
  const ok = file.size / 1024 / 1024 < 5
  if (!ok) ElMessage.error('头像大小不能超过 5MB')
  return ok
}

const handleAvatarUpload = createUploadHandler('avatar', (url) => {
  userInfo.avatar = url
  ElMessage.success('头像上传成功，请点击保存')
})

const mapMyProduct = (p) => ({
  id: p.id,
  name: p.name,
  price: p.price,
  originalPrice: p.price,
  image: p.image,
  description: p.description || '',
  condition: p.condition || '良好',
  seller: { name: '我' },
  publishTime: p.publishTime || p.createdAt,
  status: p.status || 'active'
})

const statusMap = {
  pending: { text: '待付款', type: 'warning' },
  paid: { text: '待发货', type: 'primary' },
  shipped: { text: '待收货', type: 'info' },
  completed: { text: '已完成', type: 'success' },
  cancelled: { text: '已取消', type: 'danger' }
}

const getStatusText = (status) => statusMap[status]?.text || status || '未知'
const getStatusType = (status) => statusMap[status]?.type || 'default'

const saveInfo = async () => {
  if (!userStore.isLoggedIn) {
    ElMessage.warning('请先登录')
    return
  }
  try {
    await userStore.updateProfile({ ...userInfo })
    ElMessage.success('保存成功')
  } catch {
    ElMessage.error('保存失败，请重试')
  }
}

const handleLogout = () => {
  userStore.logout()
  // 清空个人信息表单
  userInfo.name = ''
  userInfo.phone = ''
  userInfo.email = ''
  userInfo.address = ''
  userInfo.avatar = ''
  ElMessage.success('已退出登录')
}

const promptLogin = () => ElMessage.info('请点击顶部导航栏「登录」按钮')
</script>

<style scoped>
@import '../styles/ProfileView.css';
</style>
