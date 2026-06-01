<template>
  <!-- 商品发布/编辑表单 -->
  <el-form ref="formRef" :model="model" :rules="rules" label-width="100px" class="product-form">
    <!-- 商品名称 -->
    <el-form-item label="商品名称" prop="name">
      <el-input v-model="model.name" placeholder="请输入商品名称" maxlength="50" show-word-limit />
    </el-form-item>

    <!-- 商品分类 -->
    <el-form-item label="商品分类" prop="category">
      <el-select v-model="model.category" placeholder="请选择分类" style="width: 100%">
        <el-option
          v-for="category in categories"
          :key="category.id"
          :label="category.name"
          :value="category.id"
        />
      </el-select>
    </el-form-item>

    <!-- 商品成色 -->
    <el-form-item label="商品成色" prop="condition">
      <el-select v-model="model.condition" placeholder="请选择成色" style="width: 100%">
        <el-option v-for="item in conditionOptions" :key="item" :label="item" :value="item" />
      </el-select>
    </el-form-item>

    <!-- 商品价格 -->
    <el-form-item label="商品价格" prop="price">
      <el-input-number v-model="model.price" :min="0.01" :precision="2" style="width: 200px" />
      <span class="unit">元</span>
    </el-form-item>

    <!-- 原价（可选） -->
    <el-form-item label="原价">
      <el-input-number v-model="model.originalPrice" :min="0" :precision="2" style="width: 200px" />
      <span class="unit">元（可选）</span>
    </el-form-item>

    <!-- 库存数量 -->
    <el-form-item label="库存数量" prop="stock">
      <el-input-number v-model="model.stock" :min="1" :max="999" style="width: 200px" />
    </el-form-item>

    <!-- 商品图片上传 -->
    <el-form-item label="商品图片">
      <el-upload
        v-model:file-list="fileList"
        list-type="picture-card"
        accept="image/jpeg,image/png,image/webp,image/gif"
        :limit="5"
        :http-request="handleUpload"
        :on-remove="handleImageRemove"
        :before-upload="beforeUpload"
      >
        <el-icon><Plus /></el-icon>
      </el-upload>
      <div class="upload-tip">最多 5 张，单张不超过 5MB，支持 jpg / png / webp / gif</div>
    </el-form-item>

    <!-- 商品描述 -->
    <el-form-item label="商品描述" prop="description">
      <el-input
        v-model="model.description"
        type="textarea"
        :rows="4"
        placeholder="请描述品牌、型号、使用情况等"
        maxlength="500"
        show-word-limit
      />
    </el-form-item>

    <!-- 提交按钮（可自定义插槽） -->
    <el-form-item>
      <slot name="actions">
        <el-button type="primary" @click="submit">{{ submitText }}</el-button>
        <el-button @click="reset">重置</el-button>
      </slot>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { ref, watch } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { createUploadHandler } from '../utils/upload'

/**
 * 商品表单组件 Props
 * @param {Object} model - 表单数据对象（双向绑定）
 * @param {Array} categories - 分类选项列表
 * @param {String} submitText - 提交按钮文本
 */
const props = defineProps({
  model: { type: Object, required: true },
  categories: { type: Array, default: () => [] },
  submitText: { type: String, default: '提交' }
})

const emit = defineEmits(['submit', 'reset'])

const formRef = ref(null)
const fileList = ref([])

/** 商品成色选项 */
const conditionOptions = ['全新', '99新', '98新', '95新', '良好', '一般']

/** 表单验证规则 */
const rules = {
  name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
  category: [{ required: true, message: '请选择分类', trigger: 'change' }],
  condition: [{ required: true, message: '请选择成色', trigger: 'change' }],
  price: [{ required: true, message: '请输入价格', trigger: 'blur' }],
  description: [{ required: true, message: '请输入商品描述', trigger: 'blur' }],
  stock: [{ required: true, message: '请输入库存', trigger: 'blur' }]
}

/**
 * 从 model 同步文件列表到 fileList
 * 支持 images 数组和 image 单字符串两种格式
 */
const syncFileListFromModel = () => {
  const images = props.model.images?.length ? props.model.images : props.model.image ? [props.model.image] : []
  fileList.value = images.map((url, index) => ({
    name: `image-${index}`,
    url,
    status: 'success'
  }))
}

// 监听 model 变化，同步文件列表
watch(
  () => [props.model.images, props.model.image],
  () => syncFileListFromModel(),
  { immediate: true, deep: true }
)

/**
 * 上传前的校验
 * - 只允许图片格式
 * - 图片大小不超过 5MB
 */
const beforeUpload = (file) => {
  const isImage = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)
  const isLt5M = file.size / 1024 / 1024 < 5
  if (!isImage) {
    ElMessage.error('只能上传图片文件')
    return false
  }
  if (!isLt5M) {
    ElMessage.error('图片大小不能超过 5MB')
    return false
  }
  return true
}

/** 创建上传处理器 */
const handleUpload = createUploadHandler('product', (url) => {
  if (!props.model.images) props.model.images = []
  // 避免重复添加相同图片
  if (!props.model.images.includes(url)) {
    props.model.images.push(url)
  }
  // 设置第一张图片为主图
  props.model.image = props.model.images[0]
})

/**
 * 删除图片时的处理
 * 同步更新 model 中的 images 和 image
 */
const handleImageRemove = (file) => {
  const url = file.url
  if (url && props.model.images) {
    props.model.images = props.model.images.filter((item) => item !== url)
    // 更新主图为剩余第一张
    props.model.image = props.model.images[0] || ''
  }
}

/**
 * 提交表单
 * 先进行表单验证，验证通过后触发 submit 事件
 */
const submit = async () => {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return
  emit('submit', { ...props.model })
}

/**
 * 重置表单
 * 清空表单字段、文件列表，并触发 reset 事件
 */
const reset = () => {
  formRef.value?.resetFields()
  fileList.value = []
  props.model.images = []
  props.model.image = ''
  emit('reset')
}

// 暴露方法供父组件调用
defineExpose({ validate: () => formRef.value?.validate(), resetFields: () => formRef.value?.resetFields() })
</script>

<style scoped>
.product-form {
  max-width: 720px;
}

.unit {
  margin-left: 10px;
  color: #909399;
  font-size: 13px;
}

.upload-tip {
  font-size: 12px;
  color: #909399;
  margin-top: 8px;
  width: 100%;
}
</style>
