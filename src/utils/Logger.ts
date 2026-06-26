/**
 * 日志工具类
 */
export class Logger {
  private static readonly TAG = 'TakeOut'

  static debug(message: string, ...args: unknown[]): void {
    console.debug(`[${Logger.TAG}] ${message}`, ...args)
  }

  static info(message: string, ...args: unknown[]): void {
    console.info(`[${Logger.TAG}] ${message}`, ...args)
  }

  static warn(message: string, ...args: unknown[]): void {
    console.warn(`[${Logger.TAG}] ${message}`, ...args)
  }

  static error(message: string, ...args: unknown[]): void {
    console.error(`[${Logger.TAG}] ${message}`, ...args)
  }
}
