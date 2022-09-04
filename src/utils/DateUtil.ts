/* eslint-disable import/no-duplicates */
import {
  formatISO,
  parse as dateParse,
  format as dateFormat,
  formatDistanceToNow,
} from 'date-fns'
import { ja } from 'date-fns/locale'

export class DateUtil {
  public static parseByDiaryTitle (title?: string): Date | undefined {
    if (title) {
      return dateParse(title, 'yyyy-MM-dd', new Date())
    }
    return undefined
  }

  public static formatDiaryTitle (date?: Date): string | undefined {
    if (date) {
      return formatISO(date, { representation: 'date' }) // yyyy-mm-dd
    }
    return undefined
  }

  ///

  public static formatISO (date?: Date): string | undefined {
    if (date) {
      return formatISO(date)
    }
    return undefined
  }

  public static formatDate (date?: Date): string | undefined {
    if (date) {
      return dateFormat(date, 'yyyy-MM-dd')
    }
    return undefined
  }

  public static formatHumanity (date?: Date): string | undefined {
    if (date) {
      return formatDistanceToNow(date, { addSuffix: true, locale: ja })
    }
    return undefined
  }

  public static formatDisplay (date?: Date, hasHumanity = true): string | undefined {
    if (date) {
      let str = dateFormat(date, 'yyyy-MM-dd HH:mm:ss')
      if (hasHumanity) {
        const hum = this.formatHumanity(date)
        str += ` (${hum})`
      }
      return str
    }
    return undefined
  }
}
