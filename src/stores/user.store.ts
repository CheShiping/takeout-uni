/**
 * 用户状态管理
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { UserService } from '@/services/UserService'
import { UniStorage } from '@/utils/StorageUtil'
import { ToastUtil } from '@/utils/ToastUtil'
import type { User } from '@/models/user.types'

export const useUserStore = defineStore('user', () => {
  // State
  const token = ref<string>(UniStorage.getToken())
  const isLogin = ref<boolean>(token.value.length > 0)
  const userInfo = ref<User | null>(null)

  // Getters
  const userName = computed(() => userInfo.value?.userName || '未登录')
  const userAvatar = computed(() => userInfo.value?.userAvatar || '')

  // Actions
  async function login(account: string, password: string): Promise<boolean> {
    try {
      ToastUtil.showLoading('登录中...')
      const user = await UserService.login(account, password)
      userInfo.value = user
      token.value = user.token || UniStorage.getToken()
      isLogin.value = true
      ToastUtil.hideLoading()
      ToastUtil.showSuccess('登录成功')
      return true
    } catch (e: any) {
      ToastUtil.hideLoading()
      return false
    }
  }

  async function register(account: string, password: string, checkPassword: string): Promise<boolean> {
    try {
      ToastUtil.showLoading('注册中...')
      const user = await UserService.register(account, password, checkPassword)
      userInfo.value = user
      token.value = user.token || UniStorage.getToken()
      isLogin.value = true
      ToastUtil.hideLoading()
      ToastUtil.showSuccess('注册成功')
      return true
    } catch (e: any) {
      ToastUtil.hideLoading()
      return false
    }
  }

  async function fetchUserInfo(): Promise<void> {
    try {
      const user = await UserService.getUserInfo()
      userInfo.value = user
    } catch (e) {
      console.warn('[userStore] 获取用户信息失败:', e)
    }
  }

  async function logout(): Promise<void> {
    try {
      await UserService.logout()
    } catch (e) {
      console.warn('[userStore] 登出异常:', e)
    } finally {
      token.value = ''
      isLogin.value = false
      userInfo.value = null
      UniStorage.clearToken()
    }
  }

  return {
    token,
    isLogin,
    userInfo,
    userName,
    userAvatar,
    login,
    register,
    fetchUserInfo,
    logout
  }
}, {
  persist: {
    key: 'user-store',
    storage: {
      getItem: (key) => uni.getStorageSync(key),
      setItem: (key, value) => uni.setStorageSync(key, value)
    },
    paths: ['token', 'isLogin']
  }
})
