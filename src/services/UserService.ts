/**
 * 用户服务
 */
import { httpUtil } from '@/api/http'
import { API_CONFIG } from '@/constants/api'
import { UniStorage } from '@/utils/StorageUtil'
import type { User, LoginRequest, RegisterRequest } from '@/models/user.types'

export class UserService {
  /** 登录 */
  static async login(account: string, password: string): Promise<User> {
    const body: LoginRequest = { userAccount: account, userPassword: password }
    const response = await httpUtil.post<User>(API_CONFIG.PATHS.USER_LOGIN, body)
    if (response.code === 0 && response.data?.token) {
      UniStorage.setToken(response.data.token)
    }
    return response.data
  }

  /** 注册 */
  static async register(account: string, password: string, checkPassword: string): Promise<User> {
    const body: RegisterRequest = {
      userAccount: account,
      userPassword: password,
      checkPassword: checkPassword
    }
    const response = await httpUtil.post<User>(API_CONFIG.PATHS.USER_REGISTER, body)
    if (response.code === 0 && response.data?.token) {
      UniStorage.setToken(response.data.token)
    }
    return response.data
  }

  /** 获取用户信息 */
  static async getUserInfo(): Promise<User> {
    const response = await httpUtil.get<User>(API_CONFIG.PATHS.USER_INFO)
    return response.data
  }

  /** 登出 */
  static async logout(): Promise<void> {
    try {
      await httpUtil.post(API_CONFIG.PATHS.USER_LOGOUT)
    } catch (e) {
      console.warn('[UserService] logout error:', e)
    } finally {
      UniStorage.clearToken()
    }
  }

  /** 检查登录状态 */
  static isLoggedIn(): boolean {
    return UniStorage.getToken().length > 0
  }
}
