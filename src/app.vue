<template>
  <n-config-provider :theme="darkTheme">
    <n-layout style="height: 100vh">
      <n-layout-header class="app-header" bordered>
        最上部ヘッダ
        <button @click="onWipe">
          wipe
        </button>
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

    <SearchModal v-model:show="showSearchModal" />
  </n-config-provider>
</template>

<script setup lang="ts">
import { darkTheme } from 'naive-ui'
import { Database } from '~~/src/databases/Database'

// Database.trace = true
Database.debug = true

const key = ref<number>(Date.now())

const onWipe = async () => {
  await Database.dbWipe()
}

///

const showSearchModal = ref<boolean>(false)
const openSearchModal = () => {
  showSearchModal.value = true
}

const onUiInit = async () => {
  // お気に入りを読み込む
  await favoriteCtx.loadFavorites()
}

/// //////////

const editorCtx = useEditorCtx({ onSaved: onUiInit })
const loaderCtx = useLoaderCtx(editorCtx)
const searchCtx = useSearchCtx({ onSearched: openSearchModal })
const favoriteCtx = useFavoriteCtx()
const configStore = useConfigStore(editorCtx)

provide(EditorCtxKey, editorCtx)
provide(LoaderCtxKey, loaderCtx)
provide(SearchCtxKey, searchCtx)
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
  await onUiInit()
})
</script>

<style scoped lang="scss">
.app-header {
  height: 32px;
  padding: 4px;
}

.app-body {
  top: 32px;
  bottom: 32px;
}

.app-footer {
  height: 32px;
  padding: 4px;
}

</style>
