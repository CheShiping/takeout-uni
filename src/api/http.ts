/**
 * HTTP 工具类 - 基于 axios 封装
 */
import axios, { type AxiosInstance, type InternalAxiosRequestConfig, type AxiosResponse } from 'axios'
import { API_CONFIG } from '@/constants/api'
import { UniStorage } from '@/utils/StorageUtil'
import { ToastUtil } from '@/utils/ToastUtil'
import type { ApiResponse } from '@/models/api.types'

class HttpUtil {
  private instance: AxiosInstance

  constructor() {
    this.instance = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: 15000,
      headers: {
        'Content-Type': 'application/json'
      }
    })

    // 请求拦截器 - 自动附加 Token
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = UniStorage.getToken()
        if (token) {
          config.headers['satoken'] = 'Bearer ' + token
        }
        return config
      },
      (error) => {
        console.error('[HttpUtil] 请求拦截错误:', error)
        return Promise.reject(error)
      }
    )

    // 响应拦截器 - 统一错误处理
    this.instance.interceptors.response.use(
      (response: AxiosResponse<ApiResponse>) => {
        const res = response.data
        if (res.code === 0) {
          return response
        } else {
          ToastUtil.showError(res.message || '请求失败')
          return Promise.reject(new Error(res.message || '请求失败'))
        }
      },
      (error) => {
        console.error('[HttpUtil] 响应错误:', error)
        const message = error?.response?.data?.message || error.message || '网络请求失败'
        ToastUtil.showError(message)
        return Promise.reject(error)
      }
    )
  }

  /** GET 请求 */
  async get<T>(url: string, params?: Record<string, unknown>): Promise<ApiResponse<T>> {
    const response = await this.instance.get<ApiResponse<T>>(url, { params })
    return response.data
  }

  /** POST 请求 */
  async post<T>(url: string, body?: unknown, params?: Record<string, unknown>): Promise<ApiResponse<T>> {
    const response = await this.instance.post<ApiResponse<T>>(url, body, { params })
    return response.data
  }

  /** PUT 请求 */
  async put<T>(url: string, body?: unknown, params?: Record<string, unknown>): Promise<ApiResponse<T>> {
    const response = await this.instance.put<ApiResponse<T>>(url, body, { params })
    return response.data
  }

  /** DELETE 请求 */
  async delete<T>(url: string, params?: Record<string, unknown>): Promise<ApiResponse<T>> {
    const response = await this.instance.delete<ApiResponse<T>>(url, { params })
    return response.data
  }

  /** 文件上传 (使用 uni.uploadFile) */
  async upload<T>(url: string, filePath: string, fileName?: string): Promise<ApiResponse<T>> {
    return new Promise((resolve, reject) => {
      const token = UniStorage.getToken()
      const header: Record<string, string> = {}
      if (token) {
        header['satoken'] = 'Bearer ' + token
      }

      uni.uploadFile({
        url: `${API_CONFIG.BASE_URL}${url}`,
        filePath: filePath,
        name: 'file',
        fileName: fileName || 'image.jpg',
        fileType: 'image',
        header,
        success: (uploadRes) => {
          try {
            const result: ApiResponse<T> = JSON.parse(uploadRes.data)
            if (result.code === 0) {
              resolve(result)
            } else {
              ToastUtil.showError(result.message || '上传失败')
              reject(new Error(result.message || '上传失败'))
            }
          } catch (e) {
            console.error('[HttpUtil] 上传响应解析失败:', e)
            reject(new Error('响应格式错误'))
          }
        },
        fail: (error) => {
          console.error('[HttpUtil] 上传失败:', error)
          ToastUtil.showError('上传失败')
          reject(error)
        }
      })
    })
  }
}

export const httpUtil = new HttpUtil()
