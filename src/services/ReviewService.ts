/**
 * 评价服务
 */
import { httpUtil } from '@/api/http'
import { API_CONFIG } from '@/constants/api'
import type { Review, ReviewPageResponse, ReviewSubmitRequest } from '@/models/review.types'

export class ReviewService {
  /** 分页获取评价 */
  static async getReviews(
    shopId: string,
    pageNum: number = 1,
    pageSize: number = 10
  ): Promise<ReviewPageResponse> {
    const params: Record<string, unknown> = { shopId, pageNum, pageSize }
    const response = await httpUtil.get<ReviewPageResponse>(API_CONFIG.PATHS.REVIEW_LIST, params)
    return response.data || { list: [], total: 0, page: 1, pageSize: 10 }
  }

  /** 提交评价 */
  static async submitReview(request: ReviewSubmitRequest): Promise<Review> {
    const response = await httpUtil.post<Review>(API_CONFIG.PATHS.REVIEW_SUBMIT, request)
    return response.data
  }

  /** 切换点赞状态 */
  static async toggleLike(reviewId: string): Promise<Review> {
    const url = API_CONFIG.PATHS.REVIEW_TOGGLE_LIKE.replace('{reviewId}', reviewId)
    const response = await httpUtil.post<Review>(url)
    return response.data
  }
}
