<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/user.store'
import { UserService } from '@/services/UserService'
import type { User } from '@/models/user.types'

const userStore = useUserStore()
const userInfo = ref<User | null>(null)
const loading = ref(false)

onMounted(async () => {
  if (!userStore.isLogin) {
    uni.navigateTo({ url: '/pages/mine/login' })
    return
  }

  loading.value = true
  try {
    userInfo.value = await UserService.getUserInfo()
  } catch (e) {
    console.error('获取用户信息失败:', e)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <scroll-view scroll-y class="profile-page" :style="{ height: '100vh' }">
    <view class="avatar-section">
      <view class="avatar-box">
        <text class="avatar-text">{{ userInfo?.userName?.charAt(0) || 'U' }}</text>
      </view>
      <text class="user-name">{{ userInfo?.userName || '未知用户' }}</text>
      <text class="user-account">{{ userInfo?.userAccount || '' }}</text>
    </view>

    <view class="section" v-if="userInfo">
      <view class="info-row">
        <text class="info-label">用户ID</text>
        <text class="info-value">{{ userInfo.id }}</text>
      </view>
      <view class="info-row">
        <text class="info-label">账号</text>
        <text class="info-value">{{ userInfo.userAccount }}</text>
      </view>
      <view class="info-row">
        <text class="info-label">角色</text>
        <text class="info-value">{{ userInfo.userRole }}</text>
      </view>
      <view class="info-row">
        <text class="info-label">注册时间</text>
        <text class="info-value">{{ userInfo.createTime }}</text>
      </view>
    </view>

    <view class="logout-btn" @click="userStore.logout(); uni.navigateBack()">
      <text>退出登录</text>
    </view>
  </scroll-view>
</template>

<style lang="scss" scoped>
.profile-page {
  background-color: #f5f5f5;
}

.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 0;
  background: linear-gradient(135deg, #FF6B35, #FF8F5E);
}

.avatar-box {
  width: 72px;
  height: 72px;
  border-radius: 36px;
  background-color: rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-text {
  font-size: 32px;
  color: #ffffff;
  font-weight: bold;
}

.user-name {
  font-size: 20px;
  font-weight: bold;
  color: #ffffff;
  margin-top: 12px;
}

.user-account {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.7);
  margin-top: 4px;
}

.section {
  background-color: #ffffff;
  margin: 12px 16px;
  border-radius: 12px;
  padding: 16px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #f5f5f5;

  &:last-child {
    border-bottom: none;
  }
}

.info-label {
  font-size: 14px;
  color: #999;
}

.info-value {
  font-size: 14px;
  color: #333;
}

.logout-btn {
  height: 48px;
  background-color: #ffffff;
  margin: 20px 16px;
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #FF6B35;

  text {
    font-size: 16px;
    color: #FF6B35;
    font-weight: bold;
  }
}
</style>
