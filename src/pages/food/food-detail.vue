<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { FoodService } from '@/services/FoodService'
import { ReviewService } from '@/services/ReviewService'
import { useCartStore } from '@/stores/cart.store'
import { useShopStore } from '@/stores/shop.store'
import { MathUtil } from '@/utils/MathUtil'
import { getImageUrl } from '@/constants/api'
import type { FoodItem } from '@/models/food.types'
import type { Review } from '@/models/review.types'
import ReviewCard from '@/components/review/ReviewCard.vue'

const cartStore = useCartStore()
const shopStore = useShopStore()

const foodId = ref('')
const food = ref<FoodItem | null>(null)
const reviews = ref<Review[]>([])
const activeTab = ref<'detail' | 'review'>('detail')
const buyNum = ref(1)
const loading = ref(false)

onLoad((options: any) => {
  foodId.value = options?.foodId || ''
})

onMounted(() => {
  if (!foodId.value) {
    const pages = getCurrentPages()
    const currentPage = pages[pages.length - 1] as any
    const options = currentPage?.$page?.options || currentPage?.options || {}
    foodId.value = options.foodId || ''
  }

  if (foodId.value) {
    loadData()
  }
})

async function loadData() {
  loading.value = true
  try {
    const foodData = await FoodService.getFoodDetail(foodId.value)
    food.value = foodData

    // 获取评价（需要 shopId）
    const shopId = foodData.shopId || shopStore.currentShop?.id
    if (shopId) {
      try {
        const reviewData = await ReviewService.getReviews(String(shopId))
        reviews.value = reviewData.list || []
      } catch (e) {
        console.warn('加载评价失败:', e)
      }
    }
  } catch (e) {
    console.error('加载详情失败:', e)
  } finally {
    loading.value = false
  }
}

function onTabChange(tab: 'detail' | 'review') {
  activeTab.value = tab
}

function onAddToCart() {
  if (food.value) {
    cartStore.addToCart({ ...food.value, buyNum: buyNum.value })
    uni.showToast({ title: '已加入购物车', icon: 'success' })
  }
}

function onBuyNow() {
  onAddToCart()
  uni.navigateTo({ url: '/pages/order/order-preview' })
}
</script>

<template>
  <scroll-view scroll-y class="food-detail-page" :style="{ height: '100vh' }">
    <!-- 商品图片轮播 -->
    <swiper class="image-swiper" v-if="food?.images?.length">
      <swiper-item v-for="img in food.images" :key="img.id">
        <image :src="getImageUrl(img.imageUrl)" class="food-main-image" mode="aspectFill" />
      </swiper-item>
    </swiper>
    <image v-else :src="getImageUrl(food?.image || '')" class="food-main-image" mode="aspectFill" />

    <!-- 基本信息 -->
    <view class="info-section" v-if="food">
      <text class="food-name">{{ food.name }}</text>
      <text class="food-desc">{{ food.description }}</text>
      <view class="food-meta">
        <image src="/static/ic_public_choose_selected.svg" class="icon-inline" /><text class="meta-item"> {{ food.rating }}</text>
        <text class="meta-item">月售 {{ food.monthlySales }}</text>
      </view>
      <view class="price-box">
        <text class="current-price">¥{{ food.price }}</text>
        <text class="original-price" v-if="food.originalPrice > food.price">¥{{ food.originalPrice }}</text>
      </view>
    </view>

    <!-- Tab切换 -->
    <view class="tab-section">
      <view
        class="tab-btn"
        :class="{ active: activeTab === 'detail' }"
        @click="onTabChange('detail')"
      >
        <text>商品详情</text>
      </view>
      <view
        class="tab-btn"
        :class="{ active: activeTab === 'review' }"
        @click="onTabChange('review')"
      >
        <text>评价({{ reviews.length }})</text>
      </view>
    </view>

    <!-- 商品详情内容 -->
    <view v-if="activeTab === 'detail'" class="detail-content">
      <text class="detail-text">商品描述: {{ food?.description || '暂无详细描述' }}</text>
    </view>

    <!-- 评价列表 -->
    <view v-if="activeTab === 'review'">
      <ReviewCard
        v-for="review in reviews"
        :key="review.id"
        :review="review"
        @like="() => {}"
      />
      <view v-if="reviews.length === 0" class="no-reviews">
        <text>暂无评价</text>
      </view>
    </view>
  </scroll-view>

  <!-- 底部操作栏 -->
  <view class="bottom-bar" v-if="food">
    <view class="quantity-control">
      <view class="qty-btn" @click="buyNum > 1 && buyNum--">
        <text>−</text>
      </view>
      <text class="qty">{{ buyNum }}</text>
      <view class="qty-btn" @click="buyNum++">
        <text>+</text>
      </view>
    </view>
    <view class="action-btns">
      <view class="btn-cart" @click="onAddToCart">
        <text>加入购物车</text>
      </view>
      <view class="btn-buy" @click="onBuyNow">
        <text>立即购买</text>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.food-detail-page {
  background-color: #f5f5f5;
  padding-bottom: 60px;
}

.image-swiper {
  height: 260px;
}

.food-main-image {
  width: 100%;
  height: 260px;
}

.info-section {
  background-color: #ffffff;
  padding: 16px;
  margin-bottom: 12px;
}

.icon-inline {
  width: 18px;
  height: 18px;
  vertical-align: middle;
  margin-right: 4px;
}

.food-name {
  font-size: 20px;
  font-weight: bold;
  display: block;
}

.food-desc {
  font-size: 13px;
  color: #999;
  margin-top: 6px;
  display: block;
}

.food-meta {
  display: flex;
  gap: 16px;
  margin-top: 8px;

  .meta-item {
    font-size: 12px;
    color: #666;
  }
}

.price-box {
  display: flex;
  align-items: baseline;
  margin-top: 12px;

  .current-price {
    font-size: 24px;
    color: #FF6B35;
    font-weight: bold;
  }

  .original-price {
    font-size: 13px;
    color: #ccc;
    text-decoration: line-through;
    margin-left: 8px;
  }
}

.tab-section {
  display: flex;
  background-color: #ffffff;
  margin-bottom: 12px;
}

.tab-btn {
  flex: 1;
  text-align: center;
  padding: 14px 0;
  font-size: 14px;
  color: #999;
  position: relative;
}

.tab-btn.active {
  color: #FF6B35;
  font-weight: bold;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 30px;
    height: 3px;
    background-color: #FF6B35;
    border-radius: 1.5px;
  }
}

.detail-content {
  padding: 16px;
  background-color: #ffffff;
}

.detail-text {
  font-size: 14px;
  color: #666;
  line-height: 1.8;
}

.no-reviews {
  text-align: center;
  padding: 40px;
  color: #999;
  font-size: 14px;
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.05);
  z-index: 100;
}

.quantity-control {
  display: flex;
  align-items: center;
  gap: 10px;

  .qty-btn {
    width: 28px;
    height: 28px;
    border-radius: 14px;
    background-color: #f5f5f5;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
  }

  .qty {
    font-size: 16px;
    font-weight: bold;
  }
}

.action-btns {
  display: flex;
  gap: 10px;
}

.btn-cart {
  padding: 10px 20px;
  background-color: #FFF0E6;
  border-radius: 22px;

  text {
    color: #FF6B35;
    font-size: 14px;
    font-weight: bold;
  }
}

.btn-buy {
  padding: 10px 24px;
  background: linear-gradient(135deg, #FF6B35, #FF8F5E);
  border-radius: 22px;

  text {
    color: #ffffff;
    font-size: 14px;
    font-weight: bold;
  }
}
</style>
