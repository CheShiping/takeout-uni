/**
 * 购物车状态管理
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { MathUtil } from '@/utils/MathUtil'
import type { CartFoodItem } from '@/models/food.types'

export const useCartStore = defineStore('cart', () => {
  // State
  const choosePrice = ref<number>(0)
  const buyFoods = ref<Record<string, CartFoodItem>>({})
  const chooseTakeOutAddr = ref<string>('')
  const orderType = ref<string>('takeout')
  const chooseShop = ref<string>('')

  // Getters
  const totalItems = computed(() => Object.keys(buyFoods.value).length)
  const totalPrice = computed(() => MathUtil.toFixed(choosePrice.value, 2))
  const buyFoodList = computed(() => Object.values(buyFoods.value))

  // Actions
  function addToCart(item: CartFoodItem): void {
    const existingItem = buyFoods.value[item.id]

    if (existingItem) {
      // 已存在，增加数量
      existingItem.buyNum += item.buyNum || 1
      choosePrice.value = MathUtil.addition(choosePrice.value, MathUtil.multiply(item.price, item.buyNum || 1))
    } else {
      // 新商品
      const newItem = { ...item, buyNum: item.buyNum || 1 }
      buyFoods.value[item.id] = newItem
      choosePrice.value = MathUtil.addition(choosePrice.value, MathUtil.multiply(item.price, newItem.buyNum))
    }
  }

  function increaseQuantity(foodId: string): void {
    const item = buyFoods.value[foodId]
    if (item) {
      item.buyNum += 1
      choosePrice.value = MathUtil.addition(choosePrice.value, item.price)
    }
  }

  function decreaseQuantity(foodId: string): void {
    const item = buyFoods.value[foodId]
    if (item) {
      if (item.buyNum > 1) {
        item.buyNum -= 1
        choosePrice.value = MathUtil.subtraction(choosePrice.value, item.price)
      } else {
        removeFromCart(foodId)
      }
    }
  }

  function removeFromCart(foodId: string): void {
    const item = buyFoods.value[foodId]
    if (item) {
      choosePrice.value = MathUtil.subtraction(choosePrice.value, MathUtil.multiply(item.price, item.buyNum))
      delete buyFoods.value[foodId]
    }
  }

  function getBuyNum(foodId: string): number {
    return buyFoods.value[foodId]?.buyNum || 0
  }

  function setOrderType(type: string): void {
    orderType.value = type
  }

  function setChooseShop(shop: string): void {
    chooseShop.value = shop
  }

  function setTakeOutAddr(addrId: string): void {
    chooseTakeOutAddr.value = addrId
  }

  function clearCart(): void {
    buyFoods.value = {}
    choosePrice.value = 0
    chooseShop.value = ''
    chooseTakeOutAddr.value = ''
    orderType.value = 'takeout'
  }

  return {
    choosePrice,
    buyFoods,
    chooseTakeOutAddr,
    orderType,
    chooseShop,
    totalItems,
    totalPrice,
    buyFoodList,
    addToCart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    getBuyNum,
    setOrderType,
    setChooseShop,
    setTakeOutAddr,
    clearCart
  }
})
