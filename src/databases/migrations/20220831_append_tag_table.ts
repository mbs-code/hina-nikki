import { Kysely } from 'kysely'

export async function up (db: Kysely<unknown>): Promise<void> {
  await db.schema
    .createTable('tags')
    .addColumn('id', 'integer', col => col.primaryKey())
    .addColumn('name', 'text', col => col.notNull().unique())
    .addColumn('color', 'text')
    .addColumn('created_at', 'datetime', col => col.notNull())
    .addColumn('updated_at', 'datetime', col => col.notNull())
    .execute()
}

export async function down (db: Kysely<unknown>): Promise<void> {
  await db.schema.dropTable('tags').ifExists().execute()
}
