<template>
  <n-config-provider :theme="theme">
    <n-dialog-provider>
      <n-layout style="height: 100vh">
        <n-layout-header class="app-header" bordered>
          <Header :key="key" @click:config="openConfigDrawer" />
        </n-layout-header>

        <n-layout class="app-body" position="absolute" has-sider>
          <n-layout-sider
            v-if="configStore.env.useSidebar"
            width="306"
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
    </n-dialog-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import { darkTheme, lightTheme } from 'naive-ui'

const key = ref<number>(Date.now())

const theme = computed(() =>
  configStore.env.isDark ? darkTheme : lightTheme
)

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
  // UI データを読み込み直す
  await displayCtx.load()
}

/// //////////

const editorCtx = useEditorCtx()
const loaderCtx = useLoaderCtx({ editorCtx, onSaved: loadUiData })
const explorerCtx = useExplorerCtx({ onSearched: openSearchModal })
const displayCtx = useDisplayCtx()
const configStore = useConfigStore()

provide(EditorCtxKey, editorCtx)
provide(LoaderCtxKey, loaderCtx)
provide(ExplorerCtxKey, explorerCtx)
provide(DisplayCtxKey, displayCtx)
provide(ConfigStoreKey, configStore)

/// //////////

onBeforeMount(async () => {
  // load config
  await configStore.load()

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
