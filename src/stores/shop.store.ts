/**
 * 店铺状态管理
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { ShopService } from '@/services/ShopService'
import type { Shop } from '@/models/shop.types'

export const useShopStore = defineStore('shop', () => {
  // State
  const currentShop = ref<Shop | null>(null)
  const shops = ref<Shop[]>([])

  // Actions
  async function fetchShops(): Promise<void> {
    try {
      shops.value = await ShopService.getShops()
    } catch (e) {
      console.error('[shopStore] 获取店铺列表失败:', e)
    }
  }

  async function fetchShopDetail(shopId: string): Promise<void> {
    try {
      currentShop.value = await ShopService.getShopDetail(shopId)
    } catch (e) {
      console.error('[shopStore] 获取店铺详情失败:', e)
    }
  }

  async function setShopByName(name: string): Promise<void> {
    try {
      currentShop.value = await ShopService.getShopByName(name)
    } catch (e) {
      console.error('[shopStore] 查找店铺失败:', e)
    }
  }

  function setCurrentShop(shop: Shop): void {
    currentShop.value = shop
  }

  return {
    currentShop,
    shops,
    fetchShops,
    fetchShopDetail,
    setShopByName,
    setCurrentShop
  }
})
