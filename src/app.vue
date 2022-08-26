<template>
  <div>
    <NuxtWelcome />
  </div>
</template>

<script setup lang="ts">
import { Database } from '~~/src/databases/Database'

onMounted(async () => {
  const { migrator } = Database.getInstance()
  await migrator.migrateToLatest()

  const { insertId } = await Database.getDB()
    .insertInto('pages')
    .values({
      title: '20220826',
      text: 'あいうえお\nかきくけこ',
      created_at: new Date(),
      updated_at: new Date()
    })
    .executeTakeFirst()
  console.log(insertId)

  const page = await Database.getDB()
    .selectFrom('pages')
    .selectAll()
    .where('id', '=', Number(insertId))
    .executeTakeFirstOrThrow()

  console.log(page)
})

</script>
