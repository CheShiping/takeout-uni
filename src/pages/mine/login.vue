<script setup lang="ts">
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { useUserStore } from '@/stores/user.store'
import { ToastUtil } from '@/utils/ToastUtil'

const userStore = useUserStore()

const account = ref('')
const password = ref('')
const loading = ref(false)
let redirectUrl = ''

onLoad((options: any) => {
  redirectUrl = options?.redirect || ''
})

async function onLogin() {
  if (!account.value.trim()) {
    ToastUtil.showMessage('请输入账号')
    return
  }
  if (!password.value.trim()) {
    ToastUtil.showMessage('请输入密码')
    return
  }

  loading.value = true
  const success = await userStore.login(account.value.trim(), password.value.trim())
  loading.value = false

  if (success) {
    // 优先从 onLoad 获取 redirect，备选从页面 options 获取
    if (!redirectUrl) {
      const pages = getCurrentPages()
      const currentPage = pages[pages.length - 1] as any
      const options = currentPage?.$page?.options || currentPage?.options || {}
      redirectUrl = options.redirect || ''
    }

    if (redirectUrl) {
      const decoded = decodeURIComponent(redirectUrl)
      // 安全校验：只允许本地页面路径
      if (decoded.startsWith('/') && !decoded.startsWith('//')) {
        // 使用 reLaunch 清除登录页栈，避免返回到登录页
        uni.reLaunch({ url: decoded })
      } else {
        uni.navigateBack({ delta: 1 })
      }
    } else {
      // 无 redirect，返回首页
      uni.reLaunch({ url: '/pages/main/main' })
    }
  }
}

function onRegister() {
  uni.redirectTo({ url: '/pages/mine/register' })
}
</script>

<template>
  <view class="login-page">
    <view class="login-header">
      <image src="/static/logo.png" class="login-logo-img" />
      <text class="login-title">欢迎登录</text>
      <text class="login-subtitle">外卖点餐，美味直达</text>
    </view>

    <view class="form-section">
      <view class="form-group">
        <image src="/static/ic_mine_new.svg" class="form-icon-img" />
        <input
          v-model="account"
          class="form-input"
          placeholder="请输入账号"
          type="text"
        />
      </view>
      <view class="form-group">
        <image src="/static/ic_public_phone.svg" class="form-icon-img" />
        <input
          v-model="password"
          class="form-input"
          placeholder="请输入密码"
          type="password"
          :password="true"
        />
      </view>

      <view class="login-btn" :class="{ disabled: loading }" @click="onLogin">
        <text>{{ loading ? '登录中...' : '登录' }}</text>
      </view>

      <view class="register-link" @click="onRegister">
        <text>还没有账号？立即注册</text>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.login-page {
  height: 100vh;
  background-color: #ffffff;
}

.login-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px 0 40px;
}

.login-logo-img {
  width: 64px;
  height: 64px;
}

.login-title {
  font-size: 24px;
  font-weight: bold;
  margin-top: 16px;
}

.login-subtitle {
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

.login-btn {
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

.register-link {
  text-align: center;
  margin-top: 20px;

  text {
    font-size: 14px;
    color: #FF6B35;
  }
}
</style>
