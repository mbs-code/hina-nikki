import { Database } from '~~/src/databases/Database'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('app:created', async () => {
    // Database.debug = true

    // TODO: 実行時にバックアップと、ダイアログ表示？
    const { migrator } = Database.getInstance()
    await migrator.migrateToLatest()
  })
})
