<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { useOrderStore } from '@/stores/order.store'
import { DateUtil } from '@/utils/DateUtil'
import { getImageUrl } from '@/constants/api'
import {
  getOrderStatusName,
  getOrderTypeName,
  OrderStatus
} from '@/models/order.types'

const orderStore = useOrderStore()
const orderId = ref('')
const loading = ref(false)

onLoad((options: any) => {
  orderId.value = options?.orderId || ''
})

onMounted(() => {
  if (!orderId.value) {
    const pages = getCurrentPages()
    const currentPage = pages[pages.length - 1] as any
    const options = currentPage?.$page?.options || currentPage?.options || {}
    orderId.value = options.orderId || ''
  }

  if (orderId.value) {
    loadDetail()
  }
})

async function loadDetail() {
  loading.value = true
  try {
    await orderStore.fetchOrderDetail(orderId.value)
  } catch (e) {
    console.error('加载订单详情失败:', e)
  } finally {
    loading.value = false
  }
}

function onCancel() {
  uni.showModal({
    title: '提示',
    content: '确定要取消该订单吗？',
    success: async (res) => {
      if (res.confirm) {
        await orderStore.cancelOrder(orderId.value)
        await loadDetail()
      }
    }
  })
}

function onPay() {
  uni.navigateTo({ url: `/pages/order/payment?orderId=${orderId.value}` })
}

function onReview() {
  const order = orderStore.currentOrder
  if (order) {
    uni.navigateTo({ url: `/pages/review/review-submit?orderId=${order.id}&foodId=${order.items[0]?.foodId || ''}&shopId=${order.shopId}` })
  }
}

const order = computed(() => orderStore.currentOrder)
</script>

<template>
  <scroll-view scroll-y class="order-detail-page" :style="{ height: '100vh' }">
    <view v-if="loading" class="loading-box">
      <text>加载中...</text>
    </view>

    <template v-if="order">
      <!-- 状态卡片 -->
      <view class="status-card">
        <image :src="order.status === 0 ? '/static/ic_public_arrow_right.svg' : order.status === 3 ? '/static/ic_public_choose_selected.svg' : order.status === 4 ? '/static/ic_public_delete.svg' : '/static/ic_public_arrow_right.svg'" class="status-icon-img" />
        <text class="status-text">{{ getOrderStatusName(order.status) }}</text>
        <text class="status-hint" v-if="order.status === 0">请尽快完成支付</text>
      </view>

      <!-- 订单信息 -->
      <view class="section">
        <text class="section-title">订单信息</text>
        <view class="info-row">
          <text class="info-label">订单编号</text>
          <text class="info-value">{{ order.orderNo }}</text>
        </view>
        <view class="info-row">
          <text class="info-label">订单类型</text>
          <text class="info-value">{{ getOrderTypeName(order.orderType) }}</text>
        </view>
        <view class="info-row" v-if="order.tableNumber">
          <text class="info-label">桌号</text>
          <text class="info-value">{{ order.tableNumber }}</text>
        </view>
        <view class="info-row">
          <text class="info-label">下单时间</text>
          <text class="info-value">{{ DateUtil.formatTime(order.createTime) }}</text>
        </view>
        <view class="info-row" v-if="order.remark">
          <text class="info-label">备注</text>
          <text class="info-value">{{ order.remark }}</text>
        </view>
      </view>

      <!-- 店铺信息 -->
      <view class="section">
        <view class="shop-row">
          <image :src="getImageUrl(order.shopLogo)" class="shop-logo" mode="aspectFill" />
          <text class="shop-name">{{ order.shopName }}</text>
        </view>
      </view>

      <!-- 商品列表 -->
      <view class="section">
        <text class="section-title">商品详情</text>
        <view v-for="item in order.items" :key="item.id" class="food-item">
          <image :src="getImageUrl(item.foodImage)" class="food-img" mode="aspectFill" />
          <view class="food-info">
            <text class="food-name">{{ item.foodName }}</text>
            <text class="food-spec" v-if="item.specName">{{ item.specName }}</text>
          </view>
          <text class="food-price">×{{ item.quantity }} ¥{{ item.subtotal }}</text>
        </view>

        <view class="total-row">
          <text>实付金额</text>
          <text class="total-amount">¥{{ order.totalAmount }}</text>
        </view>
      </view>
    </template>
  </scroll-view>

  <!-- 底部操作 -->
  <view class="bottom-bar" v-if="order">
    <view class="action-btns" v-if="order.status === 0">
      <view class="btn-outline" @click="onCancel">
        <text>取消订单</text>
      </view>
      <view class="btn-primary" @click="onPay">
        <text>去支付 ¥{{ order.totalAmount }}</text>
      </view>
    </view>
    <view class="action-btns" v-if="order.status === 3">
      <view class="btn-primary" @click="onReview">
        <text>去评价</text>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.order-detail-page {
  background-color: #f5f5f5;
  padding-bottom: 60px;
}

.loading-box {
  text-align: center;
  padding: 40px;
  color: #999;
}

.status-card {
  background: linear-gradient(135deg, #FF6B35, #FF8F5E);
  padding: 30px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.status-icon-img {
  width: 40px;
  height: 40px;
  margin-bottom: 10px;
}

.status-text {
  font-size: 22px;
  font-weight: bold;
  color: #ffffff;
}

.status-hint {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.8);
  margin-top: 6px;
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

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 6px 0;
}

.info-label {
  font-size: 13px;
  color: #999;
}

.info-value {
  font-size: 13px;
  color: #333;
}

.shop-row {
  display: flex;
  align-items: center;
}

.shop-logo {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  margin-right: 10px;
}

.shop-name {
  font-size: 15px;
  font-weight: bold;
}

.food-item {
  display: flex;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f5f5f5;

  &:last-of-type {
    border-bottom: none;
  }
}

.food-img {
  width: 40px;
  height: 40px;
  border-radius: 6px;
  margin-right: 10px;
}

.food-info {
  flex: 1;
}

.food-name {
  font-size: 13px;
}

.food-spec {
  font-size: 11px;
  color: #999;
}

.food-price {
  font-size: 12px;
  color: #666;
}

.total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  margin-top: 8px;
  border-top: 1px solid #f0f0f0;
  font-size: 14px;

  .total-amount {
    font-size: 20px;
    font-weight: bold;
    color: #FF6B35;
  }
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
  justify-content: center;
  padding: 0 16px;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.05);
  z-index: 100;
}

.action-btns {
  display: flex;
  gap: 12px;
  width: 100%;
  justify-content: space-between;
}

.btn-outline {
  flex: 1;
  height: 40px;
  border: 1px solid #ddd;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;

  text {
    font-size: 14px;
    color: #666;
  }
}

.btn-primary {
  flex: 1;
  height: 40px;
  background: linear-gradient(135deg, #FF6B35, #FF8F5E);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;

  text {
    font-size: 14px;
    color: #ffffff;
    font-weight: bold;
  }
}
</style>
