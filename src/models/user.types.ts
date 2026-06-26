/** 用户信息 */
export interface User {
  id: string
  userAccount: string
  userName: string
  userAvatar: string
  userProfile: string
  userRole: string
  createTime: string
  updateTime: string
  token: string
}

/** 登录请求 */
export interface LoginRequest {
  userAccount: string
  userPassword: string
}

/** 注册请求 */
export interface RegisterRequest {
  userAccount: string
  userPassword: string
  checkPassword: string
}
