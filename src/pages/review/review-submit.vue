<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { ReviewService } from '@/services/ReviewService'
import { useUserStore } from '@/stores/user.store'
import { ToastUtil } from '@/utils/ToastUtil'
import { httpUtil } from '@/api/http'
import { API_CONFIG } from '@/constants/api'
import { SensitiveFilter } from '@/utils/SensitiveFilter'
import { REVIEW_TAGS } from '@/models/review.types'
import { getImageUrl } from '@/constants/api'

const userStore = useUserStore()

const orderId = ref('')
const foodId = ref('')
const shopId = ref('')
const rating = ref(5)
const content = ref('')
const selectedTags = ref<string[]>([])
const isAnonymous = ref(false)
const images = ref<string[]>([])
const loading = ref(false)

onLoad((options: any) => {
  orderId.value = options?.orderId || ''
  foodId.value = options?.foodId || ''
  shopId.value = options?.shopId || ''
})

onMounted(() => {
  if (!userStore.isLogin) {
    uni.navigateTo({ url: '/pages/mine/login' })
    return
  }

  if (!orderId.value || !foodId.value || !shopId.value) {
    const pages = getCurrentPages()
    const currentPage = pages[pages.length - 1] as any
    const options = currentPage?.$page?.options || currentPage?.options || {}
    orderId.value = orderId.value || options.orderId || ''
    foodId.value = foodId.value || options.foodId || ''
    shopId.value = shopId.value || options.shopId || ''
  }
})

function toggleTag(tag: string) {
  const index = selectedTags.value.indexOf(tag)
  if (index >= 0) {
    selectedTags.value.splice(index, 1)
  } else {
    if (selectedTags.value.length < 3) {
      selectedTags.value.push(tag)
    } else {
      ToastUtil.showMessage('最多选择3个标签')
    }
  }
}

async function chooseImage() {
  const res = await uni.chooseImage({
    count: 3 - images.value.length,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera']
  })
  images.value.push(...res.tempFilePaths)
}

function removeImage(index: number) {
  images.value.splice(index, 1)
}

async function onSubmit() {
  if (!content.value.trim()) {
    ToastUtil.showMessage('请输入评价内容')
    return
  }

  const validation = SensitiveFilter.validateContent(content.value)
  if (!validation.valid) {
    ToastUtil.showMessage(validation.message)
    return
  }

  loading.value = true
  try {
    let uploadedImageUrls: string[] = []
    // 上传图片到服务器
    if (images.value.length > 0) {
      ToastUtil.showLoading('上传图片中...')
      for (const filePath of images.value) {
        const result = await httpUtil.upload<string>(
          API_CONFIG.PATHS.UPLOAD_IMAGE,
          filePath
        )
        uploadedImageUrls.push(result.data)
      }
      ToastUtil.hideLoading()
    }

    await ReviewService.submitReview({
      orderId: orderId.value,
      foodId: foodId.value,
      shopId: shopId.value,
      rating: rating.value,
      content: content.value.trim(),
      images: uploadedImageUrls,
      tags: selectedTags.value,
      isAnonymous: isAnonymous.value
    })

    ToastUtil.showSuccess('评价提交成功')
    setTimeout(() => uni.navigateBack(), 1200)
  } catch (e: any) {
    ToastUtil.hideLoading()
    ToastUtil.showError(e.message || '提交失败')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <scroll-view scroll-y class="review-submit-page" :style="{ height: '100vh' }">
    <!-- 星级评分 -->
    <view class="section">
      <text class="section-title">综合评分</text>
      <view class="star-rating">
        <text
          v-for="star in 5"
          :key="star"
          class="star"
          :class="{ active: star <= rating }"
          @click="rating = star"
        >
          {{ star <= rating ? '★' : '☆' }}
        </text>
      </view>
    </view>

    <!-- 评价内容 -->
    <view class="section">
      <text class="section-title">评价内容</text>
      <textarea
        v-model="content"
        class="content-input"
        placeholder="请输入评价内容（5-500字）"
        maxlength="500"
        :auto-height="true"
      />
      <text class="char-count">{{ content.length }}/500</text>
    </view>

    <!-- 图片选择 -->
    <view class="section">
      <text class="section-title">图片 (选填)</text>
      <view class="image-grid">
        <view
          v-for="(img, idx) in images"
          :key="idx"
          class="image-item"
        >
          <image :src="img" class="preview-image" mode="aspectFill" />
          <view class="remove-btn" @click="removeImage(idx)">
            <text>✕</text>
          </view>
        </view>
        <view class="add-image" v-if="images.length < 3" @click="chooseImage">
          <text class="add-icon">+</text>
          <text class="add-text">添加图片</text>
        </view>
      </view>
    </view>

    <!-- 评价标签 -->
    <view class="section">
      <text class="section-title">评价标签 (选填，最多3个)</text>
      <view class="tag-grid">
        <text
          v-for="tag in REVIEW_TAGS"
          :key="tag"
          class="tag-item"
          :class="{ active: selectedTags.includes(tag) }"
          @click="toggleTag(tag)"
        >
          {{ tag }}
        </text>
      </view>
    </view>

    <!-- 匿名开关 -->
    <view class="section">
      <view class="anonymous-row">
        <text class="anonymous-label">匿名评价</text>
        <switch :checked="isAnonymous" @change="(e: any) => isAnonymous = e.detail.value" color="#FF6B35" />
      </view>
    </view>

    <!-- 提交按钮 -->
    <view class="submit-wrapper">
      <view class="submit-btn" :class="{ disabled: loading }" @click="onSubmit">
        <text>{{ loading ? '提交中...' : '提交评价' }}</text>
      </view>
    </view>
  </scroll-view>
</template>

<style lang="scss" scoped>
.review-submit-page {
  background-color: #f5f5f5;
  padding-bottom: 30px;
}

.section {
  background-color: #ffffff;
  margin: 10px 16px;
  border-radius: 12px;
  padding: 16px;
}

.section-title {
  font-size: 15px;
  font-weight: bold;
  display: block;
  margin-bottom: 12px;
}

.star-rating {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.star {
  font-size: 36px;
  color: #ddd;
}

.star.active {
  color: #FF9500;
}

.content-input {
  width: 100%;
  min-height: 120px;
  font-size: 14px;
  color: #333;
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 12px;
}

.char-count {
  text-align: right;
  font-size: 12px;
  color: #ccc;
  margin-top: 4px;
}

.image-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.image-item {
  position: relative;
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
}

.preview-image {
  width: 100%;
  height: 100%;
}

.remove-btn {
  position: absolute;
  top: 0;
  right: 0;
  width: 22px;
  height: 22px;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 0 8px 0 8px;
  display: flex;
  align-items: center;
  justify-content: center;

  text {
    color: #ffffff;
    font-size: 12px;
  }
}

.add-image {
  width: 80px;
  height: 80px;
  border: 1px dashed #ddd;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;

  .add-icon {
    font-size: 24px;
    color: #ccc;
  }

  .add-text {
    font-size: 11px;
    color: #ccc;
  }
}

.tag-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag-item {
  font-size: 13px;
  color: #666;
  background-color: #f5f5f5;
  padding: 6px 14px;
  border-radius: 16px;
  border: 1px solid transparent;
}

.tag-item.active {
  background-color: #FFF5F0;
  color: #FF6B35;
  border-color: #FF6B35;
}

.anonymous-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.anonymous-label {
  font-size: 15px;
  color: #333;
}

.submit-wrapper {
  padding: 20px 16px;
}

.submit-btn {
  height: 50px;
  background: linear-gradient(135deg, #FF6B35, #FF8F5E);
  border-radius: 25px;
  display: flex;
  align-items: center;
  justify-content: center;

  &.disabled {
    opacity: 0.6;
  }

  text {
    color: #ffffff;
    font-size: 16px;
    font-weight: bold;
  }
}
</style>
