/**
 * 订单状态枚举 - 与后端保持一致
 */
export enum OrderStatus {
  UNPAID = 'unpaid',
  PAID = 'paid',
  DELIVERING = 'delivering',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

/** 订单状态字符串映射 */
export const ORDER_STATUS_MAP: Record<OrderStatus, string> = {
  [OrderStatus.UNPAID]: '待支付',
  [OrderStatus.PAID]: '已支付',
  [OrderStatus.DELIVERING]: '配送中',
  [OrderStatus.COMPLETED]: '已完成',
  [OrderStatus.CANCELLED]: '已取消'
}

/** 状态字符串映射到枚举 */
const ORDER_STATUS_REVERSE_MAP: Record<string, OrderStatus> = {
  '待支付': OrderStatus.UNPAID,
  '已支付': OrderStatus.PAID,
  '配送中': OrderStatus.DELIVERING,
  '已完成': OrderStatus.COMPLETED,
  '已取消': OrderStatus.CANCELLED
}

export function mapOrderStatus(status: string): OrderStatus {
  return ORDER_STATUS_REVERSE_MAP[status] || OrderStatus.UNPAID
}

export function reverseOrderStatus(status: OrderStatus): string {
  return ORDER_STATUS_MAP[status] || ''
}

/**
 * 订单类型
 */
export enum OrderType {
  TAKEOUT = 'takeout',
  DINE_IN = 'dine-in'
}

export const ORDER_TYPE_TEXT: Record<OrderType, string> = {
  [OrderType.TAKEOUT]: '外卖配送',
  [OrderType.DINE_IN]: '店内就餐'
}

/** 订单Tab类型 */
export type OrderTabType = 'ALL' | 'PENDING' | 'COMPLETED' | 'CANCELED'

/** 订单Tab配置 */
export interface OrderTab {
  key: OrderTabType
  label: string
}

export const ORDER_TABS: OrderTab[] = [
  { key: 'ALL', label: '全部' },
  { key: 'PENDING', label: '待处理' },
  { key: 'COMPLETED', label: '已完成' },
  { key: 'CANCELED', label: '已取消' }
]

/** 订单商品项 */
export interface OrderItem {
  id: string
  orderId: string
  foodId: string
  specId: string
  foodName: string
  foodImage: string
  specName: string
  price: number
  quantity: number
  subtotal: number
}

/** 订单 */
export interface Order {
  id: string
  orderNo: string
  userId: string
  shopId: string
  shopName: string
  shopLogo: string
  orderType: string
  status: OrderStatus
  totalAmount: number
  deliveryFee: number
  remark: string
  tableNumber: string
  addressId: string
  addressDetail: string
  consignee: string
  phone: string
  items: OrderItem[]
  createTime: string
  updateTime: string
  payTime: string
  deliveryTime: string
  completeTime: string
  cancelTime: string
}

/** 创建订单请求 */
export interface CreateOrderRequest {
  shopId: string
  orderType: string
  addressId: string
  tableNumber: string
  remark: string
  cartItemIds: string[]
}

/** 订单分页响应 */
export interface OrderPageResponse {
  list: Order[]
  total: number
  page: number
  pageSize: number
}

/**
 * 按Tab筛选订单
 */
export function filterOrdersByTab(orders: Order[], tabType: OrderTabType): Order[] {
  switch (tabType) {
    case 'PENDING':
      return orders.filter(o => o.status === OrderStatus.UNPAID || o.status === OrderStatus.PAID || o.status === OrderStatus.DELIVERING)
    case 'COMPLETED':
      return orders.filter(o => o.status === OrderStatus.COMPLETED)
    case 'CANCELED':
      return orders.filter(o => o.status === OrderStatus.CANCELLED)
    case 'ALL':
    default:
      return orders
  }
}

/**
 * 按Tab统计订单数量
 */
export function getOrderCountByTab(orders: Order[], tabType: OrderTabType): number {
  return filterOrdersByTab(orders, tabType).length
}

/** 获取订单状态名称 */
export function getOrderStatusName(status: OrderStatus): string {
  return ORDER_STATUS_MAP[status] || '未知'
}

/** 获取订单类型名称 */
export function getOrderTypeName(orderType: string): string {
  if (orderType === OrderType.TAKEOUT) return ORDER_TYPE_TEXT[OrderType.TAKEOUT]
  if (orderType === OrderType.DINE_IN) return ORDER_TYPE_TEXT[OrderType.DINE_IN]
  return '未知'
}

/** 判断订单是否在指定状态 */
export function isOrderInStatus(order: Order, status: OrderStatus): boolean {
  return order.status === status
}
