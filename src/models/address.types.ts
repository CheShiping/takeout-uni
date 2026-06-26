/** 用户地址 */
export interface UserAddress {
  id: string
  userId: string
  consignee: string
  phone: string
  province: string
  city: string
  district: string
  detail: string
  longitude: number
  latitude: number
  isDefault: number
  createTime: string
}

/** 添加地址请求 */
export interface AddAddressRequest {
  consignee: string
  phone: string
  province: string
  city: string
  district: string
  detail: string
  longitude: number
  latitude: number
  isDefault: number
}
