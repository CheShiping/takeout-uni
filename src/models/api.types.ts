/** 通用 API 响应 */
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}

/** 分页响应 */
export interface PageResponse<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}
