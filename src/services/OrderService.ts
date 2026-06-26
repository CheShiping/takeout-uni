/**
 * 订单服务
 */
import { httpUtil } from '@/api/http'
import { API_CONFIG } from '@/constants/api'
import type { Order, OrderPageResponse, CreateOrderRequest } from '@/models/order.types'
import { OrderStatus } from '@/models/order.types'

export class OrderService {
  /** 分页获取订单 */
  static async getOrders(page: number = 1, pageSize: number = 10, status?: OrderStatus): Promise<OrderPageResponse> {
    const params: Record<string, unknown> = { page, pageSize }
    if (status !== undefined && status !== null) {
      params.status = status
    }
    const response = await httpUtil.get<OrderPageResponse>(API_CONFIG.PATHS.ORDER_LIST, params)
    return response.data || { list: [], total: 0, page: 1, pageSize: 10 }
  }

  /** 创建订单 */
  static async createOrder(request: CreateOrderRequest): Promise<string> {
    const response = await httpUtil.post<string>(API_CONFIG.PATHS.ORDER_CREATE, request)
    return response.data
  }

  /** 获取订单详情 */
  static async getOrderDetail(orderId: string): Promise<Order> {
    const url = API_CONFIG.PATHS.ORDER_DETAIL.replace('{id}', orderId)
    const response = await httpUtil.get<Order>(url)
    return response.data
  }

  /** 取消订单 */
  static async cancelOrder(orderId: string): Promise<void> {
    const url = API_CONFIG.PATHS.ORDER_CANCEL.replace('{id}', orderId)
    await httpUtil.put(url)
  }

  /** 完成订单 */
  static async completeOrder(orderId: string): Promise<void> {
    const url = API_CONFIG.PATHS.ORDER_COMPLETE.replace('{id}', orderId)
    await httpUtil.put(url)
  }

  /** 按状态获取订单 */
  static async getOrdersByStatus(status: OrderStatus): Promise<Order[]> {
    const url = API_CONFIG.PATHS.ORDER_BY_STATUS.replace('{status}', String(status))
    const response = await httpUtil.get<Order[]>(url)
    return response.data || []
  }

  /** 获取最近订单 */
  static async getRecentOrders(limit: number = 10): Promise<Order[]> {
    const response = await httpUtil.get<Order[]>(API_CONFIG.PATHS.ORDER_RECENT, { limit } as Record<string, unknown>)
    return (response.data || []).slice(0, limit)
  }
}
