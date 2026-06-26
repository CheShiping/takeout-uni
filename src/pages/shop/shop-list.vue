<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ShopService } from '@/services/ShopService'
import { getImageUrl } from '@/constants/api'
import { useShopStore } from '@/stores/shop.store'
import type { Shop } from '@/models/shop.types'

const shopStore = useShopStore()
const shops = ref<Shop[]>([])
const loading = ref(false)

onMounted(async () => {
  loading.value = true
  try {
    shops.value = await ShopService.getShops()
  } catch (e) {
    console.error('获取店铺列表失败:', e)
  } finally {
    loading.value = false
  }
})

function onShopClick(shop: Shop) {
  shopStore.setCurrentShop(shop)
  uni.reLaunch({ url: '/pages/main/main' })
}
</script>

<template>
  <scroll-view scroll-y class="shop-list-page" :style="{ height: '100vh' }">
    <view v-if="loading" class="loading-box">
      <text>加载中...</text>
    </view>

    <view
      v-for="shop in shops"
      :key="shop.id"
      class="shop-card"
      @click="onShopClick(shop)"
    >
      <image :src="getImageUrl(shop.logo)" class="shop-logo" mode="aspectFill" />
      <view class="shop-info">
        <text class="shop-name">{{ shop.name }}</text>
        <view class="shop-meta">
          <image src="/static/ic_public_choose_selected.svg" class="icon-inline-small" /><text class="meta-star"> {{ shop.rating }}</text>
          <text class="meta-sales">月售 {{ shop.monthlySales }}</text>
        </view>
        <image src="/static/ic_public_map.svg" class="icon-inline-small" /><text class="shop-address"> {{ shop.address }}</text>
        <view class="shop-tags">
          <text class="tag">配送费 ¥{{ shop.deliveryFee }}</text>
          <text class="tag">起送 ¥{{ shop.minOrderAmount }}</text>
        </view>
      </view>
    </view>

    <view v-if="!loading && shops.length === 0" class="empty-state">
      <text>暂无店铺</text>
    </view>
  </scroll-view>
</template>

<style lang="scss" scoped>
.shop-list-page {
  background-color: #f5f5f5;
}

.loading-box, .empty-state {
  text-align: center;
  padding: 40px;
  color: #999;
  font-size: 14px;
}

.icon-inline-small {
  width: 14px;
  height: 14px;
  vertical-align: middle;
  margin-right: 2px;
}

.shop-card {
  display: flex;
  background-color: #ffffff;
  margin: 10px 16px;
  border-radius: 12px;
  padding: 16px;
}

.shop-logo {
  width: 64px;
  height: 64px;
  border-radius: 12px;
  margin-right: 14px;
}

.shop-info {
  flex: 1;
}

.shop-name {
  font-size: 16px;
  font-weight: bold;
}

.shop-meta {
  display: flex;
  gap: 10px;
  margin-top: 4px;

  .meta-star {
    font-size: 12px;
    color: #FF9500;
  }

  .meta-sales {
    font-size: 12px;
    color: #999;
  }
}

.shop-address {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}

.shop-tags {
  display: flex;
  gap: 8px;
  margin-top: 8px;

  .tag {
    font-size: 11px;
    color: #666;
    background-color: #f5f5f5;
    padding: 2px 8px;
    border-radius: 4px;
  }
}
</style>
