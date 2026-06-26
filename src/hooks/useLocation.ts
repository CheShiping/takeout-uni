/**
 * 地理位置相关组合式函数
 */
import { ref } from 'vue'
import { ToastUtil } from '@/utils/ToastUtil'

export function useLocation() {
  const latitude = ref<number>(0)
  const longitude = ref<number>(0)
  const loading = ref(false)

  async function getLocation(): Promise<boolean> {
    loading.value = true
    try {
      const res = await uni.getLocation({
        type: 'wgs84',
        isHighAccuracy: true
      })
      latitude.value = res.latitude
      longitude.value = res.longitude
      return true
    } catch (err) {
      console.error('获取位置失败:', err)
      ToastUtil.showError('获取位置失败')
      return false
    } finally {
      loading.value = false
    }
  }

  return {
    latitude,
    longitude,
    loading,
    getLocation
  }
}
