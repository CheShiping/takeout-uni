/**
 * 权限检查工具类 - uni-app 跨平台适配
 */
export class PermissionsUtil {
  /**
   * 请求位置权限
   * @returns 是否授权
   */
  static async requestLocationPermission(): Promise<boolean> {
    return new Promise((resolve) => {
      // #ifdef MP-WEIXIN
      uni.getLocation({
        type: 'gcj02',
        success: () => resolve(true),
        fail: (err: any) => {
          if (err.errMsg?.includes('auth deny')) {
            uni.showModal({
              title: '权限提示',
              content: '需要获取您的位置信息来推荐附近店铺，请在设置中开启位置权限',
              success: (modalRes) => {
                if (modalRes.confirm) {
                  uni.openSetting({})
                }
              }
            })
          }
          resolve(false)
        }
      })
      // #endif

      // #ifdef APP-PLUS
      uni.getLocation({
        type: 'wgs84',
        success: () => resolve(true),
        fail: (err: any) => {
          if (err.errMsg?.includes('auth deny')) {
            uni.showModal({
              title: '权限提示',
              content: '需要获取您的位置信息来推荐附近店铺',
              success: (modalRes) => {
                if (modalRes.confirm) {
                  // App端打开权限设置
                  // plus.runtime.openURL('app-settings://')
                }
              }
            })
          }
          resolve(false)
        }
      })
      // #endif

      // #ifdef H5
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          () => resolve(true),
          () => {
            uni.showModal({
              title: '权限提示',
              content: '请在浏览器设置中允许访问您的位置信息'
            })
            resolve(false)
          }
        )
      } else {
        resolve(false)
      }
      // #endif
    })
  }

  /**
   * 检查是否已授权位置权限
   */
  static async checkLocationPermission(): Promise<boolean> {
    return new Promise((resolve) => {
      uni.getSetting({
        success: (res: any) => {
          const auth = res.authSetting
          // #ifdef MP-WEIXIN
          resolve(auth && auth['scope.userLocation'] === true)
          // #endif
          // #ifndef MP-WEIXIN
          // 非小程序平台默认返回true（首次调用时会弹出授权）
          resolve(true)
          // #endif
        },
        fail: () => resolve(false)
      })
    })
  }
}
