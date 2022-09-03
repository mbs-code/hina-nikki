import { Database } from '~~/src/databases/Database'
import { useConfigStore } from '~~/src/stores/useConfigStore'

export default defineNuxtPlugin(async (_nuxtApp) => {
  // load config
  const configStore = useConfigStore()
  await configStore.onLoad()

  // migrate db
  const { migrator } = Database.getInstance()
  await migrator.migrateToLatest()
})
