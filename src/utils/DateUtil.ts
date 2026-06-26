/**
 * 日期工具类
 */
export class DateUtil {
  /**
   * 格式化完整日期时间
   * @param timeStr 时间戳(秒/毫秒)或日期字符串
   */
  static formatTime(timeStr: string): string {
    if (!timeStr) return ''
    const date = DateUtil._parseDate(timeStr)
    return DateUtil.formatDate(date)
  }

  /** 格式化 Date 对象 */
  static formatDate(date: Date): string {
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, '0')
    const d = String(date.getDate()).padStart(2, '0')
    const h = String(date.getHours()).padStart(2, '0')
    const i = String(date.getMinutes()).padStart(2, '0')
    const s = String(date.getSeconds()).padStart(2, '0')
    return `${y}-${m}-${d} ${h}:${i}:${s}`
  }

  /** 仅日期 yyyy-MM-dd */
  static formatDateOnly(timeStr: string): string {
    if (!timeStr) return ''
    const date = DateUtil._parseDate(timeStr)
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, '0')
    const d = String(date.getDate()).padStart(2, '0')
    return `${y}-${m}-${d}`
  }

  /** 仅时间 HH:mm:ss */
  static formatTimeOnly(timeStr: string): string {
    if (!timeStr) return ''
    const date = DateUtil._parseDate(timeStr)
    const h = String(date.getHours()).padStart(2, '0')
    const i = String(date.getMinutes()).padStart(2, '0')
    const s = String(date.getSeconds()).padStart(2, '0')
    return `${h}:${i}:${s}`
  }

  /** 相对时间描述 */
  static formatRelativeTime(timeStr: string): string {
    if (!timeStr) return ''
    const date = DateUtil._parseDate(timeStr)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const seconds = Math.floor(diff / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (seconds < 60) return '刚刚'
    if (minutes < 60) return `${minutes}分钟前`
    if (hours < 24) return `${hours}小时前`
    if (days < 30) return `${days}天前`
    return DateUtil.formatDateOnly(timeStr)
  }

  /** 内部：解析时间字符串为 Date 对象 */
  private static _parseDate(timeStr: string): Date {
    // 时间戳（秒级）
    if (/^\d{10}$/.test(timeStr)) {
      return new Date(parseInt(timeStr) * 1000)
    }
    // 时间戳（毫秒级）
    if (/^\d{13}$/.test(timeStr)) {
      return new Date(parseInt(timeStr))
    }
    return new Date(timeStr)
  }
}
