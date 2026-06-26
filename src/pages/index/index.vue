<script setup lang="ts">
import { onMounted } from 'vue'
import { useUserStore } from '@/stores/user.store'
import { useShopStore } from '@/stores/shop.store'

const userStore = useUserStore()
const shopStore = useShopStore()

onMounted(() => {
  // 初始化：检查登录状态、加载店铺数据
  if (userStore.isLogin) {
    userStore.fetchUserInfo()
  }
  shopStore.fetchShops()

  // 跳转到主页面
  setTimeout(() => {
    uni.reLaunch({ url: '/pages/main/main' })
  }, 500)
})
</script>

<template>
  <view class="splash-screen">
    <view class="splash-content">
      <image src="/static/logo.png" class="splash-logo" />
      <text class="splash-title">外卖点餐</text>
      <text class="splash-subtitle">正在加载中...</text>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.splash-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(135deg, #FF6B35, #FF8F5E);
}

.splash-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.splash-logo {
  width: 80px;
  height: 80px;
  margin-bottom: 20px;
}

.splash-title {
  font-size: 28px;
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 10px;
}

.splash-subtitle {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
}
</style>
