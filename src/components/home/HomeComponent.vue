<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { FoodService } from '@/services/FoodService'
import { useShopStore } from '@/stores/shop.store'
import type { FoodItem } from '@/models/food.types'
import FoodRecommendCard from '@/components/food/FoodRecommendCard.vue'

const shopStore = useShopStore()

const hotRanking = ref<FoodItem[]>([])
const popularRecommend = ref<FoodItem[]>([])
const banners = ref([
  { id: '1', image: '', title: '新品上线' },
  { id: '2', image: '', title: '限时优惠' },
  { id: '3', image: '', title: '下午茶时光' }
])

const entries = [
  { icon: '/static/food_main.svg', name: '美食外卖', url: '/pages/food/search' },
  { icon: '/static/ic_public_shop.svg', name: '附近店铺', url: '/pages/shop/shop-list' },
  { icon: '/static/ic_home_dinein.png', name: '堂食点餐', url: '/pages/main/main' },
  { icon: '/static/ic_order_new.svg', name: '我的订单', url: '/pages/order/order-list' }
]

onMounted(async () => {
  try {
    if (shopStore.shops.length === 0) {
      await shopStore.fetchShops()
    }
    const shop = shopStore.shops[0]
    if (shop) {
      const foods = await FoodService.getFoods(shop.id)
      hotRanking.value = foods.filter(f => f.monthlySales > 50).sort((a, b) => b.monthlySales - a.monthlySales).slice(0, 6)
      popularRecommend.value = foods.sort((a, b) => b.rating - a.rating).slice(0, 6)
    }
  } catch (e) {
    console.error('首页加载数据失败:', e)
  }
})

function getBannerImage(title: string): string {
  const colorMap: Record<string, string> = {
    '新品上线': 'linear-gradient(135deg, #FF6B35, #FF8F5E)',
    '限时优惠': 'linear-gradient(135deg, #FF4757, #FF6B81)',
    '下午茶时光': 'linear-gradient(135deg, #FFA502, #FFD32A)'
  }
  return colorMap[title] || 'linear-gradient(135deg, #FF6B35, #FF8F5E)'
}

function onEntryClick(url: string) {
  if (url === '/pages/main/main') {
    uni.reLaunch({ url })
  } else {
    uni.navigateTo({ url })
  }
}
</script>

<template>
  <scroll-view scroll-y class="home-container">
    <!-- Banner轮播 -->
    <view class="banner-section">
      <swiper
        class="banner-swiper"
        circular
        autoplay
        :interval="3000"
        indicator-dots
        indicator-active-color="#FF6B35"
      >
        <swiper-item v-for="banner in banners" :key="banner.id">
          <view class="banner-item" :style="{ background: getBannerImage(banner.title) }">
            <text class="banner-text">{{ banner.title }}</text>
          </view>
        </swiper-item>
      </swiper>
    </view>

    <!-- 分类入口 -->
    <view class="entry-section">
      <view
        v-for="(entry, idx) in entries"
        :key="idx"
        class="entry-item"
        @click="onEntryClick(entry.url)"
      >
        <image :src="entry.icon" class="entry-icon-img" />
        <text class="entry-name">{{ entry.name }}</text>
      </view>
    </view>

    <!-- 热销榜单 -->
    <view class="section" v-if="hotRanking.length > 0">
      <view class="section-header">
        <view class="section-title-wrapper">
          <image src="/static/food_1.svg" class="icon-inline" />
          <text class="section-title">热销榜单</text>
        </view>
        <text class="section-more">查看更多 ></text>
      </view>
      <view class="food-grid">
        <view
          v-for="food in hotRanking"
          :key="food.id"
          class="food-grid-item"
        >
          <FoodRecommendCard :food="food" />
        </view>
      </view>
    </view>

    <!-- 好评推荐 -->
    <view class="section" v-if="popularRecommend.length > 0">
      <view class="section-header">
        <view class="section-title-wrapper">
          <image src="/static/ic_public_choose_selected.svg" class="icon-inline" />
          <text class="section-title">好评推荐</text>
        </view>
        <text class="section-more">查看更多 ></text>
      </view>
      <view class="food-grid">
        <view
          v-for="food in popularRecommend"
          :key="food.id"
          class="food-grid-item"
        >
          <FoodRecommendCard :food="food" />
        </view>
      </view>
    </view>
  </scroll-view>
</template>

<style lang="scss" scoped>
.home-container {
  height: 100%;
  background-color: #f5f5f5;
}

.banner-section {
  height: 160px;
  padding: 0 16px;
  margin-bottom: 12px;

  .banner-swiper {
    height: 100%;
  }
}

.banner-item {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
}

.banner-text {
  font-size: 24px;
  color: #ffffff;
  font-weight: bold;
}

.entry-section {
  display: flex;
  justify-content: space-around;
  background-color: #ffffff;
  margin: 0 16px 12px;
  border-radius: 12px;
  padding: 16px 0;
}

.entry-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px 0;

  .entry-icon-img {
    width: 32px;
    height: 32px;
  }

  .entry-name {
    font-size: 12px;
    color: #666;
    margin-top: 6px;
  }
}

.section {
  background-color: #ffffff;
  margin: 0 16px 12px;
  border-radius: 12px;
  padding: 16px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.section-title-wrapper {
  display: flex;
  align-items: center;
}

.section-title {
  font-size: 16px;
  font-weight: bold;
}

.section-more {
  font-size: 12px;
  color: #999;
}

.icon-inline {
  width: 18px;
  height: 18px;
  margin-right: 6px;
}

.food-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.food-grid-item {
  width: calc(50% - 6px);
}
</style>
