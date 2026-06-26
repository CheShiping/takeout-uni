/** API 配置 */
export const API_CONFIG = {
  // 开发环境使用相对路径走 Vite proxy，生产环境可配置为完整 URL
  BASE_URL: import.meta.env.VITE_API_BASE_URL || '',

  PATHS: {
    // 食品
    FOOD_LIST: '/api/food/list',
    FOOD_DETAIL: '/api/food/{id}',
    FOOD_CATEGORIES: '/api/food/categories',
    FOOD_BY_CATEGORY: '/api/food/category/{categoryId}',
    FOOD_SEARCH: '/api/food/search',

    // 店铺
    SHOP_LIST: '/api/shop/list',
    SHOP_DETAIL: '/api/shop/{id}',
    SHOP_NEARBY: '/api/shop/nearby',
    SHOP_OPEN: '/api/shop/open',

    // 地址
    ADDRESS_LIST: '/api/address/list',
    ADDRESS_ADD: '/api/address/add',
    ADDRESS_UPDATE: '/api/address/{id}',
    ADDRESS_DELETE: '/api/address/{id}',
    ADDRESS_DEFAULT: '/api/address/default',

    // 购物车
    CART_LIST: '/api/cart/list',
    CART_ADD: '/api/cart/add',
    CART_UPDATE: '/api/cart/update',
    CART_REMOVE: '/api/cart/{id}',
    CART_CLEAR: '/api/cart/clear',
    CART_SYNC: '/api/cart/sync',

    // 订单
    ORDER_LIST: '/api/order/list',
    ORDER_CREATE: '/api/order/create',
    ORDER_DETAIL: '/api/order/{id}',
    ORDER_CANCEL: '/api/order/cancel/{id}',
    ORDER_COMPLETE: '/api/order/complete/{id}',
    ORDER_BY_STATUS: '/api/order/status/{status}',
    ORDER_RECENT: '/api/order/recent',

    // 支付
    PAYMENT_CREATE: '/api/payment/create',
    PAYMENT_STATUS: '/api/payment/{id}/status',

    // 用户
    USER_LOGIN: '/api/user/login',
    USER_REGISTER: '/api/user/register',
    USER_INFO: '/api/user/get/login',
    USER_LOGOUT: '/api/user/logout',

    // 评价
    REVIEW_LIST: '/api/review/list',
    REVIEW_SUBMIT: '/api/review/submit',
    REVIEW_TOGGLE_LIKE: '/api/review/like/{reviewId}',

    // 搜索
    SEARCH_FOODS: '/api/food/search',
    SEARCH_SUGGESTIONS: '/api/search/suggestions',
    SEARCH_HOT: '/api/search/hot',
    SEARCH_HISTORY: '/api/search/history',
    SEARCH_CLEAR_HISTORY: '/api/search/history/clear',

    // 文件上传
    UPLOAD_IMAGE: '/file/upload/image'
  }
} as const

/**
 * 拼接完整图片 URL
 */
export function getImageUrl(key: string): string {
  if (!key) return ''
  if (key.startsWith('http://') || key.startsWith('https://')) return key
  return `/api/file/image/${key}`
}
