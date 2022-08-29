export class RegexUtil {
  public static yyyymmddRegex = /^\d{8}$/
  public static hashtagRegex = /^#[^#\s\v].+$/ // 垂直タブだけ除外されるらしい

  // eslint-disable-next-line no-irregular-whitespace
  public static separateRegex = / |　|\r\n|\n/

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
