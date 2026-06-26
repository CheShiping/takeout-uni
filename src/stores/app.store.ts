/**
 * 应用全局状态
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  /** 当前选中底部Tab索引 */
  const selectedIndex = ref<number>(0)

  /** 顶部状态栏高度 */
  const topRectHeight = ref<number>(0)

  /** 底部导航栏高度 */
  const bottomRectHeight = ref<number>(0)

  /** 设置选中Tab */
  function setSelectedIndex(index: number) {
    selectedIndex.value = index
  }

  return {
    selectedIndex,
    topRectHeight,
    bottomRectHeight,
    setSelectedIndex
  }
})
