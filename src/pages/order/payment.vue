<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { PaymentService } from '@/services/PaymentService'
import { OrderService } from '@/services/OrderService'
import { useOrderStore } from '@/stores/order.store'
import { ToastUtil } from '@/utils/ToastUtil'
import { PaymentStatus, PaymentMethod } from '@/models/payment.types'

const orderStore = useOrderStore()

const orderId = ref('')
const totalAmount = ref(0)
const timeLeft = ref(30 * 60)
const isPaid = ref(false)
const paying = ref(false)
let timer: any = null

onLoad((options: any) => {
  orderId.value = options?.orderId || ''
})

onMounted(async () => {
  if (!orderId.value) {
    const pages = getCurrentPages()
    const currentPage = pages[pages.length - 1] as any
    const opts = currentPage?.$page?.options || currentPage?.options || {}
    orderId.value = opts.orderId || ''
  }

  if (!orderId.value) {
    ToastUtil.showError('订单号不存在')
    return
  }

  try {
    await orderStore.fetchOrderDetail(orderId.value)
    if (orderStore.currentOrder) {
      totalAmount.value = orderStore.currentOrder.totalAmount
    }
  } catch (e) {
    console.error('加载订单失败:', e)
  }

  startTimer()
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})

function startTimer() {
  timer = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--
    } else {
      clearInterval(timer)
      ToastUtil.showDialog('支付超时', '订单支付已超时，请重新下单')
    }
  }, 1000)
}

function formatTime(seconds: number): string {
  const min = Math.floor(seconds / 60)
  const sec = seconds % 60
  return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`
}

async function onPay() {
  if (paying.value) return
  paying.value = true
  ToastUtil.showLoading('支付中...')

  try {
    const result = await PaymentService.createPayment(orderId.value, PaymentMethod.BALANCE)
    ToastUtil.hideLoading()

    const resultStatus = (result.status || '').toUpperCase()
    if (resultStatus === PaymentStatus.SUCCESS) {
      isPaid.value = true
      ToastUtil.showSuccess('支付成功')
      if (timer) clearInterval(timer)
    } else {
      ToastUtil.showLoading('正在确认支付...')
      const status = await PaymentService.waitForPayment(result.id, 10)
      ToastUtil.hideLoading()
      if (status === PaymentStatus.SUCCESS) {
        isPaid.value = true
        ToastUtil.showSuccess('支付成功')
        if (timer) clearInterval(timer)
      } else {
        ToastUtil.showError('支付失败，请重试')
      }
    }
  } catch (e: any) {
    ToastUtil.hideLoading()
    ToastUtil.showError(e.message || '支付失败')
  } finally {
    paying.value = false
  }
}

function onViewOrder() {
  uni.redirectTo({ url: `/pages/order/order-detail?orderId=${orderId.value}` })
}

function onBackToHome() {
  uni.reLaunch({ url: '/pages/main/main' })
}
</script>

<template>
  <view class="payment-page">
    <!-- 支付成功页 -->
    <template v-if="isPaid">
      <view class="success-section">
        <image src="/static/ic_public_choose_selected.svg" class="success-icon-img" />
        <text class="success-title">支付成功</text>
        <text class="success-amount">¥{{ totalAmount }}</text>
      </view>
      <view class="button-section">
        <view class="btn-primary" @click="onViewOrder">
          <text>查看订单</text>
        </view>
        <view class="btn-outline" @click="onBackToHome">
          <text>返回首页</text>
        </view>
      </view>
    </template>

    <!-- 支付页 -->
    <template v-else>
      <view class="header-section">
        <text class="header-title">确认支付</text>
        <text class="header-amount">¥{{ totalAmount }}</text>
        <text class="header-timer">剩余支付时间: {{ formatTime(timeLeft) }}</text>
      </view>

      <view class="section">
        <text class="section-title">支付方式</text>
        <view class="pay-method active">
          <text class="method-icon">💰</text>
          <text class="method-name">余额支付</text>
          <text class="method-check">✓</text>
        </view>
      </view>

      <view class="pay-btn-wrapper">
        <view class="pay-btn" :class="{ disabled: paying || timeLeft <= 0 }" @click="onPay">
          <text>{{ paying ? '支付中...' : `立即支付 ¥${totalAmount}` }}</text>
        </view>
      </view>
    </template>
  </view>
</template>

<style lang="scss" scoped>
.payment-page {
  height: 100vh;
  background-color: #f5f5f5;
}

.success-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px 20px;
  background-color: #ffffff;
}

.success-icon-img {
  width: 64px;
  height: 64px;
}

.success-title {
  font-size: 24px;
  font-weight: bold;
  margin-top: 16px;
}

.success-amount {
  font-size: 28px;
  color: #FF6B35;
  font-weight: bold;
  margin-top: 8px;
}

.button-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 30px 16px;
}

.btn-primary {
  height: 48px;
  background: linear-gradient(135deg, #FF6B35, #FF8F5E);
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;

  text {
    color: #ffffff;
    font-size: 16px;
    font-weight: bold;
  }
}

.btn-outline {
  height: 48px;
  border: 1px solid #ddd;
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;

  text {
    color: #666;
    font-size: 16px;
  }
}

.header-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px 20px;
  background: linear-gradient(135deg, #FF6B35, #FF8F5E);
}

.header-title {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.8);
}

.header-amount {
  font-size: 40px;
  font-weight: bold;
  color: #ffffff;
  margin: 10px 0;
}

.header-timer {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
}

.section {
  background-color: #ffffff;
  margin: 12px 16px;
  border-radius: 12px;
  padding: 16px;
}

.section-title {
  font-size: 15px;
  font-weight: bold;
  margin-bottom: 12px;
  display: block;
}

.pay-method {
  display: flex;
  align-items: center;
  padding: 14px;
  background-color: #FFF5F0;
  border-radius: 10px;
  border: 2px solid #FF6B35;
}

.pay-method .method-icon { font-size: 24px; margin-right: 12px; }
.pay-method .method-name { font-size: 15px; flex: 1; color: #333; }
.pay-method .method-check { font-size: 18px; color: #FF6B35; font-weight: bold; }

.pay-btn-wrapper {
  padding: 20px 16px;
}

.pay-btn {
  height: 50px;
  background: linear-gradient(135deg, #FF6B35, #FF8F5E);
  border-radius: 25px;
  display: flex;
  align-items: center;
  justify-content: center;

  &.disabled {
    opacity: 0.5;
  }

  text {
    color: #ffffff;
    font-size: 17px;
    font-weight: bold;
  }
}
</style>
