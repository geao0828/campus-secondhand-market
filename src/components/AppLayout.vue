<template>
  <div class="app-layout">
    <header class="page-header">
      <div class="header-content">
        <div class="logo" @click="router.push('/')">
          <span class="logo-icon">🎓</span>
          <span class="logo-text">校园闲置</span>
        </div>
        <div class="search-area">
          <el-input
            v-model="searchKeyword"
            placeholder="搜罗校园好物..."
            size="large"
            clearable
            class="main-search"
            @keyup.enter="handleSearch"
          >
            <template #append>
              <el-button :icon="Search" @click="handleSearch">搜索</el-button>
            </template>
          </el-input>
        </div>
        <nav class="header-nav">
          <span class="nav-item" :class="{ active: isActive('/') }" @click="router.push('/')">首页</span>
          <span class="nav-item" :class="{ active: isAllProductsActive }" @click="router.push('/products')">全部</span>
          <span class="nav-item" :class="{ active: isCategoryActive('digital') }" @click="router.push('/products?category=digital')">数码</span>
          <span class="nav-item" :class="{ active: isCategoryActive('books') }" @click="router.push('/products?category=books')">书籍</span>
          <span class="nav-item" :class="{ active: isCategoryActive('clothing') }" @click="router.push('/products?category=clothing')">服饰</span>
          <span class="nav-item" :class="{ active: isCategoryActive('daily') }" @click="router.push('/products?category=daily')">生活</span>
        </nav>
        <div class="header-actions">
          <el-button text @click="router.push('/publish')">
            <el-icon><Sell /></el-icon> 发布
          </el-button>
          <el-badge :value="userStore.cartCount" :hidden="userStore.cartCount === 0">
            <el-button :icon="ShoppingCart" circle @click="showCart = true" />
          </el-badge>
          <el-avatar
            v-if="userStore.isLoggedIn"
            :size="36"
            :src="userStore.user?.avatar"
            @click="router.push('/profile')"
            style="cursor: pointer"
          >
            {{ (userStore.user?.name || '用').charAt(0) }}
          </el-avatar>
          <el-button v-else type="primary" round @click="showLogin = true">登录</el-button>
        </div>
      </div>
    </header>

    <main class="layout-main">
      <SideAd position="left" />
      <SideAd position="right" />
      <div class="layout-center">
        <router-view />
      </div>
    </main>

    <footer class="page-footer">
      <p>校园二手交易平台 · 让闲置流动起来</p>
    </footer>

    <el-dialog v-model="showLogin" title="欢迎登录" width="400px" destroy-on-close>
      <el-form :model="loginForm" label-width="60px">
        <el-form-item label="账号">
          <el-input v-model="loginForm.username" placeholder="请输入学号或用户名" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" show-password />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showLogin = false">取消</el-button>
        <el-button type="primary" @click="handleLogin">登录</el-button>
        <el-button link type="primary" @click="switchToRegister">去注册</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="showRegister" title="用户注册" width="420px" destroy-on-close>
      <el-form :model="registerForm" label-width="70px" :rules="registerRules" ref="registerFormRef">
        <el-form-item label="账号" prop="username">
          <el-input v-model="registerForm.username" placeholder="请输入学号或用户名（4-20 位）" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="registerForm.password" type="password" placeholder="请输入密码（6-20 位）" show-password />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="registerForm.confirmPassword" type="password" placeholder="请再次输入密码" show-password />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="registerForm.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="registerForm.email" placeholder="请输入邮箱地址" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showRegister = false">取消</el-button>
        <el-button type="primary" @click="handleRegister">注册</el-button>
        <el-button link type="primary" @click="switchToLogin">去登录</el-button>
      </template>
    </el-dialog>

    <el-drawer v-model="showCart" title="购物车" size="400px">
      <el-empty v-if="userStore.cart.length === 0" description="购物车是空的" />
      <div v-else class="cart-list">
        <div v-for="item in userStore.cart" :key="item.product.id" class="cart-item">
          <img :src="item.product.image" class="cart-image" alt="" />
          <div class="cart-info">
            <h4>{{ item.product.name }}</h4>
            <p class="cart-price">¥{{ item.product.price }}</p>
          </div>
          <el-input-number
            v-model="item.quantity"
            :min="1"
            :max="item.product.stock"
            size="small"
            @change="(val) => userStore.updateCartQuantity(item.product.id, val)"
          />
          <el-button
            type="danger"
            :icon="Delete"
            circle
            size="small"
            @click="userStore.removeFromCart(item.product.id)"
          />
        </div>
      </div>
      <template v-if="userStore.cart.length" #footer>
        <div class="cart-footer">
          <span>合计: <strong>¥{{ cartTotal }}</strong></span>
          <el-button type="primary" @click="handleCheckout">去结算</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { useOrderStore } from '../stores/order'
import SideAd from './SideAd.vue'
import { Search, ShoppingCart, Delete, Sell } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const orderStore = useOrderStore()

const searchKeyword = ref(route.query.keyword || '')
const showLogin = ref(false)
const showRegister = ref(false)
const showCart = ref(false)
const loginForm = ref({ username: '', password: '' })
const registerForm = ref({
  username: '',
  password: '',
  confirmPassword: '',
  phone: '',
  email: ''
})
const registerFormRef = ref(null)

// 表单验证规则
const validateUsername = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入账号'))
  } else if (value.length < 4 || value.length > 20) {
    callback(new Error('账号长度必须在 4-20 位之间'))
  } else {
    callback()
  }
}

const validatePassword = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入密码'))
  } else if (value.length < 6 || value.length > 20) {
    callback(new Error('密码长度必须在 6-20 位之间'))
  } else {
    callback()
  }
}

const validateConfirmPassword = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请再次输入密码'))
  } else if (value !== registerForm.value.password) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

const validatePhone = (rule, value, callback) => {
  if (value && !/^1[3-9]\d{9}$/.test(value)) {
    callback(new Error('请输入正确的手机号'))
  } else {
    callback()
  }
}

const validateEmail = (rule, value, callback) => {
  if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    callback(new Error('请输入正确的邮箱地址'))
  } else {
    callback()
  }
}

const registerRules = {
  username: [{ validator: validateUsername, trigger: 'blur' }],
  password: [{ validator: validatePassword, trigger: 'blur' }],
  confirmPassword: [{ validator: validateConfirmPassword, trigger: 'blur' }],
  phone: [{ validator: validatePhone, trigger: 'blur' }],
  email: [{ validator: validateEmail, trigger: 'blur' }]
}

const cartTotal = computed(() =>
  userStore.cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
)

const isActive = (path) => route.path === path

const isAllProductsActive = computed(
  () => route.path === '/products' && !route.query.category
)

const isCategoryActive = (category) =>
  route.path === '/products' && route.query.category === category

const handleSearch = () => {
  router.push({
    path: '/products',
    query: searchKeyword.value.trim() ? { keyword: searchKeyword.value.trim() } : {}
  })
}

const handleLogin = async () => {
  if (!loginForm.value.username) {
    ElMessage.warning('请输入账号')
    return
  }
  try {
    await userStore.login({
      username: loginForm.value.username,
      password: loginForm.value.password
    })
    showLogin.value = false
    ElMessage.success('登录成功')
  } catch {
    ElMessage.error('登录失败，请检查后端服务')
  }
}

const switchToRegister = () => {
  showLogin.value = false
  showRegister.value = true
}

const switchToLogin = () => {
  showRegister.value = false
  showLogin.value = true
}

const handleRegister = async () => {
  if (!registerFormRef.value) return
  
  await registerFormRef.value.validate(async (valid) => {
    if (!valid) return
    
    try {
      await userStore.register({
        username: registerForm.value.username,
        name: registerForm.value.username,  // 将用户名同时作为 name 传递
        password: registerForm.value.password,
        phone: registerForm.value.phone,
        email: registerForm.value.email
      })
      showRegister.value = false
      ElMessage.success('注册成功，请登录')
      showLogin.value = true
      // 清空注册表单
      registerForm.value = {
        username: '',
        password: '',
        confirmPassword: '',
        phone: '',
        email: ''
      }
    } catch (err) {
      ElMessage.error(err.message || '注册失败，请重试')
    }
  })
}

const handleCheckout = () => {
  if (!userStore.isLoggedIn) {
    showLogin.value = true
    ElMessage.warning('请先登录')
    return
  }
  userStore.cart.forEach((item) => {
    orderStore.createOrder({
      productId: item.product.id,
      productName: item.product.name,
      productImage: item.product.image,
      price: item.product.price,
      quantity: item.quantity,
      seller: item.product.seller?.name || '卖家',
      address: userStore.user?.address || '默认地址'
    })
  })
  userStore.clearCart()
  showCart.value = false
  ElMessage.success('下单成功')
  router.push('/orders')
}
</script>

<style scoped>
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.page-header {
  background: #fff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  height: 72px;
  display: flex;
  align-items: center;
  padding: 0 24px;
  gap: 24px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  flex-shrink: 0;
}

.logo-icon {
  font-size: 28px;
}

.logo-text {
  font-size: 20px;
  font-weight: 700;
  color: #222;
}

.search-area {
  flex: 1;
  max-width: 420px;
}

.main-search :deep(.el-input-group__append) {
  background: #409eff;
  border-color: #409eff;
}

.main-search :deep(.el-input-group__append .el-button) {
  color: #fff;
}

.header-nav {
  display: flex;
  gap: 20px;
  flex-shrink: 0;
}

.nav-item {
  font-size: 14px;
  color: #666;
  cursor: pointer;
  padding-bottom: 4px;
  transition: color 0.2s;
}

.nav-item:hover,
.nav-item.active {
  color: #409eff;
  font-weight: 500;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.layout-main {
  flex: 1;
  position: relative;
}

.layout-center {
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.page-footer {
  text-align: center;
  padding: 24px;
  color: #909399;
  font-size: 13px;
  background: #fff;
  border-top: 1px solid #ebeef5;
}

.page-footer p {
  margin: 0;
}

.cart-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.cart-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f5f7fa;
  border-radius: 8px;
}

.cart-image {
  width: 64px;
  height: 64px;
  object-fit: cover;
  border-radius: 6px;
}

.cart-info {
  flex: 1;
  min-width: 0;
}

.cart-info h4 {
  margin: 0 0 6px;
  font-size: 13px;
  font-weight: normal;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.cart-price {
  margin: 0;
  color: #f56c6c;
  font-weight: 600;
}

.cart-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cart-footer strong {
  color: #f56c6c;
  font-size: 18px;
}
</style>
