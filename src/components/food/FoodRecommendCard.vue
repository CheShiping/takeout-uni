<script setup lang="ts">
import { getImageUrl } from '@/constants/api'
import type { FoodItem } from '@/models/food.types'

defineProps<{
  food: FoodItem
}>()
</script>

<template>
  <view class="food-recommend-card">
    <image :src="getImageUrl(food.image)" class="card-image" mode="aspectFill" />
    <view class="card-info">
      <text class="card-name">{{ food.name }}</text>
      <view class="card-rating">
        <text class="stars">
          <text v-for="i in 5" :key="i" :style="{ color: i <= food.rating ? '#FF9500' : '#ddd' }">★</text>
        </text>
        <text class="sales">月售 {{ food.monthlySales }}</text>
      </view>
      <view class="card-price-box">
        <text class="card-price">¥{{ food.price }}</text>
        <text class="card-original" v-if="food.originalPrice > food.price">¥{{ food.originalPrice }}</text>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.food-recommend-card {
  width: 160px;
  background-color: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  margin-right: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.card-image {
  width: 100%;
  height: 120px;
}

.card-info {
  padding: 10px;
}

.card-name {
  font-size: 14px;
  font-weight: bold;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-rating {
  display: flex;
  align-items: center;
  margin-top: 4px;

  .stars {
    font-size: 12px;
  }

  .sales {
    font-size: 11px;
    color: #999;
    margin-left: 6px;
  }
}

.card-price-box {
  display: flex;
  align-items: baseline;
  margin-top: 6px;

  .card-price {
    font-size: 16px;
    color: #FF6B35;
    font-weight: bold;
  }

  .card-original {
    font-size: 11px;
    color: #ccc;
    text-decoration: line-through;
    margin-left: 6px;
  }
}
</style>
