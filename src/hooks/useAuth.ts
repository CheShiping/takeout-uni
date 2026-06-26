/**
 * 认证相关组合式函数
 */
import { computed } from 'vue'
import { useUserStore } from '@/stores/user.store'

export function useAuth() {
  const userStore = useUserStore()

  const isLoggedIn = computed(() => userStore.isLogin)
  const userName = computed(() => userStore.userName)
  const userAvatar = computed(() => userStore.userAvatar)

  function requireAuth(): boolean {
    if (!userStore.isLogin) {
      uni.showToast({ title: '请先登录', icon: 'none' })
      uni.navigateTo({ url: '/pages/mine/login' })
      return false
    }
    return true
  }

  async function login(account: string, password: string) {
    return userStore.login(account, password)
  }

  async function logout() {
    await userStore.logout()
  }

  return {
    isLoggedIn,
    userName,
    userAvatar,
    requireAuth,
    login,
    logout
  }
}
