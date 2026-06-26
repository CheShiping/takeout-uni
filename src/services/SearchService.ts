/**
 * 搜索服务
 */
import { httpUtil } from '@/api/http'
import { API_CONFIG } from '@/constants/api'
import type { SearchResult, SearchFoodItem } from '@/models/search.types'
import type { FoodItem } from '@/models/food.types'

export class SearchService {
  /** 搜索食品 - 调用后端搜索接口 */
  static async searchFoods(keyword: string, shopId?: string, page: number = 1): Promise<SearchResult> {
    const params: Record<string, unknown> = { keyword }
    if (shopId) params.shopId = shopId
    const response = await httpUtil.get<FoodItem[]>(API_CONFIG.PATHS.SEARCH_FOODS, params)
    const foods = response.data || []

    // 转换为 SearchFoodItem 格式
    const searchFoods: SearchFoodItem[] = foods.map(food => ({
      id: food.id,
      name: food.name,
      image: food.image,
      price: food.price,
      monthlySales: food.monthlySales || 0,
      rating: food.rating || 0,
      shopId: food.shopId,
      shopName: ''
    }))

    return {
      foods: searchFoods,
      shops: [],
      totalCount: searchFoods.length,
      page: 1,
      pageSize: 20,
      hasMore: false
    }
  }

  /** 搜索建议 */
  static async getSuggestions(keyword: string): Promise<string[]> {
    try {
      const response = await httpUtil.get<string[]>(API_CONFIG.PATHS.SEARCH_SUGGESTIONS, {
        keyword
      } as Record<string, unknown>)
      return response.data || []
    } catch {
      return []
    }
  }

  /** 热门搜索 */
  static async getHotSearches(): Promise<string[]> {
    try {
      const response = await httpUtil.get<string[]>(API_CONFIG.PATHS.SEARCH_HOT)
      return response.data || []
    } catch {
      return ['宫保鸡丁', '红烧肉', '鱼香肉丝', '麻婆豆腐', '糖醋排骨']
    }
  }

  /** 搜索历史 */
  static async getSearchHistory(): Promise<string[]> {
    try {
      const response = await httpUtil.get<string[]>(API_CONFIG.PATHS.SEARCH_HISTORY)
      return response.data || []
    } catch {
      // 从本地存储读取
      const history = uni.getStorageSync('searchHistory')
      return history ? JSON.parse(history) : []
    }
  }

  /** 清除搜索历史 */
  static async clearSearchHistory(): Promise<void> {
    try {
      await httpUtil.delete(API_CONFIG.PATHS.SEARCH_CLEAR_HISTORY)
    } catch {
      // 清除本地存储
      uni.removeStorageSync('searchHistory')
    }
  }
}
