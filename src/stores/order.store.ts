/**
 * 订单状态管理
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { OrderService } from '@/services/OrderService'
import type { Order } from '@/models/order.types'
import { OrderStatus } from '@/models/order.types'

export const useOrderStore = defineStore('order', () => {
  // State
  const currentOrder = ref<Order | null>(null)
  const orders = ref<Order[]>([])

  // Actions
  async function fetchOrders(page: number = 1, pageSize: number = 10, status?: OrderStatus): Promise<void> {
    try {
      const response = await OrderService.getOrders(page, pageSize, status)
      if (page === 1) {
        orders.value = response.list || []
      } else {
        orders.value = [...orders.value, ...(response.list || [])]
      }
    } catch (e) {
      console.error('[orderStore] 获取订单列表失败:', e)
    }
  }

  async function fetchOrderDetail(orderId: string): Promise<void> {
    try {
      currentOrder.value = await OrderService.getOrderDetail(orderId)
    } catch (e) {
      console.error('[orderStore] 获取订单详情失败:', e)
    }
  }

  async function cancelOrder(orderId: string): Promise<void> {
    try {
      await OrderService.cancelOrder(orderId)
      if (currentOrder.value && currentOrder.value.id === orderId) {
        currentOrder.value.status = OrderStatus.CANCELLED
      }
      const idx = orders.value.findIndex(o => o.id === orderId)
      if (idx !== -1) {
        orders.value[idx].status = OrderStatus.CANCELLED
      }
    } catch (e) {
      console.error('[orderStore] 取消订单失败:', e)
    }
  }

  async function completeOrder(orderId: string): Promise<void> {
    try {
      await OrderService.completeOrder(orderId)
      if (currentOrder.value && currentOrder.value.id === orderId) {
        currentOrder.value.status = OrderStatus.COMPLETED
      }
      const idx = orders.value.findIndex(o => o.id === orderId)
      if (idx !== -1) {
        orders.value[idx].status = OrderStatus.COMPLETED
      }
    } catch (e) {
      console.error('[orderStore] 完成订单失败:', e)
    }
  }

  return {
    currentOrder,
    orders,
    fetchOrders,
    fetchOrderDetail,
    cancelOrder,
    completeOrder
  }
})
