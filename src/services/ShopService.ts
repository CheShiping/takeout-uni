/**
 * 店铺服务
 */
import { httpUtil } from '@/api/http'
import { API_CONFIG } from '@/constants/api'
import type { Shop, NearbyShop } from '@/models/shop.types'

export class ShopService {
  /** 获取所有店铺 */
  static async getShops(): Promise<Shop[]> {
    const response = await httpUtil.get<Shop[]>(API_CONFIG.PATHS.SHOP_LIST)
    return response.data || []
  }

  /** 获取店铺详情 */
  static async getShopDetail(shopId: string): Promise<Shop> {
    const url = API_CONFIG.PATHS.SHOP_DETAIL.replace('{id}', shopId)
    const response = await httpUtil.get<Shop>(url)
    return response.data
  }

  /** 按名称获取店铺 */
  static async getShopByName(name: string): Promise<Shop | null> {
    const shops = await ShopService.getShops()
    return shops.find(s => s.name === name) || shops[0] || null
  }

  /** 获取营业中的店铺 */
  static async getOpenShops(): Promise<Shop[]> {
    const response = await httpUtil.get<Shop[]>(API_CONFIG.PATHS.SHOP_OPEN)
    return response.data || []
  }

  /** 获取附近店铺 */
  static async getNearbyShops(latitude: number, longitude: number, radius?: number): Promise<NearbyShop[]> {
    const params: Record<string, unknown> = { latitude, longitude }
    if (radius) params.radius = radius
    const response = await httpUtil.get<NearbyShop[]>(API_CONFIG.PATHS.SHOP_NEARBY, params)
    return response.data || []
  }
}
