/** 购物车项 */
export interface CartItem {
  id: string
  userId: string
  shopId: string
  foodId: string
  specId: string
  foodName: string
  foodImage: string
  specName: string
  price: number
  quantity: number
  subtotal: number
  createTime: string
}

/** 购物车 */
export interface Cart {
  items: CartItem[]
}

/** 购物车同步请求 */
export interface CartSyncRequest {
  items: CartSyncItem[]
}

/** 购物车同步项 */
export interface CartSyncItem {
  shopId: string
  foodId: string
  specId: string
  quantity: number
}

/** 添加购物车请求 */
export interface AddCartRequest {
  shopId: string
  foodId: string
  specId: string
  quantity: number
}

/** 更新购物车请求 */
export interface UpdateCartRequest {
  cartId: string
  quantity: number
}

import type { CartFoodItem, FoodSpec } from './food.types'

/**
 * 将购物车食品项 (CartFoodItem) 转换为购物车项 (CartItem)
 */
export function cartFoodItemToCartItem(item: CartFoodItem): CartItem {
  let specId = item.specId || ''
  let specName = item.specName || ''

  if (!specId && item.specs && item.specs.length > 0) {
    const defaultSpec: FoodSpec = item.specs[0]
    specId = defaultSpec.id
    specName = defaultSpec.name
  }

  return {
    id: '',
    userId: '',
    shopId: item.shopId,
    foodId: item.id,
    specId: specId,
    foodName: item.name,
    foodImage: item.image,
    specName: specName,
    price: item.price,
    quantity: item.buyNum,
    subtotal: item.price * item.buyNum,
    createTime: new Date().toISOString()
  }
}
