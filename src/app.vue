<template>
  <n-config-provider :theme="darkTheme">
    <n-layout style="height: 100vh">
      <n-layout-header class="app-header" bordered>
        <Header :key="key" @click:config="openConfigDrawer" />
      </n-layout-header>

      <n-layout class="app-body" position="absolute" has-sider>
        <n-layout-sider
          width="306"
          content-style="padding: 0.5rem;"
          :native-scrollbar="false"
          bordered
        >
          <Sidebar :key="key" />
        </n-layout-sider>

        <n-layout content-style="height: 100%" :native-scrollbar="false">
          <NuxtPage :key="key" />
        </n-layout>
      </n-layout>

      <n-layout-footer class="app-footer" position="absolute" bordered>
        <Footer />
      </n-layout-footer>
    </n-layout>

    <ExploreModal v-model:show="showExploreModal" />
    <ConfigDrawer v-model:show="showConfigDrawer" />
  </n-config-provider>
</template>

<script setup lang="ts">
import { darkTheme } from 'naive-ui'
import { Database } from '~~/src/databases/Database'

// Database.trace = true
Database.debug = true

const key = ref<number>(Date.now())

// const onWipe = async () => {
//   await Database.dbWipe()
// }

///

const showExploreModal = ref<boolean>(false)
const openSearchModal = () => {
  showExploreModal.value = true
}

const showConfigDrawer = ref<boolean>(false)
const openConfigDrawer = () => {
  showConfigDrawer.value = true
}

const loadUiData = async () => {
  // お気に入りを読み込む
  await favoriteCtx.loadFavorites()
}

/// //////////

const editorCtx = useEditorCtx()
const loaderCtx = useLoaderCtx({ editorCtx, onSaved: loadUiData })
const explorerCtx = useExplorerCtx({ onSearched: openSearchModal })
const favoriteCtx = useFavoriteCtx()
const configStore = useConfigStore(editorCtx)

provide(EditorCtxKey, editorCtx)
provide(LoaderCtxKey, loaderCtx)
provide(ExplorerCtxKey, explorerCtx)
provide(FavoriteCtxKey, favoriteCtx)
provide(ConfigStoreKey, configStore)

/// //////////

onMounted(async () => {
  // load config
  await configStore.load()

  // DB migrate
  // TODO: 実行時にダイアログ
  const { migrator } = Database.getInstance()
  await migrator.migrateToLatest()

  // loading ui
  await loadUiData()
})
</script>

<style scoped lang="scss">
.app-header {
  height: 30px;
  padding: 0px 10px;
}

.app-body {
  top: 30px;
  bottom: 30px;
}

.app-footer {
  height: 30px;
  padding: 0px 10px;
}
</style>
