<template>
  <div>
    <n-layout style="height: 100vh">
      <n-layout-header style="height: 30px; padding: 0px 10px;" bordered>
        <Header @click:config="openConfigDrawer" />
      </n-layout-header>

      <n-layout style="top: 30px; bottom: 30px;" position="absolute" has-sider>
        <n-layout-sider
          v-if="configStore.env.useSidebar"
          width="306"
          :native-scrollbar="false"
          bordered
        >
          <Sidebar />
        </n-layout-sider>

        <n-layout content-style="height: 100%" :native-scrollbar="false">
          <slot />
        </n-layout>
      </n-layout>

      <n-layout-footer style="height: 30px; padding: 0px 10px;" position="absolute" bordered>
        <Footer />
      </n-layout-footer>

      <ExploreModal v-model:show="showExploreModal" />
      <ConfigDrawer v-model:show="showConfigDrawer" />
    </n-layout>
  </div>
</template>

<script setup lang="ts">
const configStore = useConfigStore()

/// //////////

const showExploreModal = ref<boolean>(false)
const openSearchModal = () => {
  showExploreModal.value = true
}

const showConfigDrawer = ref<boolean>(false)
const openConfigDrawer = () => {
  showConfigDrawer.value = true
}

/// //////////

const explorerCtx = inject(ExplorerCtxKey)
const displayCtx = inject(DisplayCtxKey)

const loadUiData = async () => {
  // UI データを読み込み直す
  await displayCtx.load()
}

onMounted(async () => {
  // イベント関数のバインド
  // loaderStore.bindOnSaved(loadUiData) // TODO: これloader に入れる
  explorerCtx.bindOnSearch(openSearchModal)

  // loading ui
  await loadUiData()
})
</script>
