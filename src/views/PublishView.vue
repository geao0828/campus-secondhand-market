<template>
  <div class="publish-page page-content">
    <el-card>
      <template #header>
        <span>{{ editingId ? '编辑商品' : '发布商品' }}</span>
      </template>
      <ProductForm
        :model="form"
        :categories="productStore.categories"
        :submit-text="editingId ? '保存修改' : '立即发布'"
        @submit="handleSubmit"
        @reset="handleReset"
      />
    </el-card>

    <el-card class="my-list">
      <template #header>我发布的商品</template>
      <el-table :data="orderStore.myProducts" empty-text="暂无发布">
        <el-table-column label="商品" min-width="240">
          <template #default="{ row }">
            <div class="cell-product">
              <img :src="row.image" alt="" />
              <span>{{ row.name }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="price" label="价格" width="100">
          <template #default="{ row }">¥{{ row.price }}</template>
        </el-table-column>
        <el-table-column prop="publishTime" label="发布时间" width="120" />
        <el-table-column label="状态" width="90">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'info'" size="small">
              {{ row.status === 'active' ? '在售' : '已售' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160" fixed="right">
          <template #default="{ row }">
            <template v-if="row.status === 'active'">
              <el-button size="small" link type="primary" @click="handleEdit(row)">编辑</el-button>
              <el-button size="small" link type="danger" @click="handleDelist(row)">下架</el-button>
            </template>
            <span v-else class="disabled-hint">已售</span>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useProductStore } from '../stores/product'
import { useOrderStore } from '../stores/order'
import { useUserStore } from '../stores/user'
import ProductForm from '../components/ProductForm.vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const productStore = useProductStore()
const orderStore = useOrderStore()
const userStore = useUserStore()

onMounted(() => {
  orderStore.fetchMyProducts()
})

const editingId = ref(null)
const form = reactive({
  name: '',
  category: '',
  condition: '',
  price: 0,
  originalPrice: 0,
  stock: 1,
  description: '',
  images: [],
  image: ''
})

const handleSubmit = async (data) => {
  const payload = {
    ...data,
    seller: {
      id: userStore.user?.id || 0,
      name: userStore.user?.name || '我',
      avatar: userStore.user?.avatar || '',
      rating: 5,
      soldCount: 0
    }
  }

  if (editingId.value) {
    await orderStore.updateMyProduct(editingId.value, payload)
    await productStore.updateProduct(editingId.value, payload)
    ElMessage.success('修改成功')
  } else {
    const res = await productStore.addProduct(payload)
    const created = res?.data
    if (created) {
      orderStore.addMyProduct({
        id: created.id,
        name: created.name,
        price: created.price,
        category: created.category,
        condition: created.condition,
        description: created.description,
        image: created.image,
        stock: created.stock
      })
      ElMessage.success('发布成功')
    }
  }
  handleReset()
}

const handleReset = () => {
  editingId.value = null
  Object.assign(form, {
    name: '',
    category: '',
    condition: '',
    price: 0,
    originalPrice: 0,
    stock: 1,
    description: '',
    images: [],
    image: ''
  })
}

const handleEdit = (row) => {
  editingId.value = row.id
  let images = []
  if (row.images) {
    if (Array.isArray(row.images)) {
      images = row.images
    } else if (typeof row.images === 'string') {
      try {
        images = JSON.parse(row.images)
      } catch {
        images = [row.image]
      }
    }
  } else {
    images = [row.image]
  }
  Object.assign(form, {
    name: row.name,
    category: row.category,
    condition: row.condition || '良好',
    price: row.price,
    originalPrice: row.originalPrice || row.price,
    stock: row.stock || 1,
    description: row.description || '',
    image: row.image,
    images: images
  })
}

const handleDelist = (row) => {
  ElMessageBox.confirm(`确定下架「${row.name}」吗？`, '下架确认', { type: 'warning' })
    .then(() => {
      orderStore.removeMyProduct(row.id)
      productStore.delistProduct(row.id)
      ElMessage.success('已下架')
    })
    .catch(() => {})
}
</script>

<style scoped>
@import '../styles/PublishView.css';
</style>
