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
              <el-col v-for="product in productStore.hotProducts.slice(0, 12)" :key="product.id" :xs="12" :sm="6" :md="6">
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
              <el-col v-for="product in productStore.newProducts.slice(0, 12)" :key="product.id" :xs="12" :sm="6" :md="6">
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
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useProductStore } from '../stores/product'
import ProductCard from '../components/ProductCard.vue'
import { TrendCharts, Clock, ArrowRight, Sell, List, User } from '@element-plus/icons-vue'

const router = useRouter()
const productStore = useProductStore()

onMounted(() => {
  productStore.fetchHotProducts()
  productStore.fetchNewProducts()
})
</script>

<style scoped>
@import '../styles/HomeView.css';
</style>
