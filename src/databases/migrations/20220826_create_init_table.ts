import { Kysely } from 'kysely'

export async function up (db: Kysely<unknown>): Promise<void> {
  await db.schema
    .createTable('pages')
    .addColumn('id', 'integer', col => col.primaryKey())
    .addColumn('title', 'text', col => col.notNull())
    .addColumn('text', 'text', col => col.notNull())
    .addColumn('created_at', 'datetime', col => col.notNull())
    .addColumn('updated_at', 'datetime', col => col.notNull())
    .execute()

  await db.schema
    .createTable('tags')
    .addColumn('id', 'integer', col => col.primaryKey())
    .addColumn('page_id', 'integer', col => col.notNull())
    .addColumn('name', 'text', col => col.notNull())
    .addColumn('created_at', 'datetime', col => col.notNull())
    .execute()
}

export async function down (db: Kysely<unknown>): Promise<void> {
  await db.schema.dropTable('tags').ifExists().execute()
  await db.schema.dropTable('pages').ifExists().execute()
}
