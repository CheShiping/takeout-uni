/**
 * 敏感词过滤器
 */
export class SensitiveFilter {
  /** 内置敏感词库 */
  private static readonly SENSITIVE_WORDS: string[] = [
    '垃圾', '难吃', '恶心', '骗子', '假货',
    '黑心', '投诉', '举报', '差评', '退款',
    '欺诈', '有毒'
  ]

  /** 检查是否含有敏感词 */
  static hasSensitiveWord(text: string): boolean {
    return SensitiveFilter.SENSITIVE_WORDS.some(word => text.includes(word))
  }

  /** 过滤敏感词 (替换为 *) */
  static filter(text: string): string {
    let result = text
    SensitiveFilter.SENSITIVE_WORDS.forEach(word => {
      const replacement = '*'.repeat(word.length)
      result = result.split(word).join(replacement)
    })
    return result
  }

  /** 获取文本中的敏感词列表 */
  static getSensitiveWords(text: string): string[] {
    return SensitiveFilter.SENSITIVE_WORDS.filter(word => text.includes(word))
  }

  /**
   * 验证评价内容
   * @returns { valid: boolean, message: string }
   */
  static validateContent(content: string): { valid: boolean; message: string } {
    if (!content || content.trim().length === 0) {
      return { valid: false, message: '评价内容不能为空' }
    }
    if (content.trim().length < 5) {
      return { valid: false, message: '评价内容不能少于5个字' }
    }
    if (content.trim().length > 500) {
      return { valid: false, message: '评价内容不能超过500字' }
    }
    if (SensitiveFilter.hasSensitiveWord(content)) {
      const words = SensitiveFilter.getSensitiveWords(content)
      return { valid: false, message: `评价内容包含敏感词：${words.join('、')}` }
    }
    return { valid: true, message: '' }
  }
}
