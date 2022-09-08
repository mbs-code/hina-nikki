import { Kysely } from 'kysely'

export async function up (db: Kysely<unknown>): Promise<void> {
  await db.schema.alterTable('tags').addColumn('is_pinned', 'integer', col => col.notNull().defaultTo(0)).execute()
  await db.schema.alterTable('tags').addColumn('order', 'integer', col => col.notNull().defaultTo(0)).execute()
}

export async function down (db: Kysely<unknown>): Promise<void> {
  await db.schema.alterTable('tags').dropColumn('order').execute()
  await db.schema.alterTable('tags').dropColumn('is_pinned').execute()
}
