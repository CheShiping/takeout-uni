/**
 * 食品服务
 */
import { httpUtil } from '@/api/http'
import { API_CONFIG } from '@/constants/api'
import type { FoodItem, FoodCategory, FoodListByCategory } from '@/models/food.types'
import type { PageResponse } from '@/models/api.types'
import { ShopService } from './ShopService'

export class FoodService {
  /** 获取食品列表 */
  static async getFoods(shopId?: string): Promise<FoodItem[]> {
    // 如果没有 shopId，先获取店铺列表
    if (!shopId) {
      try {
        const shops = await ShopService.getShops()
        if (shops.length > 0) {
          shopId = shops[0].id
        }
      } catch (e) {
        console.error('获取店铺失败:', e)
      }
    }
    
    const params: Record<string, unknown> = {}
    if (shopId) params.shopId = shopId
    const response = await httpUtil.get<FoodItem[]>(API_CONFIG.PATHS.FOOD_LIST, params)
    return (response.data || []).filter(food => food.status === 'on')
  }

  /** 获取食品详情 */
  static async getFoodDetail(foodId: string): Promise<FoodItem> {
    const url = API_CONFIG.PATHS.FOOD_DETAIL.replace('{id}', foodId)
    const response = await httpUtil.get<FoodItem>(url)
    return response.data
  }

  /** 获取分类列表（包含食品数据） */
  static async getCategories(shopId: string): Promise<FoodCategory[]> {
    const response = await httpUtil.get<FoodCategory[]>(API_CONFIG.PATHS.FOOD_CATEGORIES, { shopId })
    return response.data || []
  }

  /** 按分类获取食品（直接使用后端返回的分组数据） */
  static async getFoodsByCategory(shopId: string): Promise<FoodListByCategory[]> {
    const categories = await FoodService.getCategories(shopId)
    return categories.map(cat => ({
      categoryId: cat.id,
      categoryName: cat.name,
      foods: (cat.foods || []).filter(f => f.status === 'on')
    })).filter(item => item.foods.length > 0)
  }

  /** 搜索食品 */
  static async searchFoods(keyword: string, shopId?: string): Promise<FoodItem[]> {
    const response = await httpUtil.get<FoodItem[]>(API_CONFIG.PATHS.FOOD_SEARCH, {
      keyword,
      shopId
    } as Record<string, unknown>)
    return response.data || []
  }
}
