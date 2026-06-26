<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useCartStore } from '@/stores/cart.store'
import { useUserStore } from '@/stores/user.store'
import { AddressService } from '@/services/AddressService'
import { OrderService } from '@/services/OrderService'
import { CartService } from '@/services/CartService'
import { ToastUtil } from '@/utils/ToastUtil'
import { MathUtil } from '@/utils/MathUtil'
import { getImageUrl } from '@/constants/api'
import { OrderType } from '@/models/order.types'
import { cartFoodItemToCartItem } from '@/models/cart.types'
import type { UserAddress } from '@/models/address.types'

const cartStore = useCartStore()
const userStore = useUserStore()

const orderType = ref<string>(OrderType.TAKEOUT)
const tableNumber = ref('')
const remark = ref('')
const deliveryFee = ref(5)
const addressId = ref('')
const defaultAddress = ref<UserAddress | null>(null)
const loading = ref(false)

const totalPrice = computed(() => MathUtil.addition(cartStore.totalPrice, deliveryFee.value))

onMounted(async () => {
  if (cartStore.totalItems === 0) {
    ToastUtil.showMessage('购物车为空')
    setTimeout(() => uni.navigateBack(), 1000)
    return
  }

  if (userStore.isLogin) {
    try {
      defaultAddress.value = await AddressService.getDefaultAddress()
      if (defaultAddress.value) {
        addressId.value = defaultAddress.value.id
      }
    } catch (e) {
      console.error('获取地址失败:', e)
    }
  }
})

async function syncCartToBackend(): Promise<string[]> {
  const cartItems = Object.values(cartStore.buyFoods)
  if (cartItems.length === 0) return []

  const syncItems = cartItems.map(item => {
    const cartItem = cartFoodItemToCartItem(item)
    return {
      shopId: cartItem.shopId,
      foodId: cartItem.foodId,
      specId: cartItem.specId,
      quantity: cartItem.quantity
    }
  })

  await CartService.syncCart({ items: syncItems })

  const backendCartItems = await CartService.getCartList()
  return backendCartItems.map(item => item.id)
}

async function onSubmit() {
  if (loading.value) return  // 防重复提交

  if (!userStore.isLogin) {
    uni.navigateTo({ url: '/pages/mine/login?redirect=/pages/order/order-preview' })
    return
  }

  if (orderType.value === OrderType.TAKEOUT && !addressId.value) {
    ToastUtil.showMessage('请选择收货地址')
    return
  }

  if (orderType.value === OrderType.DINE_IN && !tableNumber.value) {
    ToastUtil.showMessage('请输入桌号')
    return
  }

  loading.value = true
  try {
    const cartItemIds = await syncCartToBackend()
    if (cartItemIds.length === 0) {
      ToastUtil.showMessage('购物车为空')
      return
    }

    const request = {
      shopId: cartStore.chooseShop || '',
      orderType: orderType.value,
      addressId: orderType.value === OrderType.TAKEOUT ? addressId.value : '',
      tableNumber: orderType.value === OrderType.DINE_IN ? tableNumber.value : '',
      remark: remark.value,
      cartItemIds: cartItemIds
    }

    const orderId = await OrderService.createOrder(request)
    if (!orderId) {
      ToastUtil.showError('下单失败：未获取到订单号')
      return
    }
    cartStore.clearCart()
    ToastUtil.showSuccess('下单成功')
    uni.redirectTo({ url: `/pages/order/payment?orderId=${orderId}` })
  } catch (e: any) {
    ToastUtil.showError(e.message || '下单失败')
  } finally {
    loading.value = false
  }
}

function onSelectAddress() {
  uni.navigateTo({
    url: '/pages/address/address-list?selectMode=1',
    events: {
      selectAddress(data: { id: string; consignee: string; phone: string; fullAddress: string }) {
        addressId.value = data.id
        defaultAddress.value = {
          ...defaultAddress.value,
          id: data.id,
          consignee: data.consignee,
          phone: data.phone,
          fullAddress: data.fullAddress
        } as any
      }
    }
  })
}
</script>

<template>
  <scroll-view scroll-y class="order-preview-page" :style="{ height: '100vh' }">
    <!-- 订单类型 -->
    <view class="section">
      <view class="type-tabs">
        <view
          class="type-tab"
          :class="{ active: orderType === OrderType.TAKEOUT }"
          @click="orderType = OrderType.TAKEOUT"
        >
          <image src="/static/ic_home_takeout.png" class="icon-inline" /><text> 外卖配送</text>
        </view>
        <view
          class="type-tab"
          :class="{ active: orderType === OrderType.DINE_IN }"
          @click="orderType = OrderType.DINE_IN"
        >
          <image src="/static/ic_home_dinein.png" class="icon-inline" /><text> 堂食点餐</text>
        </view>
      </view>
    </view>

    <!-- 外卖地址 -->
    <view v-if="orderType === OrderType.TAKEOUT" class="section">
      <view class="address-row" @click="onSelectAddress">
        <image src="/static/ic_public_map.svg" class="address-icon-img" />
        <view class="address-info" v-if="defaultAddress">
          <text class="address-name">{{ defaultAddress.consignee }} {{ defaultAddress.phone }}</text>
          <text class="address-detail">{{ defaultAddress.province }}{{ defaultAddress.city }}{{ defaultAddress.district }}{{ defaultAddress.detail }}</text>
        </view>
        <view class="address-info" v-else>
          <text class="address-empty">请选择收货地址</text>
        </view>
        <text class="address-arrow">></text>
      </view>
    </view>

    <!-- 堂食桌号 -->
    <view v-if="orderType === OrderType.DINE_IN" class="section">
      <view class="form-row">
        <text class="form-label">桌号</text>
        <input v-model="tableNumber" class="form-input" type="number" placeholder="请输入桌号" />
      </view>
    </view>

    <!-- 商品列表 -->
    <view class="section">
      <text class="section-title">商品清单</text>
      <view v-for="item in cartStore.buyFoodList" :key="item.id" class="food-item">
        <image :src="getImageUrl(item.image)" class="food-img" mode="aspectFill" />
        <view class="food-info">
          <text class="food-name">{{ item.name }}</text>
          <text class="food-spec" v-if="item.specName">{{ item.specName }}</text>
        </view>
        <text class="food-price">×{{ item.buyNum }} ¥{{ MathUtil.toFixed(item.price * item.buyNum, 2) }}</text>
      </view>
    </view>

    <!-- 备注 -->
    <view class="section">
      <view class="form-row">
        <text class="form-label">备注</text>
        <input v-model="remark" class="form-input" placeholder="选填" />
      </view>
    </view>

    <!-- 价格汇总 -->
    <view class="section price-summary">
      <view class="price-row">
        <text>商品小计</text>
        <text>¥{{ cartStore.totalPrice }}</text>
      </view>
      <view class="price-row">
        <text>配送费</text>
        <text>¥{{ deliveryFee }}</text>
      </view>
      <view class="price-row total">
        <text>实付款</text>
        <text class="total-price">¥{{ totalPrice }}</text>
      </view>
    </view>
  </scroll-view>

  <!-- 底部分页 -->
  <view class="bottom-bar">
    <text class="total-amount">合计: ¥{{ totalPrice }}</text>
    <view class="submit-btn" :class="{ disabled: loading }" @click="onSubmit">
      <text>{{ loading ? '提交中...' : '提交订单' }}</text>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.order-preview-page {
  background-color: #f5f5f5;
  padding-bottom: 60px;
}

.section {
  background-color: #ffffff;
  margin: 10px 16px;
  border-radius: 12px;
  padding: 16px;
}

.icon-inline {
  width: 18px;
  height: 18px;
  vertical-align: middle;
  margin-right: 4px;
}

.type-tabs {
  display: flex;
}

.type-tab {
  flex: 1;
  text-align: center;
  padding: 10px;
  background-color: #f5f5f5;
  border-radius: 8px;
  font-size: 14px;
  color: #666;

  &:first-child {
    margin-right: 8px;
  }
}

.type-tab.active {
  background-color: #FFF5F0;
  color: #FF6B35;
  font-weight: bold;
}

.address-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.address-icon-img {
  width: 20px;
  height: 20px;
}

.address-info {
  flex: 1;
}

.address-name {
  font-size: 14px;
  font-weight: bold;
}

.address-detail {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}

.address-empty {
  font-size: 14px;
  color: #999;
}

.address-arrow {
  color: #ccc;
  font-size: 16px;
}

.form-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.form-label {
  font-size: 14px;
  color: #666;
  width: 50px;
}

.form-input {
  flex: 1;
  font-size: 14px;
  padding: 4px 0;
}

.section-title {
  font-size: 15px;
  font-weight: bold;
  display: block;
  margin-bottom: 12px;
}

.food-item {
  display: flex;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f5f5f5;

  &:last-child {
    border-bottom: none;
  }
}

.food-img {
  width: 48px;
  height: 48px;
  border-radius: 6px;
  margin-right: 10px;
}

.food-info {
  flex: 1;
}

.food-name {
  font-size: 14px;
}

.food-spec {
  font-size: 12px;
  color: #999;
  margin-top: 2px;
}

.food-price {
  font-size: 13px;
  color: #666;
}

.price-summary {
  .price-row {
    display: flex;
    justify-content: space-between;
    padding: 6px 0;
    font-size: 14px;
    color: #666;
  }

  .price-row.total {
    border-top: 1px solid #f0f0f0;
    padding-top: 12px;
    margin-top: 6px;

    .total-price {
      font-size: 20px;
      color: #FF6B35;
      font-weight: bold;
    }
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
  justify-content: space-between;
  padding: 0 16px;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.05);
  z-index: 100;
}

.total-amount {
  font-size: 18px;
  font-weight: bold;
  color: #FF6B35;
}

.submit-btn {
  background: linear-gradient(135deg, #FF6B35, #FF8F5E);
  padding: 10px 30px;
  border-radius: 22px;

  &.disabled {
    opacity: 0.6;
  }

  text {
    color: #ffffff;
    font-size: 15px;
    font-weight: bold;
  }
}
</style>
