/** 店铺 */
export interface Shop {
  id: string
  name: string
  logo: string
  rating: number
  monthlySales: number
  address: string
  longitude: number
  latitude: number
  phone: string
  businessHours: string
  deliveryFee: number
  minOrderAmount: number
  description: string
  status: string
}

/** 附近店铺 */
export interface NearbyShop {
  id: string
  name: string
  logo: string
  rating: number
  monthlySales: number
  address: string
  longitude: number
  latitude: number
  distance: number
  phone: string
  businessHours: string
}
