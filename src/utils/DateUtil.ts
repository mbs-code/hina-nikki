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
      return dateParse(title, 'yyyyMMdd', new Date())
    }
    return undefined
  }

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

  public static formatDiaryTitle (date?: Date) {
    if (date) {
      return dateFormat(date, 'yyyyMMdd')
    }
    return undefined
  }

  public static formatHumanity (date?: Date): string | undefined {
    if (date) {
      return formatDistanceToNow(date, { addSuffix: true, locale: ja })
    }
    return undefined
  }
}
