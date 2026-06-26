/**
 * 地址服务
 */
import { httpUtil } from '@/api/http'
import { API_CONFIG } from '@/constants/api'
import type { UserAddress, AddAddressRequest } from '@/models/address.types'

export class AddressService {
  /** 获取地址列表 */
  static async getAddresses(): Promise<UserAddress[]> {
    const response = await httpUtil.get<UserAddress[]>(API_CONFIG.PATHS.ADDRESS_LIST)
    return response.data || []
  }

  /** 新增地址 */
  static async addAddress(request: AddAddressRequest): Promise<UserAddress> {
    const response = await httpUtil.post<UserAddress>(API_CONFIG.PATHS.ADDRESS_ADD, request)
    return response.data
  }

  /** 更新地址 */
  static async updateAddress(request: UserAddress): Promise<UserAddress> {
    const url = API_CONFIG.PATHS.ADDRESS_UPDATE.replace('{id}', String(request.id))
    const response = await httpUtil.put<UserAddress>(url, request)
    return response.data
  }

  /** 删除地址 */
  static async deleteAddress(id: string): Promise<void> {
    const url = API_CONFIG.PATHS.ADDRESS_DELETE.replace('{id}', id)
    await httpUtil.delete(url)
  }

  /** 获取默认地址 */
  static async getDefaultAddress(): Promise<UserAddress | null> {
    const addresses = await AddressService.getAddresses()
    return addresses.find(a => a.isDefault === 1) || addresses[0] || null
  }
}
