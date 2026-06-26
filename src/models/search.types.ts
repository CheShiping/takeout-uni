/** 搜索请求 */
export interface SearchRequest {
  keyword: string
  shopId?: string
  page?: number
  pageSize?: number
  sortType?: SearchSortType
}

/** 搜索排序类型 */
export enum SearchSortType {
  DEFAULT = 'default',
  SALES = 'sales',
  PRICE_ASC = 'price_asc',
  PRICE_DESC = 'price_desc',
  RATING = 'rating'
}

/** 搜索结果 */
export interface SearchResult {
  foods: SearchFoodItem[]
  shops: SearchShopItem[]
  totalCount: number
  page: number
  pageSize: number
  hasMore: boolean
}

/** 搜索食品项 */
export interface SearchFoodItem {
  id: string
  name: string
  image: string
  price: number
  monthlySales: number
  rating: number
  shopId: string
  shopName: string
}

/** 搜索店铺项 */
export interface SearchShopItem {
  id: string
  name: string
  logo: string
  rating: number
  monthlySales: number
}
