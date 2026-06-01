<template>
  <!-- 商品卡片组件：点击进入商品详情页 -->
  <el-card class="product-card" :body-style="{ padding: '0px' }" shadow="hover" @click="goToDetail">
    <div class="image-container">
      <!-- 商品图片：优先使用 image 字段，支持 imgUrl 兜底 -->
      <img :src="product.image || product.imgUrl || 'https://picsum.photos/200/200?random=card'" class="product-image" :alt="product.name" />
      <!-- 热门标签 -->
      <el-tag v-if="product.isHot" type="danger" class="hot-tag" size="small">热门</el-tag>
      <!-- 全新标签 -->
      <el-tag v-if="product.isNew" type="success" class="new-tag" size="small">全新</el-tag>
      <!-- 状态标签（无货/在售/下架/已售） -->
      <el-tag v-if="statusConfig" :type="statusConfig.type" class="status-tag" size="small">{{ statusConfig.label }}</el-tag>
    </div>
    <div class="card-content">
      <!-- 商品名称 -->
      <h3 class="product-name">{{ product.name }}</h3>
      <div class="price-row">
        <!-- 现价 -->
        <span class="current-price">¥{{ product.price }}</span>
        <!-- 原价（划线） -->
        <span class="original-price">¥{{ product.originalPrice }}</span>
      </div>
      <div class="info-row">
        <!-- 卖家名称 -->
        <span class="seller">{{ product.seller?.name || '匿名' }}</span>
        <!-- 发布时间 -->
        <span class="time">{{ formatTime(product) }}</span>
      </div>
    </div>
  </el-card>
</template>

<script setup>
import { useRouter } from 'vue-router'

/**
 * 商品卡片组件 Props
 */
const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const router = useRouter()

/**
 * 根据商品状态和库存计算显示的配置
 * - 库存为0：显示"无货"
 * - 状态 active：显示"在售"
 * - 状态 inactive：显示"下架"
 * - 状态 sold：显示"已售"
 */
const statusConfig = (() => {
  const status = props.product?.status
  const stock = props.product?.stock || 0
  if (stock <= 0) return { label: '无货', type: 'danger' }
  return {
    active: { label: '在售', type: 'success' },
    inactive: { label: '下架', type: 'warning' },
    sold: { label: '已售', type: 'info' }
  }[status]
})()

/**
 * 跳转到商品详情页
 */
const goToDetail = () => {
  router.push({ name: 'productDetail', params: { id: props.product.id } })
}

/**
 * 格式化发布时间
 * 支持多种日期字段：publishTime、createTime、createdAt
 */
const formatTime = (product) => {
  const time = product.publishTime || product.createTime || product.createdAt
  if (!time) return '未知'
  const date = new Date(time)
  if (isNaN(date.getTime())) return '未知'
  const month = date.getMonth() + 1
  const day = date.getDate()
  return `${month}月${day}日`
}
</script>

<style scoped>
.product-card {
  cursor: pointer;
  transition: transform 0.2s;
  height: 100%;
}

.product-card:hover {
  transform: translateY(-4px);
}

.image-container {
  position: relative;
  height: 160px;
  overflow: hidden;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hot-tag {
  position: absolute;
  top: 8px;
  left: 8px;
}

.new-tag {
  position: absolute;
  top: 8px;
  right: 8px;
}

.status-tag {
  position: absolute;
  bottom: 8px;
  left: 8px;
}

.card-content {
  padding: 12px;
}

.product-name {
  margin: 0 0 8px 0;
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.price-row {
  display: flex;
  align-items: baseline;
  margin-bottom: 8px;
}

.current-price {
  font-size: 18px;
  font-weight: bold;
  color: #f56c6c;
  margin-right: 8px;
}

.original-price {
  font-size: 12px;
  color: #999;
  text-decoration: line-through;
}

.info-row {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #999;
}
</style>
