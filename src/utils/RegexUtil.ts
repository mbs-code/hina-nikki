export class RegexUtil {
  public static yyyymmddRegex = /^\d{8}$/
  public static hashtagRegex = /^#\S+$/
  public static separateRegex = / |　|\r\n|\n/ // eslint-disable-line no-irregular-whitespace

  public static isDiaryTitle (val?: string): boolean {
    return val ? this.yyyymmddRegex.test(val) : false
  }

  public static isHashtag (val?: string): boolean {
    return val ? this.hashtagRegex.test(val) : false
  }

  public static isSeparate (val?: string): boolean {
    return val ? this.separateRegex.test(val) : false
  }
}
