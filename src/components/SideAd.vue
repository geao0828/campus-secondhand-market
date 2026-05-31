<template>
  <aside v-show="visible" class="side-ad" :class="position">
    <button type="button" class="ad-close" aria-label="关闭广告" @click="handleClose">
      <el-icon><Close /></el-icon>
    </button>
    <a class="ad-link" href="javascript:void(0)" @click.prevent="handleClick">
      <div class="ad-badge">广告</div>
      <div class="ad-visual" :class="`ad-visual--${position}`">
        <span class="ad-emoji">{{ ad.emoji }}</span>
      </div>
      <h4 class="ad-title">{{ ad.title }}</h4>
      <p class="ad-desc">{{ ad.desc }}</p>
      <span class="ad-cta">{{ ad.cta }}</span>
    </a>
  </aside>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Close } from '@element-plus/icons-vue'

const props = defineProps({
  position: {
    type: String,
    required: true,
    validator: (v) => ['left', 'right'].includes(v)
  }
})

const router = useRouter()
const storageKey = `campus_ad_${props.position}_closed`

const visible = ref(true)

const ads = {
  left: {
    emoji: '📚',
    title: '教材特惠季',
    desc: '二手教材低至 3 折，毕业季清仓',
    cta: '去看看 →',
    link: '/products?category=books'
  },
  right: {
    emoji: '📱',
    title: '数码换购',
    desc: '手机平板以旧换新，校内面交',
    cta: '立即了解 →',
    link: '/products?category=digital'
  }
}

const ad = ads[props.position]

onMounted(() => {
  if (localStorage.getItem(storageKey) === '1') {
    visible.value = false
  }
})

const handleClose = () => {
  visible.value = false
  localStorage.setItem(storageKey, '1')
}

const handleClick = () => {
  router.push(ad.link)
}
</script>

<style scoped>
.side-ad {
  width: 160px;
  position: fixed;
  top: 88px;
  z-index: 50;
}

.side-ad.left {
  left: max(16px, calc((100vw - 1200px) / 2 - 180px));
}

.side-ad.right {
  right: max(16px, calc((100vw - 1200px) / 2 - 180px));
}

.ad-close {
  position: absolute;
  top: 6px;
  right: 6px;
  z-index: 2;
  width: 22px;
  height: 22px;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.45);
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  transition: background 0.2s;
}

.ad-close:hover {
  background: rgba(0, 0, 0, 0.65);
}

.ad-link {
  display: block;
  position: relative;
  padding: 28px 14px 16px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  text-decoration: none;
  color: inherit;
  transition: transform 0.2s, box-shadow 0.2s;
  overflow: hidden;
}

.ad-link:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.ad-badge {
  position: absolute;
  top: 8px;
  left: 10px;
  font-size: 10px;
  color: #909399;
  background: #f4f4f5;
  padding: 2px 6px;
  border-radius: 4px;
}

.ad-visual {
  height: 100px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
}

.ad-visual--left {
  background: linear-gradient(135deg, #e8f4ff 0%, #d4e8ff 100%);
}

.ad-visual--right {
  background: linear-gradient(135deg, #fff3e8 0%, #ffe4cc 100%);
}

.ad-emoji {
  font-size: 40px;
}

.ad-title {
  margin: 0 0 8px;
  font-size: 15px;
  font-weight: 600;
  color: #303133;
  line-height: 1.3;
}

.ad-desc {
  margin: 0 0 12px;
  font-size: 12px;
  color: #909399;
  line-height: 1.5;
}

.ad-cta {
  font-size: 13px;
  color: #409eff;
  font-weight: 500;
}

@media (max-width: 1440px) {
  .side-ad {
    display: none !important;
  }
}
</style>
