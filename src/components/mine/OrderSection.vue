<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/user.store'
import { OrderService } from '@/services/OrderService'
import { OrderStatus, ORDER_TABS } from '@/models/order.types'
import type { Order } from '@/models/order.types'

const userStore = useUserStore()
const orderTabs = ORDER_TABS
const orderCounts = ref<Record<string, number>>({
  pending: 0,
  completed: 0,
  canceled: 0,
  all: 0
})

onMounted(async () => {
  if (userStore.isLogin) {
    try {
      const allResult = await OrderService.getOrders(1, 100)
      orderCounts.value.all = allResult.total || 0
      orderCounts.value.pending = (allResult.list || []).filter(o => o.status === OrderStatus.UNPAID).length
      orderCounts.value.completed = (allResult.list || []).filter(o => o.status === OrderStatus.COMPLETED).length
      orderCounts.value.canceled = (allResult.list || []).filter(o => o.status === OrderStatus.CANCELLED).length
    } catch (e) {
      console.warn('获取订单统计失败:', e)
    }
  }
})

function onTabClick(tabKey: string) {
  uni.navigateTo({ url: `/pages/order/order-list?tab=${tabKey}` })
}
</script>

<template>
  <view class="order-section">
    <view class="section-header">
      <text class="section-title">我的订单</text>
      <text class="section-all" @click="onTabClick('ALL')">
        全部订单 >
      </text>
    </view>

    <view class="order-grid">
      <view
        v-for="tab in orderTabs"
        :key="tab.key"
        class="order-tab"
        @click="onTabClick(tab.key)"
      >
        <view class="tab-icon-wrapper">
          <image
            :src="tab.key === 'ALL' ? '/static/ic_order_new.svg' : tab.key === 'PENDING' ? '/static/ic_public_arrow_right.svg' : tab.key === 'COMPLETED' ? '/static/ic_public_choose_selected.svg' : '/static/ic_public_delete.svg'"
            class="order-tab-icon-img"
          />
        </view>
        <text class="tab-label">{{ tab.label }}</text>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.order-section {
  background-color: #ffffff;
  margin: 12px 16px;
  border-radius: 12px;
  padding: 16px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;

  .section-title {
    font-size: 16px;
    font-weight: bold;
  }

  .section-all {
    font-size: 12px;
    color: #999;
  }
}

.order-grid {
  display: flex;
  justify-content: space-around;
}

.order-tab {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.tab-icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 24px;
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 6px;
}

.order-tab-icon-img {
  width: 24px;
  height: 24px;
}

.tab-label {
  font-size: 12px;
  color: #666;
}
</style>
