<template>
  <n-config-provider :theme="theme">
    <n-dialog-provider>
      <NuxtLayout>
        <NuxtPage :key="key" />
      </NuxtLayout>
    </n-dialog-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import { darkTheme, lightTheme } from 'naive-ui'
import { Database } from '~~/src/databases/Database'

const key = ref<number>(Date.now())

const theme = computed(() =>
  configStore.env.isDark ? darkTheme : lightTheme
)

///

const configStore = useConfigStore()
const editorCtx = useEditorCtx()
const loaderCtx = useLoaderCtx(editorCtx)
const explorerCtx = useExplorerCtx()
const displayCtx = useDisplayCtx()

provide(ConfigStoreKey, configStore)
provide(EditorCtxKey, editorCtx)
provide(LoaderCtxKey, loaderCtx)
provide(ExplorerCtxKey, explorerCtx)
provide(DisplayCtxKey, displayCtx)

onMounted(async () => {
  // load config
  await configStore.load()

  // migrate db
  const { migrator } = Database.getInstance()
  await migrator.migrateToLatest()
})
</script>
