<script setup lang="ts">
import { useOrderStore } from '@/stores/order.store'
import type { Order } from '@/models/order.types'
import { getOrderStatusName, getOrderTypeName } from '@/models/order.types'
import { DateUtil } from '@/utils/DateUtil'
import { getImageUrl } from '@/constants/api'

const props = defineProps<{
  order: Order
}>()

const orderStore = useOrderStore()

function onViewDetail() {
  uni.navigateTo({ url: `/pages/order/order-detail?orderId=${props.order.id}` })
}

function onCancel() {
  uni.showModal({
    title: '提示',
    content: '确定要取消该订单吗？',
    success: async (res) => {
      if (res.confirm) {
        await orderStore.cancelOrder(props.order.id)
      }
    }
  })
}

function onPay() {
  uni.navigateTo({ url: `/pages/order/payment?orderId=${props.order.id}` })
}
</script>

<template>
  <view class="order-card" @click="onViewDetail">
    <view class="card-header">
      <text class="shop-name">{{ order.shopName }}</text>
      <text
        class="order-status"
        :class="{
          'status-pending': order.status === 0,
          'status-active': order.status === 1 || order.status === 2,
          'status-completed': order.status === 3,
          'status-canceled': order.status === 4
        }"
      >
        {{ getOrderStatusName(order.status) }}
      </text>
    </view>

    <view class="order-items">
      <view
        v-for="item in order.items.slice(0, 3)"
        :key="item.id"
        class="order-item"
      >
        <image
          v-if="item.foodImage"
          :src="getImageUrl(item.foodImage)"
          class="item-image"
          mode="aspectFill"
        />
        <text class="item-name">{{ item.foodName }}</text>
        <text class="item-price">×{{ item.quantity }} ¥{{ item.subtotal }}</text>
      </view>
      <text v-if="order.items.length > 3" class="more-items">
        共{{ order.items.length }}件商品
      </text>
    </view>

    <view class="card-footer">
      <view class="footer-info">
        <text class="order-type">{{ getOrderTypeName(order.orderType) }}</text>
        <text class="order-time">{{ DateUtil.formatTime(order.createTime) }}</text>
      </view>
      <view class="footer-action">
        <text class="total-amount">¥{{ order.totalAmount }}</text>
        <view class="action-btns" @click.stop>
          <view
            v-if="order.status === 0"
            class="action-btn primary"
            @click="onPay"
          >
            <text>去支付</text>
          </view>
          <view
            v-if="order.status === 0"
            class="action-btn outline"
            @click="onCancel"
          >
            <text>取消</text>
          </view>
          <view
            v-if="order.status === 3"
            class="action-btn primary"
            @click="onViewDetail"
          >
            <text>去评价</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.order-card {
  background-color: #ffffff;
  margin: 10px 16px;
  border-radius: 12px;
  padding: 14px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 10px;
  border-bottom: 1px solid #f5f5f5;

  .shop-name {
    font-size: 15px;
    font-weight: bold;
  }

  .order-status {
    font-size: 13px;
    font-weight: bold;
  }
}

.status-pending { color: #FF9800; }
.status-active { color: #2196F3; }
.status-completed { color: #4CAF50; }
.status-canceled { color: #999; }

.order-items {
  padding: 10px 0;
}

.order-item {
  display: flex;
  align-items: center;
  padding: 4px 0;

  .item-image {
    width: 40px;
    height: 40px;
    border-radius: 6px;
    margin-right: 8px;
  }

  .item-name {
    flex: 1;
    font-size: 13px;
    color: #333;
  }

  .item-price {
    font-size: 12px;
    color: #999;
  }
}

.more-items {
  font-size: 12px;
  color: #999;
  text-align: center;
  display: block;
  padding: 4px 0;
}

.card-footer {
  border-top: 1px solid #f5f5f5;
  padding-top: 10px;
}

.footer-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;

  .order-type {
    font-size: 12px;
    color: #999;
  }

  .order-time {
    font-size: 12px;
    color: #999;
  }
}

.footer-action {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .total-amount {
    font-size: 18px;
    font-weight: bold;
    color: #FF6B35;
  }
}

.action-btns {
  display: flex;
  gap: 8px;
}

.action-btn {
  padding: 6px 14px;
  border-radius: 15px;
  font-size: 12px;

  text {
    font-size: 12px;
    font-weight: bold;
  }
}

.action-btn.primary {
  background-color: #FF6B35;

  text {
    color: #ffffff;
  }
}

.action-btn.outline {
  border: 1px solid #ccc;

  text {
    color: #999;
  }
}
</style>
