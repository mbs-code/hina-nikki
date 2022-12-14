export class RegexUtil {
  public static diaryRegex = /^\d{4}-\d{2}-\d{2}$/ //  ISO 8601 date: yyyy-mm-dd
  public static hashtagRegex = /^#[^#\s\v].{1,15}$/ // 垂直タブだけ除外されるらしい, 2+15文字まで
  // eslint-disable-next-line no-irregular-whitespace
  public static separateRegex = /\s|\v|\r\n|\n/ // スペースと改行に反応

  public static isDiaryTitle (val?: string): boolean {
    return val ? this.diaryRegex.test(val) : false
  }

  public static isHashtagTitle (val?: string): boolean {
    return val ? this.hashtagRegex.test(val) : false
  }

  public static hasSeparate (val?: string): boolean {
    return val ? this.separateRegex.test(val) : false
  }
}
