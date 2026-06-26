/**
 * Toast 提示工具类
 */
export class ToastUtil {
  static showMessage(message: string, duration: number = 2000): void {
    uni.showToast({
      title: message,
      icon: 'none',
      duration: duration
    })
  }

  static showSuccess(message: string): void {
    uni.showToast({
      title: message,
      icon: 'success',
      duration: 2000
    })
  }

  static showError(message: string): void {
    uni.showToast({
      title: message,
      icon: 'error',
      duration: 2000
    })
  }

  static showLoading(message: string = '加载中...'): void {
    uni.showLoading({
      title: message,
      mask: true
    })
  }

  static hideLoading(): void {
    uni.hideLoading()
  }

  /** 对话框提示 */
  static showDialog(title: string, content: string): void {
    uni.showModal({
      title: title,
      content: content,
      showCancel: false
    })
  }

  /** 确认对话框 (返回 Promise) */
  static showConfirm(title: string, content: string): Promise<boolean> {
    return new Promise((resolve) => {
      uni.showModal({
        title: title,
        content: content,
        success: (res) => {
          resolve(res.confirm)
        }
      })
    })
  }
}
