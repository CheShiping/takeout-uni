/**
 * 购物车相关组合式函数
 */
import { computed } from 'vue'
import { useCartStore } from '@/stores/cart.store'
import { ToastUtil } from '@/utils/ToastUtil'
import type { CartFoodItem } from '@/models/food.types'

export function useCart() {
  const cartStore = useCartStore()

  const totalItems = computed(() => cartStore.totalItems)
  const totalPrice = computed(() => cartStore.totalPrice)
  const buyFoodList = computed(() => cartStore.buyFoodList)

  function addToCart(item: CartFoodItem) {
    cartStore.addToCart(item)
    ToastUtil.showSuccess('已加入购物车')
  }

  function removeFromCart(foodId: string) {
    cartStore.removeFromCart(foodId)
  }

  function increaseQuantity(foodId: string) {
    cartStore.increaseQuantity(foodId)
  }

  function decreaseQuantity(foodId: string) {
    cartStore.decreaseQuantity(foodId)
  }

  function getBuyNum(foodId: string): number {
    return cartStore.getBuyNum(foodId)
  }

  function clearCart() {
    cartStore.clearCart()
  }

  return {
    totalItems,
    totalPrice,
    buyFoodList,
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    getBuyNum,
    clearCart
  }
}
