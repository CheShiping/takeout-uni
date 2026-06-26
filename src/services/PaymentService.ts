/**
 * 支付服务
 */
import { httpUtil } from '@/api/http'
import { API_CONFIG } from '@/constants/api'
import type { PaymentOrder } from '@/models/payment.types'
import { PaymentStatus } from '@/models/payment.types'

export class PaymentService {
  /** 创建支付 */
  static async createPayment(orderId: string, method: string): Promise<PaymentOrder> {
    const response = await httpUtil.post<PaymentOrder>(API_CONFIG.PATHS.PAYMENT_CREATE, undefined, { orderId })
    return response.data
  }

  /** 查询支付状态 */
  static async getPaymentStatus(paymentId: string): Promise<PaymentStatus> {
    const url = API_CONFIG.PATHS.PAYMENT_STATUS.replace('{id}', paymentId)
    const response = await httpUtil.get<{ status: string }>(url)
    const status = (response.data?.status || 'PENDING').toUpperCase() as PaymentStatus
    return status
  }

  /**
   * 轮询等待支付结果
   * @param paymentId 支付记录ID
   * @param timeout 超时时间(秒)，默认30秒
   * @param interval 轮询间隔(毫秒)，默认1000ms
   */
  static async waitForPayment(
    paymentId: string,
    timeout: number = 30,
    interval: number = 1000
  ): Promise<PaymentStatus> {
    const startTime = Date.now()
    const maxTime = startTime + timeout * 1000

    while (Date.now() < maxTime) {
      try {
        const status = await PaymentService.getPaymentStatus(paymentId)
        if (status === PaymentStatus.SUCCESS || status === PaymentStatus.FAILED) {
          return status
        }
      } catch (e) {
        console.warn('[PaymentService] 轮询支付状态失败:', e)
      }
      await new Promise(resolve => setTimeout(resolve, interval))
    }

    const finalStatus = await PaymentService.getPaymentStatus(paymentId)
    return finalStatus
  }
}
