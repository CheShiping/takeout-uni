<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/user.store'
import { useAppStore } from '@/stores/app.store'
import { OrderService } from '@/services/OrderService'
import { OrderStatus } from '@/models/order.types'
import UserHeader from '@/components/mine/UserHeader.vue'
import OrderSection from '@/components/mine/OrderSection.vue'
import GridSection from '@/components/mine/GridSection.vue'

const userStore = useUserStore()
const appStore = useAppStore()

const memberServices = ref([
  { icon: '/static/ic_public_message.svg', name: '我的评价' },
  { icon: '/static/ic_public_choose_selected.svg', name: '我的收藏' },
  { icon: '/static/ic_public_choose.svg', name: '优惠券' },
  { icon: '/static/ic_public_choose_selected.svg', name: '会员中心' }
])

const moreServices = ref([
  { icon: '/static/ic_public_map.svg', name: '收货地址', path: '/pages/address/address-list' },
  { icon: '/static/ic_public_shop.svg', name: '附近店铺', path: '/pages/shop/shop-list' },
  { icon: '/static/ic_public_message.svg', name: '消息通知' },
  { icon: '/static/ic_public_setting.svg', name: '设置' }
])

function onNavigate(path: string) {
  if (path) {
    uni.navigateTo({ url: path })
  }
}
</script>

<template>
  <scroll-view scroll-y class="mine-container">
    <!-- 用户头部 -->
    <UserHeader />

    <!-- 订单区域 -->
    <OrderSection />

    <!-- 会员服务 -->
    <GridSection title="会员服务" :items="memberServices" />

    <!-- 更多服务 -->
    <GridSection
      title="更多服务"
      :items="moreServices"
      @item-click="(item) => onNavigate(item.path)"
    />

    <!-- 退出登录 -->
    <view class="logout-section" v-if="userStore.isLogin">
      <view class="logout-btn" @click="userStore.logout()">
        <text>退出登录</text>
      </view>
    </view>
  </scroll-view>
</template>

<style lang="scss" scoped>
.mine-container {
  height: 100%;
  background-color: #f5f5f5;
}

.logout-section {
  padding: 20px 16px;
  display: flex;
  justify-content: center;
}

.logout-btn {
  width: 100%;
  height: 44px;
  background-color: #ffffff;
  border-radius: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #f0f0f0;

  text {
    font-size: 15px;
    color: #999;
  }
}
</style>
