import { Database } from '~~/src/databases/Database'
import { FormReport, ReportWithTag } from '~~/src/databases/models/Report'

export class ReportAPI {
  public static async getAll (): Promise<ReportWithTag[]> {
    // レポートの取得
    const reports = await Database.getDB()
      .selectFrom('reports')
      .selectAll('reports')
      .execute()

    // 関連タグを取得
    const pageIds = Array.from(new Set(reports.map(page => page.id)))
    const tags = await Database.getDB()
      .selectFrom('tags')
      .selectAll()
      .where('report_id', 'in', pageIds)
      .execute()

    // レポートに紐づけていく
    const reportWithTags = reports.map((report) => {
      return {
        ...report,
        tags: tags
          .filter(t => t.report_id === report.id)
          .map(t => ({ ...t }))
      }
    })

    return reportWithTags
  }

  public static async get (pageId: number): Promise<ReportWithTag> {
    // レポートの取得
    const report = await Database.getDB()
      .selectFrom('reports')
      .selectAll()
      .where('id', '=', pageId)
      .executeTakeFirstOrThrow()

    // 関連タグを取得
    const tags = await Database.getDB()
      .selectFrom('tags')
      .selectAll()
      .where('report_id', 'in', pageId)
      .execute()

    // レポートに紐づけていく
    const reportWithTag = {
      ...report,
      tags: tags.map(tag => ({ ...tag }))
    }

    return reportWithTag
  }

  public static async create (form: FormReport): Promise<ReportWithTag> {
    // レポートを作成
    const now = new Date()
    const { insertId } = await Database.getDB()
      .insertInto('reports')
      .values({
        text: form.text,
        created_at: now,
        updated_at: now,
      })
      .executeTakeFirst()

    // TODO: タグを抽出して更新

    return await this.get(Number(insertId))
  }

  public static async update (reportId: number, form: FormReport): Promise<ReportWithTag> {
    // レポートを更新
    const now = new Date()
    const { numUpdatedRows } = await Database.getDB()
      .updateTable('reports')
      .set({
        title: form.title, // TODO: タイトルを変更することは無い？
        text: form.text,
        updated_at: now,
      })
      .where('id', '=', reportId)
      .executeTakeFirst()

    if (Number(numUpdatedRows) === 0) {
      throw new Error('no result')
    }

    // TODO: タグを抽出して更新

    return await this.get(Number(numUpdatedRows))
  }

  public static async remove (reportId: number): Promise<boolean> {
    // 関連するタグを消去
    await Database.getDB()
      .deleteFrom('tags')
      .where('report_id', '=', reportId)
      .executeTakeFirst()

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
