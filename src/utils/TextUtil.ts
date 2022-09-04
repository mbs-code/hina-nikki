export class TextUtil {
  public static lineLength (text?: string): number | undefined {
    if (text) {
      const res = text.match(/\r\n|\n/g)
      return (res ? res.length : 0) + 1
    }
    return undefined
  }

  public static charCount (text?: string): number | undefined {
    return text ? text.length : undefined
  }
}
