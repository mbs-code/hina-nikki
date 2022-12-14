import { Kysely } from 'kysely'

export async function up (db: Kysely<unknown>): Promise<void> {
  await db.schema
    .createTable('reports')
    .addColumn('id', 'integer', col => col.primaryKey())
    .addColumn('title', 'text', col => col.notNull().unique())
    .addColumn('text', 'text', col => col.notNull())
    .addColumn('is_diary', 'integer', col => col.notNull().defaultTo(0))
    .addColumn('is_hashtag', 'integer', col => col.notNull().defaultTo(0))
    .addColumn('tags', 'text')
    .addColumn('created_at', 'datetime', col => col.notNull())
    .addColumn('updated_at', 'datetime', col => col.notNull())
    .execute()
}

export async function down (db: Kysely<unknown>): Promise<void> {
  await db.schema.dropTable('reports').ifExists().execute()
}
