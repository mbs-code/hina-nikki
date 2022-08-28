import { formatISO } from 'date-fns'
import { Database } from '~~/src/databases/Database'
import { DBReport, formatReport, FormReport, parseReport, Report } from '~~/src/databases/models/Report'

export type SearchReport = {
  phrases?: string[]
  hashtags?: string[]
  isDiary?: boolean
  sorts?: [keyof DBReport, 'asc' | 'desc'][]
}

const isBool = (val: unknown) => typeof val === 'boolean'
export class ReportAPI {
  public static async getAll (search?: SearchReport): Promise<Report[]> {
    // レポートの取得
    const reports = await Database.getDB()
      .selectFrom('reports')
      .selectAll()
      .if(Boolean(search?.phrases), qb => search.phrases.reduce((qb, val) => qb.where('tags', 'like', `%${val}%`), qb))
      .if(Boolean(search?.hashtags), qb => search.hashtags.reduce((qb, val) => qb.where('tags', 'like', `%${val}%`), qb))
      .if(isBool(search?.isDiary), qb => qb.where('is_diary', '=', search.isDiary ? 1 : 0))
      .if(Boolean(search?.sorts), qb => search.sorts.reduce((qb, sort) => qb.orderBy(sort[0], sort[1]), qb))
      .execute()

    return reports.map(report => formatReport(report))
  }

  public static async get (pageId: number): Promise<Report> {
    // レポートの取得
    const report = await Database.getDB()
      .selectFrom('reports')
      .selectAll()
      .where('id', '=', pageId)
      .executeTakeFirstOrThrow()

    return formatReport(report)
  }

  public static async getByTitle (pageTitle: string): Promise<Report | undefined> {
    // レポートの取得
    const report = await Database.getDB()
      .selectFrom('reports')
      .selectAll()
      .where('title', '=', pageTitle)
      .executeTakeFirst()

    if (!report) { return undefined }

    return formatReport(report)
  }

  public static async create (form: FormReport): Promise<Report> {
    const now = formatISO(new Date())

    // レポートを作成
    const { insertId } = await Database.getDB()
      .insertInto('reports')
      .values({
        ...parseReport(form),
        created_at: now,
        updated_at: now,
      })
      .executeTakeFirst()

    return await this.get(Number(insertId))
  }

  public static async update (reportId: number, form: FormReport): Promise<Report> {
    const now = formatISO(new Date())

    // レポートを更新
    const { numUpdatedRows } = await Database.getDB()
      .updateTable('reports')
      .set({
        ...parseReport(form),
        updated_at: now,
      })
      .where('id', '=', reportId)
      .executeTakeFirst()

    if (Number(numUpdatedRows) === 0) {
      throw new Error('no result')
    }

    return await this.get(Number(reportId))
  }

  public static async remove (reportId: number): Promise<boolean> {
    // レポートを削除
    const { numDeletedRows } = await Database.getDB()
      .deleteFrom('reports')
      .where('id', '=', reportId)
      .executeTakeFirst()

    if (Number(numDeletedRows) === 0) {
      throw new Error('no result')
    }

    return true
  }
}
