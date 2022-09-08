import { Database } from '~~/src/databases/Database'
import { DBTag, formatTag, FormTag, parseTag, Tag } from '~~/src/databases/models/Tag'
import { DateUtil } from '~~/src/utils/DateUtil'

export type SearchTag = {
  name?: string // 完全一致
  names?: string[] // 完全一致
  hasPinned?: boolean
  limit?: number
  sorts?: [keyof DBTag, 'asc' | 'desc'][]
}

export class TagAPI {
  public static async getAll (search?: SearchTag): Promise<Tag[]> {
    // タグの取得
    const tags = await Database.getDB()
      .selectFrom('tags')
      .selectAll()
      .if(Boolean(search?.name), qb => qb.where('name', '=', search.name))
      .if(Boolean(search?.names), qb => qb.where('name', 'in', search.names))
      .if(Boolean(search?.hasPinned), qb => qb.where('is_pinned', '=', 1))
      .if(Boolean(search?.limit), qb => qb.limit(search.limit))
      .if(Boolean(search?.sorts), qb => search.sorts.reduce(
        (qb2, sort) => qb2.orderBy(sort[0], sort[1]), qb)
      )
      .execute()

    return tags.map(tag => formatTag(tag))
  }

  public static async get (tagId: number): Promise<Tag> {
    // タグの取得
    const tag = await Database.getDB()
      .selectFrom('tags')
      .selectAll()
      .where('id', '=', tagId)
      .executeTakeFirstOrThrow()

    return formatTag(tag)
  }

  public static async create (form: FormTag): Promise<Tag> {
    const db = Database.getDB()

    const now = DateUtil.formatISO(new Date())
    const parse = parseTag(form)

    // 名前重複確認
    const { count } = await db
      .selectFrom('tags')
      .select([db.fn.count('id').as('count')])
      .where('name', '=', parse.name)
      .executeTakeFirst()
    if (count > 0) { throw new Error('名前が重複しています') }

    // タグを作成
    const { insertId } = await db
      .insertInto('tags')
      .values({
        ...parse,
        created_at: now,
        updated_at: now,
      })
      .executeTakeFirst()

    return await this.get(Number(insertId))
  }

  public static async update (tagId: number, form: FormTag): Promise<Tag> {
    const db = Database.getDB()

    const now = DateUtil.formatISO(new Date())
    const parse = parseTag(form)

    // 名前重複確認
    const { count } = await db
      .selectFrom('tags')
      .select([db.fn.count('id').as('count')])
      .where('name', '=', parse.name)
      .where('id', '<>', tagId)
      .executeTakeFirst()
    if (count > 0) { throw new Error('名前が重複しています') }

    // タグを更新
    const { numUpdatedRows } = await db
      .updateTable('tags')
      .set({
        ...parseTag(form),
        updated_at: now,
      })
      .where('id', '=', tagId)
      .executeTakeFirst()

    if (Number(numUpdatedRows) === 0) {
      throw new Error('no result')
    }

    return await this.get(Number(tagId))
  }

  public static async remove (tagId: number): Promise<boolean> {
    const db = Database.getDB()

    // タグを取ってくる
    const tag = await this.get(tagId)

    // レポートに使われているか確認する
    const { count } = await db
      .selectFrom('reports')
      .select([db.fn.count('id').as('count')])
      .where('tags', 'like', `%${tag.name}%`)
      .executeTakeFirst()
    if (count > 0) { throw new Error('このタグは使用中です') }

    // タグを削除
    const { numDeletedRows } = await db
      .deleteFrom('tags')
      .where('id', '=', tagId)
      .executeTakeFirst()

    if (Number(numDeletedRows) === 0) {
      throw new Error('no result')
    }

    return true
  }

  public static async count (): Promise<number> {
    const db = Database.getDB()

    // レポートの数を数える
    const { count } = await db
      .selectFrom('tags')
      .select([db.fn.count('id').as('count')])
      .executeTakeFirst()

    return Number(count)
  }
}
