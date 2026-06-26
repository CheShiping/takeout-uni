<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { OrderService } from '@/services/OrderService'
import { OrderStatus, ORDER_TABS, filterOrdersByTab } from '@/models/order.types'
import type { Order, OrderTabType } from '@/models/order.types'
import OrderCard from '@/components/order/OrderCard.vue'

const currentTab = ref<OrderTabType>('ALL')
const orders = ref<Order[]>([])
const loading = ref(false)
const refreshing = ref(false)
const tabs = ORDER_TABS

function onTabChange(tabType: OrderTabType) {
  currentTab.value = tabType
}

const filteredOrders = ref<Order[]>([])

async function fetchOrders() {
  loading.value = true
  try {
    const status =
      currentTab.value === 'PENDING' ? OrderStatus.UNPAID :
      currentTab.value === 'COMPLETED' ? OrderStatus.COMPLETED :
      currentTab.value === 'CANCELED' ? OrderStatus.CANCELLED : undefined

    const response = await OrderService.getOrders(1, 50, status as any)
    console.log('订单响应数据:', response)
    // 兼容不同的数据格式
    const orderList = response.list || response.records || (Array.isArray(response) ? response : [])
    orders.value = orderList
    filteredOrders.value = filterOrdersByTab(orders.value, currentTab.value)
  } catch (e) {
    console.error('获取订单失败:', e)
  } finally {
    loading.value = false
  }
}

async function onRefresh() {
  refreshing.value = true
  await fetchOrders()
  refreshing.value = false
}

onMounted(() => {
  fetchOrders()
})
</script>

<template>
  <view class="page-order-list">
    <!-- Tab筛选 -->
    <view class="tab-bar">
      <view
        v-for="tab in tabs"
        :key="tab.key"
        class="tab-item"
        :class="{ active: currentTab === tab.key }"
        @click="onTabChange(tab.key)"
      >
        <text>{{ tab.label }}</text>
      </view>
    </view>

    <scroll-view
      scroll-y
      class="order-scroll"
      :style="{ height: 'calc(100vh - 100px)' }"
      @scrolltolower="fetchOrders"
      :refresher-enabled="true"
      :refresher-triggered="refreshing"
      @refresherrefresh="onRefresh"
    >
      <OrderCard
        v-for="order in filteredOrders"
        :key="order.id"
        :order="order"
      />

      <view v-if="!loading && filteredOrders.length === 0" class="empty-state">
        <text class="empty-icon">📭</text>
        <text class="empty-text">暂无相关订单</text>
      </view>
    </scroll-view>
  </view>
</template>

<style lang="scss" scoped>
.page-order-list {
  height: 100%;
  background-color: #f5f5f5;
}

.tab-bar {
  display: flex;
  background-color: #ffffff;
  padding: 0 16px;
  border-bottom: 1px solid #f0f0f0;
}

.tab-item {
  flex: 1;
  text-align: center;
  padding: 12px 0;
  font-size: 14px;
  color: #666;
  position: relative;
}

.tab-item.active {
  color: #FF6B35;
  font-weight: bold;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 24px;
    height: 3px;
    background-color: #FF6B35;
    border-radius: 1.5px;
  }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 0;

  .empty-icon {
    font-size: 48px;
    margin-bottom: 12px;
  }

  .empty-text {
    font-size: 14px;
    color: #999;
  }
}
</style>
