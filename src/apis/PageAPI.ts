import { Database } from '~~/src/databases/Database'
import { FormPage, PageWithTag } from '~~/src/databases/models/Page'

export class PageAPI {
  public static async getAll (): Promise<PageWithTag[]> {
    // ページの取得
    const pages = await Database.getDB()
      .selectFrom('pages')
      .selectAll('pages')
      .execute()

    // 関連タグを取得
    const pageIds = Array.from(new Set(pages.map(page => page.id)))
    const tags = await Database.getDB()
      .selectFrom('tags')
      .selectAll()
      .where('page_id', 'in', pageIds)
      .execute()

    // ページに紐づけていく
    const pageWithTags = pages.map((page) => {
      return {
        ...page,
        tags: tags
          .filter(t => t.page_id === page.id)
          .map(t => ({ ...t }))
      }
    })

    return pageWithTags
  }

  public static async get (pageId: number): Promise<PageWithTag> {
    // ページの取得
    const page = await Database.getDB()
      .selectFrom('pages')
      .selectAll()
      .where('id', '=', pageId)
      .executeTakeFirstOrThrow()

    // 関連タグを取得
    const tags = await Database.getDB()
      .selectFrom('tags')
      .selectAll()
      .where('page_id', 'in', pageId)
      .execute()

    // ページに紐づけていく
    const pageWithTag = {
      ...page,
      tags: tags.map(tag => ({ ...tag }))
    }

    return pageWithTag
  }

  public static async create (form: FormPage): Promise<PageWithTag> {
    // ページを作成
    const now = new Date()
    const { insertId } = await Database.getDB()
      .insertInto('pages')
      .values({
        text: form.text,
        created_at: now,
        updated_at: now,
      })
      .executeTakeFirst()

    // TODO: タグを抽出して更新

    return await this.get(Number(insertId))
  }

  public static async update (pageId: number, form: FormPage): Promise<PageWithTag> {
    // ページを更新
    const now = new Date()
    const { numUpdatedRows } = await Database.getDB()
      .updateTable('pages')
      .set({
        title: form.title, // TODO: タイトルを変更することは無い？
        text: form.text,
        updated_at: now,
      })
      .where('id', '=', pageId)
      .executeTakeFirst()

    if (Number(numUpdatedRows) === 0) {
      throw new Error('no result')
    }

    // TODO: タグを抽出して更新

    return await this.get(Number(numUpdatedRows))
  }

  public static async remove (pageId: number): Promise<boolean> {
    // 関連するタグを消去
    await Database.getDB()
      .deleteFrom('tags')
      .where('page_id', '=', pageId)
      .executeTakeFirst()

    // ページを削除
    const { numDeletedRows } = await Database.getDB()
      .deleteFrom('pages')
      .where('id', '=', pageId)
      .executeTakeFirst()

    if (Number(numDeletedRows) === 0) {
      throw new Error('no result')
    }

    return true
  }
}
