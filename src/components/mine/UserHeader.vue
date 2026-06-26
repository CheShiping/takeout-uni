<script setup lang="ts">
import { useUserStore } from '@/stores/user.store'

const userStore = useUserStore()

function onLogin() {
  uni.navigateTo({ url: '/pages/mine/login' })
}

function onRegister() {
  uni.navigateTo({ url: '/pages/mine/register' })
}
</script>

<template>
  <view class="user-header">
    <view class="header-bg">
      <!-- 登录/未登录状态 -->
      <view class="user-info" v-if="userStore.isLogin" @click="uni.navigateTo({ url: '/pages/mine/profile' })">
        <view class="avatar-box">
          <text class="avatar-placeholder">{{ userStore.userName.charAt(0) }}</text>
        </view>
        <view class="info-text">
          <text class="user-name">{{ userStore.userName }}</text>
          <text class="user-desc">查看个人资料</text>
        </view>
      </view>

      <view class="user-info" v-else>
        <view class="avatar-box" @click="onLogin">
          <image src="/static/ic_mine_new.svg" class="avatar-placeholder-img" />
        </view>
        <view class="info-text">
          <text class="login-btn" @click="onLogin">登录 / 注册</text>
          <text class="user-desc">登录享受更多服务</text>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.user-header {
  margin-bottom: 12px;
}

.header-bg {
  background: linear-gradient(135deg, #FF6B35, #FF8F5E);
  padding: 30px 20px 25px;
}

.user-info {
  display: flex;
  align-items: center;
}

.avatar-box {
  width: 56px;
  height: 56px;
  border-radius: 28px;
  background-color: rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 14px;
}

.avatar-placeholder-img {
  width: 28px;
  height: 28px;
}

.info-text {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-size: 20px;
  font-weight: bold;
  color: #ffffff;
}

.login-btn {
  font-size: 20px;
  font-weight: bold;
  color: #ffffff;
}

.user-desc {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.8);
  margin-top: 4px;
}
</style>
