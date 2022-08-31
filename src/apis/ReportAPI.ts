import { TagAPI } from '~~/src/apis/TagAPI'
import { Database } from '~~/src/databases/Database'
import { DBReport, formatReport, FormReport, parseReport, Report } from '~~/src/databases/models/Report'
import { DateUtil } from '~~/src/utils/DateUtil'

export type SearchReport = {
  phrases?: string[] // textとtitleのlike検索
  hashtags?: string[] // ハッシュタグのlike検索
  isDiary?: boolean // 日記だけ取得
  limit?: number
  sorts?: [keyof DBReport, 'asc' | 'desc'][]
}

const isBool = (val: unknown) => typeof val === 'boolean'

export class ReportAPI {
  public static async getAll (search?: SearchReport): Promise<Report[]> {
    // レポートの取得
    const reports = await Database.getDB()
      .selectFrom('reports')
      .selectAll()
      .if(Boolean(search?.phrases), qb => search.phrases.reduce(
        (qb2, val) => qb2.where(
          qb3 => qb3
            .where('text', 'like', `%${val}%`)
            .orWhere('title', 'like', `%${val}%`)
        ), qb)
      )
      .if(Boolean(search?.hashtags), qb => search.hashtags.reduce(
        (qb2, val) => qb2.where('tags', 'like', `%${val}%`), qb)
      )
      .if(isBool(search?.isDiary), qb => qb.where('is_diary', '=', search.isDiary ? 1 : 0))
      .if(Boolean(search?.limit), qb => qb.limit(search.limit))
      .if(Boolean(search?.sorts), qb => search.sorts.reduce(
        (qb2, sort) => qb2.orderBy(sort[0], sort[1]), qb)
      )
      .execute()

    return reports.map(report => formatReport(report))
  }

  public static async get (reportId: number): Promise<Report> {
    // レポートの取得
    const report = await Database.getDB()
      .selectFrom('reports')
      .selectAll()
      .where('id', '=', reportId)
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
    const now = DateUtil.formatISO(new Date())

    // レポートを作成
    const parse = parseReport(form)
    const { insertId } = await Database.getDB()
      .insertInto('reports')
      .values({
        ...parse,
        created_at: now,
        updated_at: now,
      })
      .executeTakeFirst()

    // 関連タグを生成する
    await this._attachTags(parse)

    return await this.get(Number(insertId))
  }

  public static async update (reportId: number, form: FormReport): Promise<Report> {
    const now = DateUtil.formatISO(new Date())

    // レポートを更新
    const parse = parseReport(form)
    const { numUpdatedRows } = await Database.getDB()
      .updateTable('reports')
      .set({
        ...parse,
        updated_at: now,
      })
      .where('id', '=', reportId)
      .executeTakeFirst()

    if (Number(numUpdatedRows) === 0) {
      throw new Error('no result')
    }

    // 関連タグを生成する
    await this._attachTags(parse)

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

  ///

  protected static async _attachTags (parse: ReturnType<typeof parseReport>) {
    // タグ名リストから完全一致するタグを探す
    const tagNames = parse.tags ? parse.tags.split(' ') : []
    const dbTags = await TagAPI.getAll({
      names: tagNames,
    })

    // DB に存在していなければ新規作成
    for (const name of tagNames) {
      const exist = dbTags.find(tag => tag.name === name)
      if (!exist) {
        await TagAPI.create({ name })
      }
    }

    // NOTE: 削除は特にしていない
  }
}
