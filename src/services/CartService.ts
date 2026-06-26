/**
 * 购物车服务
 */
import { httpUtil } from '@/api/http'
import { API_CONFIG } from '@/constants/api'
import type { CartItem, CartSyncRequest, AddCartRequest, UpdateCartRequest } from '@/models/cart.types'

export class CartService {
  /** 获取购物车列表 */
  static async getCartList(): Promise<CartItem[]> {
    const response = await httpUtil.get<CartItem[]>(API_CONFIG.PATHS.CART_LIST)
    return response.data || []
  }

  /** 添加到购物车 */
  static async addToCart(request: AddCartRequest): Promise<CartItem> {
    const response = await httpUtil.post<CartItem>(
      API_CONFIG.PATHS.CART_ADD,
      request as unknown as Record<string, unknown>
    )
    return response.data
  }

  /** 更新购物车项 */
  static async updateCartItem(cartId: string, quantity: number): Promise<CartItem> {
    const body: Record<string, unknown> = { cartId, quantity }
    const response = await httpUtil.put<CartItem>(API_CONFIG.PATHS.CART_UPDATE, body)
    return response.data
  }

  /** 删除购物车项 */
  static async removeCartItem(id: string): Promise<void> {
    const url = API_CONFIG.PATHS.CART_REMOVE.replace('{id}', id)
    await httpUtil.delete(url)
  }

  /** 清空购物车 */
  static async clearCart(): Promise<void> {
    await httpUtil.delete(API_CONFIG.PATHS.CART_CLEAR)
  }

  /** 同步购物车到服务器 */
  static async syncCart(request: CartSyncRequest): Promise<boolean> {
    const response = await httpUtil.post<boolean>(API_CONFIG.PATHS.CART_SYNC, request)
    return response.data || false
  }
}
