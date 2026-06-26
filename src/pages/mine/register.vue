<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '@/stores/user.store'
import { ToastUtil } from '@/utils/ToastUtil'

const userStore = useUserStore()

const account = ref('')
const password = ref('')
const checkPassword = ref('')
const loading = ref(false)

async function onRegister() {
  if (!account.value.trim()) {
    ToastUtil.showMessage('请输入账号')
    return
  }
  if (password.value.length < 6) {
    ToastUtil.showMessage('密码至少6位')
    return
  }
  if (password.value !== checkPassword.value) {
    ToastUtil.showMessage('两次密码不一致')
    return
  }

  loading.value = true
  const success = await userStore.register(account.value.trim(), password.value, checkPassword.value)
  loading.value = false

  if (success) {
    uni.navigateBack()
  }
}

function onLogin() {
  uni.redirectTo({ url: '/pages/mine/login' })
}
</script>

<template>
  <view class="register-page">
    <view class="register-header">
      <text class="register-title">创建账号</text>
      <text class="register-subtitle">注册后即可享受外卖点餐服务</text>
    </view>

    <view class="form-section">
      <view class="form-group">
        <image src="/static/ic_mine_new.svg" class="form-icon-img" />
        <input v-model="account" class="form-input" placeholder="请输入账号" type="text" />
      </view>
      <view class="form-group">
        <image src="/static/ic_public_phone.svg" class="form-icon-img" />
        <input v-model="password" class="form-input" placeholder="请输入密码（至少6位）" type="password" :password="true" />
      </view>
      <view class="form-group">
        <image src="/static/ic_public_phone.svg" class="form-icon-img" />
        <input v-model="checkPassword" class="form-input" placeholder="请确认密码" type="password" :password="true" />
      </view>

      <view class="register-btn" :class="{ disabled: loading }" @click="onRegister">
        <text>{{ loading ? '注册中...' : '注册' }}</text>
      </view>

      <view class="login-link" @click="onLogin">
        <text>已有账号？立即登录</text>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.register-page {
  height: 100vh;
  background-color: #ffffff;
}

.register-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 50px 0 30px;
}

.register-title {
  font-size: 26px;
  font-weight: bold;
}

.register-subtitle {
  font-size: 14px;
  color: #999;
  margin-top: 8px;
}

.form-section {
  padding: 0 30px;
}

.form-group {
  display: flex;
  align-items: center;
  height: 50px;
  background-color: #f8f8f8;
  border-radius: 12px;
  padding: 0 16px;
  margin-bottom: 16px;
}

.form-icon-img {
  width: 20px;
  height: 20px;
  margin-right: 12px;
}

.form-input {
  flex: 1;
  font-size: 15px;
}

.register-btn {
  height: 50px;
  background: linear-gradient(135deg, #FF6B35, #FF8F5E);
  border-radius: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 24px;

  &.disabled {
    opacity: 0.6;
  }

  text {
    color: #ffffff;
    font-size: 16px;
    font-weight: bold;
  }
}

.login-link {
  text-align: center;
  margin-top: 20px;

  text {
    font-size: 14px;
    color: #FF6B35;
  }
}
</style>
