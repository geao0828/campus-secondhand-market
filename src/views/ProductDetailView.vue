<template>
  <div class="detail-page page-content" v-if="product">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/products' }">全部商品</el-breadcrumb-item>
      <el-breadcrumb-item>{{ product.name }}</el-breadcrumb-item>
    </el-breadcrumb>

    <el-row :gutter="24" class="top-row">
      <el-col :xs="24" :md="10">
        <el-card :body-style="{ padding: 0 }">
          <el-image :src="currentImage" fit="cover" class="main-image" />
          <div v-if="productImages.length > 1" class="thumb-list">
            <img
              v-for="(img, i) in productImages"
              :key="i"
              :src="img"
              :class="{ active: currentImage === img }"
              @click="currentImage = img"
            />
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :md="14">
        <el-card>
          <h1 class="title">{{ product.name }}</h1>
          <div class="price-box">
            <span class="price">¥{{ product.price }}</span>
            <span class="origin">原价 ¥{{ product.originalPrice }}</span>
            <el-tag type="danger" effect="plain">{{ discount }}折</el-tag>
          </div>
          <el-descriptions :column="1" border class="desc-block">
            <el-descriptions-item label="商品描述">{{ product.description }}</el-descriptions-item>
            <el-descriptions-item label="成色">{{ product.condition }}</el-descriptions-item>
            <el-descriptions-item label="分类">{{ categoryName }}</el-descriptions-item>
            <el-descriptions-item label="发布时间">{{ formatPublishTime(product.publishTime) }}</el-descriptions-item>
            <el-descriptions-item label="库存">{{ product.stock }} 件</el-descriptions-item>
          </el-descriptions>
          <div class="buy-row" v-if="!isOwnProduct">
            <span>数量</span>
            <el-input-number v-model="quantity" :min="1" :max="product.stock || 1" />
          </div>
          <div class="actions" v-if="isOwnProduct">
            <el-tag type="info">这是您发布的商品，不能购买</el-tag>
            <el-button size="large" :icon="Star" :type="isFavorite ? 'warning' : 'default'" @click="handleFavorite">
              {{ isFavorite ? '已收藏' : '收藏' }}
            </el-button>
          </div>
          <div class="actions" v-else>
            <template v-if="product.stock > 0">
              <el-button type="danger" size="large" @click="handleBuyNow">立即购买</el-button>
              <el-button type="primary" size="large" :icon="ShoppingCart" @click="handleAddToCart">加入购物车</el-button>
            </template>
            <template v-else>
              <el-button type="danger" size="large" disabled>库存不足</el-button>
            </template>
            <el-button size="large" :icon="Star" :type="isFavorite ? 'warning' : 'default'" @click="handleFavorite">
              {{ isFavorite ? '已收藏' : '收藏' }}
            </el-button>
            <el-button size="large" :icon="ChatDotRound" @click="handleChat">私聊卖家</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="24" class="bottom-row">
      <el-col :xs="24" :md="16">
        <el-card>
          <template #header>商品详情</template>
          <p>【物品描述】{{ product.description }}</p>
          <p>【成色说明】{{ product.condition }}，功能正常，支持校内面交或快递。</p>
        </el-card>
        <el-card class="review-section">
          <template #header>用户评价 ({{ reviews.length }})</template>
          <div v-for="review in reviews" :key="review.id" class="review-item">
            <div class="review-head">
              <el-avatar :size="36">{{ review.userName?.[0] || 'U' }}</el-avatar>
              <div>
                <strong>{{ review.userName }}</strong>
                <el-rate :model-value="review.rating" disabled size="small" />
              </div>
              <span class="time">{{ review.time }}</span>
            </div>
            <p>{{ review.content }}</p>
          </div>
          <el-empty v-if="!reviews.length" description="暂无评价" />
        </el-card>
      </el-col>
      <el-col :xs="24" :md="8">
        <el-card>
          <template #header>卖家信息</template>
          <div class="seller">
            <div class="seller-avatar">
              <el-avatar :size="56" :src="product.seller?.avatar">
                {{ product.seller?.name?.[0] || 'S' }}
              </el-avatar>
              <strong class="seller-name">{{ product.seller?.name }}</strong>
            </div>
            <p>已售 {{ product.seller?.soldCount }} 件 · 评分 {{ product.seller?.rating }}</p>
          </div>
          <el-button type="primary" plain block :icon="ChatDotRound" @click="handleChat">联系卖家</el-button>
        </el-card>
      </el-col>
    </el-row>
  </div>
  <div v-else class="page-content">
    <el-empty description="商品不存在或已下架" />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductStore } from '../stores/product'
import { useUserStore } from '../stores/user'
import { useOrderStore } from '../stores/order'
import { productAPI } from '../api'

import { ShoppingCart, Star, ChatDotRound } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const route = useRoute()
const router = useRouter()
const productStore = useProductStore()
const userStore = useUserStore()
const orderStore = useOrderStore()

onMounted(async () => {
  let currentProduct = null
  try {
    const res = await productAPI.getProductDetail(route.params.id)
    currentProduct = res.data?.data || res.data
    if (currentProduct) {
      const existing = productStore.getProductById(currentProduct.id)
      if (!existing) {
        productStore.products.unshift(currentProduct)
      }
    }
  } catch (e) {
    console.error('获取商品详情失败:', e)
  }
  await productStore.fetchProducts()
  if (currentProduct) {
    const existing = productStore.getProductById(currentProduct.id)
    if (!existing) {
      productStore.products.unshift(currentProduct)
    }
  }
  productStore.fetchReviews(route.params.id)
})

const quantity = ref(1)
const currentImage = ref('')

const product = computed(() => productStore.getProductById(route.params.id))
const reviews = computed(() => productStore.getReviewsByProductId(route.params.id))
const productImages = computed(() => {
  if (!product.value?.images) return []
  const images = product.value.images
  if (Array.isArray(images)) return images
  if (typeof images === 'string') {
    try {
      return JSON.parse(images)
    } catch {
      return []
    }
  }
  return []
})
const isFavorite = computed(() => product.value && userStore.isFavorite(product.value.id))
const isOwnProduct = computed(() => {
  if (!product.value?.seller?.id || !userStore.user?.id) return false
  return product.value.seller.id === userStore.user.id
})
const categoryName = computed(() =>
  productStore.categories.find((c) => c.id === product.value?.category)?.name || ''
)
const formatPublishTime = (time) => {
  if (!time) return '未知'
  const date = new Date(time)
  if (isNaN(date.getTime())) {
    if (typeof time === 'string' && time.includes('T')) {
      return time.replace('T', ' ')
    }
    return time
  }
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}`
}
const discount = computed(() => {
  if (!product.value?.originalPrice) return 10
  return Math.round((product.value.price / product.value.originalPrice) * 100) / 10
})

watch(
  product,
  (p) => {
    if (p) {
      currentImage.value = productImages.value[0] || p.image || p.imgUrl || 'https://picsum.photos/600/600?random=product'
    }
  },
  { immediate: true }
)

const handleAddToCart = () => {
  userStore.addToCart(product.value, quantity.value)
  ElMessage.success('已加入购物车')
}

const handleBuyNow = () => {
  orderStore.createOrder({
    productId: product.value.id,
    productName: product.value.name,
    productImage: product.value.image,
    price: product.value.price,
    quantity: quantity.value,
    seller: product.value.seller?.name,
    address: userStore.user?.address || '请完善收货地址'
  })
  ElMessage.success('下单成功，请前往订单页付款')
  router.push('/orders')
}

const handleFavorite = () => {
  if (isFavorite.value) {
    userStore.removeFavorite(product.value.id)
    ElMessage.success('已取消收藏')
  } else {
    userStore.addFavorite(product.value)
    ElMessage.success('收藏成功')
  }
}

const chatResponses = [
  '您好！商品还在的，需要了解什么细节吗？',
  '您好~ 这个是自用闲置，成色很新哦',
  '你好！价格可以小刀，有意私聊~',
  '在的在的，需要的话可以发更多细节图',
  '您好，这个商品刚挂不久，还没来得及整理详情',
  '你好！包邮的，当天可以发货',
  '在的，请问有什么问题吗？',
  '您好~ 爽快可刀，欢迎咨询！'
]

const handleChat = () => {
  const randomResponse = chatResponses[Math.floor(Math.random() * chatResponses.length)]
  const userAvatar = userStore.user?.avatar || ''
  const sellerAvatar = product.value.seller?.avatar || ''
  
  const chatContent = `
<div style="padding: 16px; font-size: 14px;">
  <div style="display: flex; align-items: flex-start; justify-content: flex-end; margin-bottom: 16px;">
    <div style="background: #409EFF; color: white; padding: 10px 14px; border-radius: 12px 0 12px 12px; max-width: 280px; word-break: break-all; margin-left: 12px;">你好，这个商品还在吗？</div>
    <img src="${userAvatar}" alt="我" style="width: 36px; height: 36px; border-radius: 50%; object-fit: cover; flex-shrink: 0; background: #409EFF;" onerror="this.style.display='none';this.previousSibling.style.marginRight='0';this.previousSibling.style.borderRadius='12px';">
    <div style="width: 36px; height: 36px; border-radius: 50%; background: #409EFF; color: white; display: none; align-items: center; justify-content: center; font-weight: bold; flex-shrink: 0;">${userStore.user?.name?.[0] || '我'}</div>
  </div>
  <div style="display: flex; align-items: flex-start;">
    <img src="${sellerAvatar}" alt="${product.value.seller?.name}" style="width: 36px; height: 36px; border-radius: 50%; object-fit: cover; flex-shrink: 0; background: #67C23A;" onerror="this.style.display='none';this.nextSibling.style.display='flex';">
    <div style="width: 36px; height: 36px; border-radius: 50%; background: #67C23A; color: white; display: none; align-items: center; justify-content: center; font-weight: bold; flex-shrink: 0;">${product.value.seller?.name?.[0] || '卖'}</div>
    <div style="background: #F5F5F5; padding: 10px 14px; border-radius: 0 12px 12px 12px; max-width: 280px; word-break: break-all; margin-left: 12px;"><strong>${product.value.seller?.name}：</strong>${randomResponse}</div>
  </div>
</div>
  `
  ElMessageBox.alert(chatContent.trim(), '💬 私聊卖家', {
    confirmButtonText: '关闭',
    dangerouslyUseHTMLString: true
  })
}
</script>

<style scoped>
@import '../styles/ProductDetailView.css';
</style>
