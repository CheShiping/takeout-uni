<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { SearchService } from '@/services/SearchService'
import { useCartStore } from '@/stores/cart.store'
import { getImageUrl } from '@/constants/api'
import type { SearchResult } from '@/models/search.types'

const cartStore = useCartStore()

const keyword = ref('')
const hotSearches = ref<string[]>([])
const searchHistory = ref<string[]>([])
const searchResults = ref<SearchResult | null>(null)
const showResults = ref(false)
const loading = ref(false)

onMounted(async () => {
  try {
    const [hot, history] = await Promise.all([
      SearchService.getHotSearches(),
      SearchService.getSearchHistory()
    ])
    hotSearches.value = hot
    searchHistory.value = history
  } catch (e) {
    console.error('加载搜索数据失败:', e)
  }
})

async function onSearch() {
  if (!keyword.value.trim()) return

  loading.value = true
  showResults.value = true

  try {
    searchResults.value = await SearchService.searchFoods(keyword.value.trim())
    // 保存搜索历史
    if (!searchHistory.value.includes(keyword.value)) {
      searchHistory.value.unshift(keyword.value)
      if (searchHistory.value.length > 10) {
        searchHistory.value = searchHistory.value.slice(0, 10)
      }
      uni.setStorageSync('searchHistory', JSON.stringify(searchHistory.value))
    }
  } catch (e) {
    console.error('搜索失败:', e)
  } finally {
    loading.value = false
  }
}

function onHotClick(term: string) {
  keyword.value = term
  onSearch()
}

function onHistoryClick(term: string) {
  keyword.value = term
  onSearch()
}

function onClearHistory() {
  searchHistory.value = []
  uni.removeStorageSync('searchHistory')
  SearchService.clearSearchHistory().catch(() => {})
}

function onBack() {
  if (showResults.value) {
    showResults.value = false
    keyword.value = ''
  } else {
    uni.navigateBack()
  }
}

function highlightKeyword(text: string, kw: string): string {
  if (!kw) return text
  const reg = new RegExp(kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')
  return text.replace(reg, (match) => `__HL__${match}__HL__`)
}
</script>

<template>
  <view class="search-page">
    <!-- 搜索栏 -->
    <view class="search-bar">
      <view class="back-btn" @click="onBack">
        <text>←</text>
      </view>
      <view class="search-input-wrapper">
        <input
          v-model="keyword"
          class="search-input"
          placeholder="搜索美食"
          confirm-type="search"
          @confirm="onSearch"
        />
        <text v-if="keyword" class="clear-btn" @click="keyword = ''">✕</text>
      </view>
      <text class="search-btn" @click="onSearch">搜索</text>
    </view>

    <!-- 搜索结果 -->
    <view v-if="showResults" class="search-results">
      <view v-if="loading" class="loading-box">
        <text>搜索中...</text>
      </view>
      <view v-else-if="searchResults?.foods?.length">
        <view
          v-for="food in searchResults.foods"
          :key="food.id"
          class="result-item"
          @click="uni.navigateTo({ url: `/pages/food/food-detail?foodId=${food.id}` })"
        >
          <image :src="getImageUrl(food.image)" class="result-img" mode="aspectFill" />
          <view class="result-info">
            <text class="result-name">{{ food.name }}</text>
            <text class="result-shop">{{ food.shopName }}</text>
            <text class="result-price">¥{{ food.price }}</text>
          </view>
        </view>
      </view>
      <view v-else class="empty-result">
        <text>未找到相关商品</text>
      </view>
    </view>

    <!-- 热门搜索 -->
    <view v-else class="search-content">
      <view class="section" v-if="hotSearches.length > 0">
        <image src="/static/food_1.svg" class="icon-inline" /><text class="section-title"> 热门搜索</text>
        <view class="hot-grid">
          <text
            v-for="term in hotSearches"
            :key="term"
            class="hot-tag"
            @click="onHotClick(term)"
          >
            {{ term }}
          </text>
        </view>
      </view>

      <view class="section" v-if="searchHistory.length > 0">
        <view class="section-header">
          <image src="/static/ic_public_arrow_right.svg" class="icon-inline" /><text class="section-title"> 搜索历史</text>
          <text class="clear-btn" @click="onClearHistory">清除</text>
        </view>
        <view class="history-list">
          <text
            v-for="term in searchHistory"
            :key="term"
            class="history-item"
            @click="onHistoryClick(term)"
          >
            {{ term }}
          </text>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.search-page {
  height: 100vh;
  background-color: #f5f5f5;
}

.search-bar {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background-color: #ffffff;
  gap: 10px;
}

.back-btn {
  font-size: 20px;
  padding: 4px 8px;
  color: #333;
}

.search-input-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  background-color: #f5f5f5;
  border-radius: 22px;
  padding: 0 14px;
  height: 36px;
}

.search-input {
  flex: 1;
  font-size: 14px;
  height: 100%;
}

.clear-btn {
  font-size: 14px;
  color: #ccc;
  padding: 4px;
}

.search-btn {
  font-size: 14px;
  color: #FF6B35;
  font-weight: bold;
}

.loading-box, .empty-result {
  text-align: center;
  padding: 40px;
  color: #999;
  font-size: 14px;
}

.result-item {
  display: flex;
  padding: 12px 16px;
  background-color: #ffffff;
  margin-bottom: 1px;
}

.result-img {
  width: 64px;
  height: 64px;
  border-radius: 8px;
  margin-right: 12px;
}

.result-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.result-name {
  font-size: 14px;
  font-weight: bold;
  color: #333;
}

.result-shop {
  font-size: 12px;
  color: #999;
}

.result-price {
  font-size: 16px;
  color: #FF6B35;
  font-weight: bold;
}

.section {
  background-color: #ffffff;
  padding: 16px;
  margin-bottom: 12px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.section-title {
  font-size: 15px;
  font-weight: bold;
}

.icon-inline {
  width: 18px;
  height: 18px;
  vertical-align: middle;
  margin-right: 4px;
}

.hot-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.hot-tag {
  font-size: 13px;
  color: #FF6B35;
  background-color: #FFF5F0;
  padding: 6px 14px;
  border-radius: 16px;
}

.history-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.history-item {
  font-size: 13px;
  color: #666;
  background-color: #f5f5f5;
  padding: 6px 14px;
  border-radius: 16px;
}
</style>
