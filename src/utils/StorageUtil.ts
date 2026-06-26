/**
 * uni-app 本地存储工具
 */
export class UniStorage {
  static getToken(): string {
    return uni.getStorageSync('token') || ''
  }

  static setToken(token: string): void {
    uni.setStorageSync('token', token)
  }

  static clearToken(): void {
    uni.removeStorageSync('token')
  }

  static getItem<T>(key: string): T | null {
    try {
      const value = uni.getStorageSync(key)
      if (value) {
        return JSON.parse(value) as T
      }
      return null
    } catch {
      const raw = uni.getStorageSync(key)
      return raw as unknown as T
    }
  }

  static setItem(key: string, value: unknown): void {
    if (typeof value === 'string') {
      uni.setStorageSync(key, value)
    } else {
      uni.setStorageSync(key, JSON.stringify(value))
    }
  }

  static removeItem(key: string): void {
    uni.removeStorageSync(key)
  }
}
