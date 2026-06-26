<script setup lang="ts">
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app'
import { useUserStore } from '@/stores/user.store'
import { Logger } from '@/utils/Logger'

onLaunch(() => {
  Logger.info('App Launch')
  const userStore = useUserStore()
  // 尝试恢复登录态
  if (userStore.token) {
    userStore.fetchUserInfo().catch(() => {})
  }
})

onShow(() => {
  Logger.info('App Show')
})

onHide(() => {
  Logger.info('App Hide')
})
</script>

<style lang="scss">
/* 全局样式 */
page {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  color: #333;
  background-color: #f5f5f5;
  font-size: 14px;
}

.safe-area-bottom {
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}
</style>
