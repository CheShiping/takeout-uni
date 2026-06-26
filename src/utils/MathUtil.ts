/**
 * 数学运算工具类 - 浮点数精度运算
 */
export class MathUtil {
  /** 加法 */
  static addition(a: number, b: number): number {
    const factor = MathUtil._getFactor(a, b)
    return (a * factor + b * factor) / factor
  }

  /** 减法 */
  static subtraction(a: number, b: number): number {
    const factor = MathUtil._getFactor(a, b)
    return (a * factor - b * factor) / factor
  }

  /** 乘法 */
  static multiply(a: number, b: number): number {
    const aStr = a.toString()
    const bStr = b.toString()
    const aDec = aStr.includes('.') ? aStr.split('.')[1].length : 0
    const bDec = bStr.includes('.') ? bStr.split('.')[1].length : 0
    const factor = Math.pow(10, aDec + bDec)
    return (Number(aStr.replace('.', '')) * Number(bStr.replace('.', ''))) / factor
  }

  /** 除法 */
  static divide(a: number, b: number): number {
    const aStr = a.toString()
    const bStr = b.toString()
    const aDec = aStr.includes('.') ? aStr.split('.')[1].length : 0
    const bDec = bStr.includes('.') ? bStr.split('.')[1].length : 0
    const factor = Math.pow(10, Math.max(aDec, bDec))
    return MathUtil.multiply(a, factor) / MathUtil.multiply(b, factor)
  }

  /** 保留小数 */
  static toFixed(num: number, decimalPlaces: number = 2): number {
    const factor = Math.pow(10, decimalPlaces)
    return Math.round(num * factor) / factor
  }

  /** 获取精度因子 */
  private static _getFactor(a: number, b: number): number {
    const aStr = a.toString()
    const bStr = b.toString()
    const aDec = aStr.includes('.') ? aStr.split('.')[1].length : 0
    const bDec = bStr.includes('.') ? bStr.split('.')[1].length : 0
    return Math.pow(10, Math.max(aDec, bDec))
  }
}
