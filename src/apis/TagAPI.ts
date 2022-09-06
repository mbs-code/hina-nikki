import { Database } from '~~/src/databases/Database'
import { DBTag, formatTag, FormTag, parseTag, Tag } from '~~/src/databases/models/Tag'
import { DateUtil } from '~~/src/utils/DateUtil'

export type SearchTag = {
  names?: string[] // 完全一致
  limit?: number
  sorts?: [keyof DBTag, 'asc' | 'desc'][]
}

export class TagAPI {
  public static async getAll(search?: SearchTag): Promise<Tag[]> {
    // タグの取得
    const tags = await Database.getDB()
      .selectFrom('tags')
      .selectAll()
      .if(Boolean(search?.names), qb => qb.where('name', 'in', search.names))
      .if(Boolean(search?.limit), qb => qb.limit(search.limit))
      .if(Boolean(search?.sorts), qb => search.sorts.reduce(
        (qb2, sort) => qb2.orderBy(sort[0], sort[1]), qb)
      )
      .execute()

    return tags.map(tag => formatTag(tag))
  }

  public static async get(tagId: number): Promise<Tag> {
    // タグの取得
    const tag = await Database.getDB()
      .selectFrom('tags')
      .selectAll()
      .where('id', '=', tagId)
      .executeTakeFirstOrThrow()

    return formatTag(tag)
  }

  public static async create(form: FormTag): Promise<Tag> {
    const now = DateUtil.formatISO(new Date())

    // タグを作成
    const { insertId } = await Database.getDB()
      .insertInto('tags')
      .values({
        ...parseTag(form),
        created_at: now,
        updated_at: now,
      })
      .executeTakeFirst()

    return await this.get(Number(insertId))
  }

  public static async update(tagId: number, form: FormTag): Promise<Tag> {
    const now = DateUtil.formatISO(new Date())

    // タグを更新
    const { numUpdatedRows } = await Database.getDB()
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

  public static async remove(tagId: number): Promise<boolean> {
    // タグを取ってくる
    const tag = await this.get(tagId)

    // レポートに使われているか確認する
    const db = Database.getDB()
    const { count } = await db
      .selectFrom('reports')
      .select([db.fn.count('id').as('count')])
      .where('tags', 'like', `%${tag.name}%`)
      .executeTakeFirst()
    if (count > 0) { throw new Error('This tag in used.') }

    // タグを削除
    const { numDeletedRows } = await Database.getDB()
      .deleteFrom('tags')
      .where('id', '=', tagId)
      .executeTakeFirst()

    if (Number(numDeletedRows) === 0) {
      throw new Error('no result')
    }

    return true
  }

  public static async count(): Promise<number> {
    // レポートの数を数える
    const db = Database.getDB()
    const { count } = await db
      .selectFrom('tags')
      .select([db.fn.count('id').as('count')])
      .executeTakeFirst()

    return Number(count)
  }
}
