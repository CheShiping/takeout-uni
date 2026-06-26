import App from './App.vue'
import { createSSRApp } from 'vue'
import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'
import uviewPro from 'uview-pro'

export function createApp() {
  const app = createSSRApp(App)
  const pinia = createPinia()
  pinia.use(createPersistedState({
    storage: {
      getItem: (key: string) => uni.getStorageSync(key),
      setItem: (key: string, value: string) => uni.setStorageSync(key, value),
    }
  }))
  app.use(pinia)
  app.use(uviewPro)

  // 全局路由守卫：检查需要登录的页面
  const authRequiredPages = [
    'pages/order/order-preview',
    'pages/order/order-detail',
    'pages/order/payment',
    'pages/address/add-address',
    'pages/review/review-submit'
  ]

  app.mixin({
    onLoad() {
      const pages = getCurrentPages()
      const currentPage = pages[pages.length - 1]
      const route = currentPage?.route || ''
      if (authRequiredPages.includes(route)) {
        const token = uni.getStorageSync('token')
        if (!token) {
          uni.redirectTo({ url: '/pages/mine/login' })
        }
      }
    }
  })

  return {
    app,
    pinia
  }
}
