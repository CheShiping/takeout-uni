/** 食品分类 */
export interface FoodCategory {
  id: string
  shopId: string
  name: string
  sort: number
  icon: string
  foods: FoodItem[]
}

/** 食品规格 */
export interface FoodSpec {
  id: string
  foodId: string
  name: string
  price: number
  sort: number
}

/** 食品图片 */
export interface FoodImage {
  id: string
  foodId: string
  imageUrl: string
  sort: number
}

/** 食品项 */
export interface FoodItem {
  id: string
  shopId: string
  categoryId: string
  name: string
  description: string
  image: string
  price: number
  originalPrice: number
  monthlySales: number
  rating: number
  status: string
  sort: number
  createTime: string
  specs: FoodSpec[]
  images: FoodImage[]
}

/** 购物车食品项 (继承 FoodItem) */
export interface CartFoodItem extends FoodItem {
  buyNum: number
  selectedSpecs?: Record<string, string>
  specId?: string
  specName?: string
}

/** 按分类食品列表 */
export interface FoodListByCategory {
  categoryId: string
  categoryName: string
  foods: FoodItem[]
}

/** 分类食品 */
export interface CategoryFoods {
  category: string
  list: FoodItem[]
}
