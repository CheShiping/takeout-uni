/** 支付方式 */
export enum PaymentMethod {
  BALANCE = 'balance'
}

/** 支付状态 */
export enum PaymentStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED'
}

/** 支付订单 */
export interface PaymentOrder {
  id: string
  orderId: string
  orderNo: string
  amount: number
  method: PaymentMethod
  status: PaymentStatus
  payTime: string
  createTime: string
}

/** 创建支付请求 */
export interface CreatePaymentRequest {
  orderId: string
  method: PaymentMethod
}

/** 获取支付状态名称 */
export function getPaymentStatusName(status: PaymentStatus): string {
  const map: Record<PaymentStatus, string> = {
    [PaymentStatus.PENDING]: '待支付',
    [PaymentStatus.SUCCESS]: '支付成功',
    [PaymentStatus.FAILED]: '支付失败',
    [PaymentStatus.REFUNDED]: '已退款'
  }
  return map[status] || '未知'
}

/** 获取支付方式名称 */
export function getPaymentMethodName(method: PaymentMethod): string {
  const map: Record<PaymentMethod, string> = {
    [PaymentMethod.BALANCE]: '余额支付'
  }
  return map[method] || '未知'
}
