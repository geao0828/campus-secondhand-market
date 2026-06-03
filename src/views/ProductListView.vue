<template>
  <div class="list-page page-content">
    <el-card class="filter-card">
      <el-row :gutter="16" align="middle">
        <el-col :xs="24" :sm="10">
          <el-input
            v-model="searchKeyword"
            placeholder="输入关键词搜索商品..."
            clearable
            @keyup.enter="applyFilters"
          >
            <template #prefix><el-icon><Search /></el-icon></template>
          </el-input>
        </el-col>
        <el-col :xs="12" :sm="7">
          <el-select v-model="selectedCategory" placeholder="全部分类" clearable style="width: 100%">
            <el-option label="全部分类" value="" />
            <el-option
              v-for="category in productStore.categories"
              :key="category.id"
              :label="category.name"
              :value="category.id"
            />
          </el-select>
        </el-col>
        <el-col :xs="12" :sm="7">
          <el-select v-model="sortBy" placeholder="排序方式" style="width: 100%">
            <el-option label="综合排序" value="default" />
            <el-option label="价格从低到高" value="price_asc" />
            <el-option label="价格从高到低" value="price_desc" />
            <el-option label="最新发布" value="time_desc" />
          </el-select>
        </el-col>
      </el-row>
      <div class="filter-actions">
        <el-button type="primary" :icon="Search" @click="applyFilters">搜索</el-button>
        <el-button @click="resetFilters">重置</el-button>
      </div>
    </el-card>

    <div class="result-bar">
      共找到 <strong>{{ total }}</strong> 件商品
    </div>

    <el-row :gutter="16">
      <el-col v-for="product in pagedProducts" :key="product.id" :xs="12" :sm="8" :md="6">
        <ProductCard :product="product" />
      </el-col>
    </el-row>
    <el-empty v-if="total === 0" description="没有找到相关商品" />

    <div v-if="total > 0" class="pagination-wrap">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[8, 12, 16, 24]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        background
        @current-change="handlePageChange"
        @size-change="handleSizeChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductStore } from '../stores/product'
import ProductCard from '../components/ProductCard.vue'
import { Search } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const productStore = useProductStore()

onMounted(async () => {
  await productStore.fetchProducts()
  console.log('商品列表页面 - store中的商品:', productStore.products)
})

const searchKeyword = ref(route.query.keyword || '')
const selectedCategory = ref(route.query.category || '')
const sortBy = ref(route.query.sort === 'hot' || route.query.sort === 'new' ? 'time_desc' : 'default')
const currentPage = ref(Number(route.query.page) || 1)
const pageSize = ref(Number(route.query.pageSize) || 8)

const syncFromRoute = () => {
  searchKeyword.value = route.query.keyword || ''
  selectedCategory.value = route.query.category || ''
  currentPage.value = Number(route.query.page) || 1
  pageSize.value = Number(route.query.pageSize) || 8
  if (route.query.sort === 'hot') sortBy.value = 'default'
  else if (route.query.sort === 'new') sortBy.value = 'time_desc'
}

watch(() => route.query, syncFromRoute, { immediate: true })

const filteredProducts = computed(() => {
  let list = productStore.products.filter((p) => p.status === 'active')

  if (route.query.sort === 'hot') {
    list = list.filter((p) => p.isHot)
  } else if (route.query.sort === 'new') {
    list = list.filter((p) => p.isNew)
  }

  if (searchKeyword.value.trim()) {
    const kw = searchKeyword.value.trim()
    list = list.filter((p) => p.name.includes(kw) || p.description.includes(kw))
  }

  if (selectedCategory.value) {
    list = list.filter((p) => p.category === selectedCategory.value)
  }

  list = [...list]
  if (sortBy.value === 'price_asc') list.sort((a, b) => a.price - b.price)
  if (sortBy.value === 'price_desc') list.sort((a, b) => b.price - a.price)
  if (sortBy.value === 'time_desc') list.sort((a, b) => new Date(b.publishTime) - new Date(a.publishTime))

  return list
})

const total = computed(() => filteredProducts.value.length)

const pagedProducts = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredProducts.value.slice(start, start + pageSize.value)
})

watch([searchKeyword, selectedCategory, sortBy, () => route.query.sort], () => {
  currentPage.value = 1
})

const updateRouteQuery = () => {
  router.replace({
    path: '/products',
    query: {
      ...(searchKeyword.value.trim() ? { keyword: searchKeyword.value.trim() } : {}),
      ...(selectedCategory.value ? { category: selectedCategory.value } : {}),
      ...(route.query.sort ? { sort: route.query.sort } : {}),
      page: String(currentPage.value),
      pageSize: String(pageSize.value)
    }
  })
}

const applyFilters = () => {
  currentPage.value = 1
  router.push({
    path: '/products',
    query: {
      ...(searchKeyword.value.trim() ? { keyword: searchKeyword.value.trim() } : {}),
      ...(selectedCategory.value ? { category: selectedCategory.value } : {}),
      page: '1',
      pageSize: String(pageSize.value)
    }
  })
}

const resetFilters = () => {
  searchKeyword.value = ''
  selectedCategory.value = ''
  sortBy.value = 'default'
  currentPage.value = 1
  pageSize.value = 8
  router.push('/products')
}

const handlePageChange = () => {
  updateRouteQuery()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const handleSizeChange = () => {
  currentPage.value = 1
  updateRouteQuery()
}
</script>

<style scoped>
@import '../styles/ProductListView.css';
</style>
