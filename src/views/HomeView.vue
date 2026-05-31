<template>
  <div class="home-page">
    <div class="banner-area">
      <el-carousel height="320px" :interval="5000">
        <el-carousel-item v-for="banner in productStore.banners" :key="banner.id">
          <div
            class="banner-slide"
            :style="{ backgroundImage: `url(${banner.image})` }"
            @click="router.push(banner.link)"
          >
            <div class="banner-overlay">
              <h2>{{ banner.title }}</h2>
              <p>{{ banner.subtitle }}</p>
            </div>
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>

    <div class="page-container">
      <div class="content-layout">
        <div class="main-column">
          <section class="section">
            <div class="section-header">
              <h2><el-icon><TrendCharts /></el-icon> 热门推荐</h2>
              <el-button link type="primary" @click="router.push('/products?sort=hot')">
                查看更多 <el-icon><ArrowRight /></el-icon>
              </el-button>
            </div>
            <el-row :gutter="16">
              <el-col v-for="product in productStore.hotProducts" :key="product.id" :xs="12" :sm="8" :md="6">
                <ProductCard :product="product" />
              </el-col>
            </el-row>
          </section>

          <section class="section">
            <div class="section-header">
              <h2><el-icon><Clock /></el-icon> 最新发布</h2>
              <el-button link type="primary" @click="router.push('/products?sort=new')">
                查看更多 <el-icon><ArrowRight /></el-icon>
              </el-button>
            </div>
            <el-row :gutter="16">
              <el-col v-for="product in productStore.newProducts" :key="product.id" :xs="12" :sm="8" :md="6">
                <ProductCard :product="product" />
              </el-col>
            </el-row>
          </section>
        </div>

        <aside class="sidebar">
          <el-card>
            <template #header><span>快捷入口</span></template>
            <div class="quick-grid">
              <div class="quick-item" @click="router.push('/publish')">
                <el-icon :size="22" color="#409eff"><Sell /></el-icon>
                <span>发布闲置</span>
              </div>
              <div class="quick-item" @click="router.push('/orders')">
                <el-icon :size="22" color="#67c23a"><List /></el-icon>
                <span>我的订单</span>
              </div>
              <div class="quick-item" @click="router.push('/profile')">
                <el-icon :size="22" color="#e6a23c"><User /></el-icon>
                <span>个人中心</span>
              </div>
            </div>
          </el-card>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useProductStore } from '../stores/product'
import ProductCard from '../components/ProductCard.vue'
import { TrendCharts, Clock, ArrowRight, Sell, List, User } from '@element-plus/icons-vue'

const router = useRouter()
const productStore = useProductStore()
</script>

<style scoped>
.home-page {
  background: #f5f7fa;
}

.banner-slide {
  height: 320px;
  background-size: cover;
  background-position: center;
  cursor: pointer;
  position: relative;
}

.banner-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, rgba(0, 0, 0, 0.45), transparent);
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: 80px;
  color: #fff;
}

.banner-overlay h2 {
  margin: 0 0 8px;
  font-size: 32px;
}

.banner-overlay p {
  margin: 0;
  font-size: 16px;
  opacity: 0.9;
}

.page-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

.content-layout {
  display: flex;
  gap: 24px;
}

.main-column {
  flex: 1;
  min-width: 0;
}

.sidebar {
  width: 220px;
  flex-shrink: 0;
}

.section {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-header h2 {
  margin: 0;
  font-size: 18px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.quick-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.quick-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  background: #f5f7fa;
  font-size: 14px;
}

.quick-item:hover {
  background: #ecf5ff;
}
</style>
