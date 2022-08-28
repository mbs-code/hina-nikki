import { Database } from '~~/src/databases/Database'
import { FormReport, Report } from '~~/src/databases/models/Report'

export type SearchReport = {
  text?: string // TODO: 暫定
  isDiary?: boolean
}

const isBool = (val: unknown) => typeof val === 'boolean'

export class ReportAPI {
  public static async getAll (search?: SearchReport): Promise<Report[]> {
    // レポートの取得
    const reports = await Database.getDB()
      .selectFrom('reports')
      .selectAll('reports')
      .if(Boolean(search?.text), qb => qb.where('text', 'like', `%${search.text}%`))
      .if(isBool(search?.isDiary), qb => qb.where('is_diary', '=', search.isDiary))
      .execute()

    return reports.map(report => this.formatReport(report))
  }

  public static async get (pageId: number): Promise<Report> {
    // レポートの取得
    const report = await Database.getDB()
      .selectFrom('reports')
      .selectAll()
      .where('id', '=', pageId)
      .executeTakeFirstOrThrow()

    return this.formatReport(report)
  }

  public static async getByTitle (pageTitle: string): Promise<Report | undefined> {
    // レポートの取得
    const report = await Database.getDB()
      .selectFrom('reports')
      .selectAll()
      .where('title', '=', pageTitle)
      .executeTakeFirst()

    if (!report) { return undefined }

    return this.formatReport(report)
  }

  public static async create (form: FormReport): Promise<Report> {
    // レポートを作成
    const now = new Date()
    const { insertId } = await Database.getDB()
      .insertInto('reports')
      .values({
        title: form.title,
        text: form.text,
        is_diary: this.extractIsDiary(form),
        tags: this.extractTags(form),
        created_at: now,
        updated_at: now,
      })
      .executeTakeFirst()

    return await this.get(Number(insertId))
  }

  public static async update (reportId: number, form: FormReport): Promise<Report> {
    // レポートを更新
    const now = new Date()
    const { numUpdatedRows } = await Database.getDB()
      .updateTable('reports')
      .set({
        title: form.title,
        text: form.text,
        is_diary: this.extractIsDiary(form),
        tags: this.extractTags(form),
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

  /// ////////////////////////////////////////////////////////////

  private static formatReport (report: Report): Report {
    // タグが文字列なので、配列に変換する
    const tags = report.tags as unknown as string
    return {
      ...report,
      tags: (tags ?? '').split(' ')
    }
  }

  private static extractIsDiary (form: FormReport): boolean {
    // yyyymmdd であるならば true
    return /^\d{8}$%/.test(form.title)
  }

  private static extractTags (form: FormReport): string[] {
    // ハッシュタグを抽出
    const hashes = (form.text ?? '')
      .split(/ |　|\r\n|\n/) // eslint-disable-line no-irregular-whitespace
      .filter(text => /^#\S+$/.test(text))

    return Array.from(new Set(hashes))
  }
}
