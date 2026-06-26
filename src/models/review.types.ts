/** 评价 */
export interface Review {
  id: string
  orderId: string
  userId: string
  userName: string
  userAvatar: string
  foodId: string
  shopId: string
  rating: number
  content: string
  images: string[]
  tags: string[]
  isAnonymous: boolean
  reply: string
  replyTime: string
  likeCount: number
  isLiked: boolean
  createTime: string
}

/** 评价分页响应 */
export interface ReviewPageResponse {
  list: Review[]
  total: number
  page: number
  pageSize: number
}

/** 评价提交请求 */
export interface ReviewSubmitRequest {
  orderId: string
  foodId: string
  shopId: string
  rating: number
  content: string
  images: string[]
  tags: string[]
  isAnonymous: boolean
}

/** 评价标签 */
export const REVIEW_TAGS: string[] = [
  '味道好',
  '分量足',
  '食材新鲜',
  '包装精美',
  '配送快',
  '性价比高',
  '回头客',
  '推荐'
]

/** 内容验证结果 */
export interface ContentValidationResult {
  valid: boolean
  message: string
}
