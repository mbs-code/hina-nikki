<template>
  <div>
    <n-layout style="height: 100vh">
      <n-layout-header style="height: 30px; padding: 0px 10px;" bordered>
        <Header @click:config="openConfigDrawer" />
      </n-layout-header>

      <n-layout style="top: 30px; bottom: 30px;" position="absolute" has-sider>
        <n-layout-sider
          v-if="configStore.env.useSidebar"
          width="281"
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

      <ExploreModal v-model:show="explorerStore.showSearchModal" />
      <ConfigDrawer v-model:show="showConfigDrawer" />
    </n-layout>
  </div>
</template>

<script setup lang="ts">
import { useExplorerStore } from '~~/src/stores/useExplorerStore'

const configStore = useConfigStore()
const explorerStore = useExplorerStore()

/// //////////

const showConfigDrawer = ref<boolean>(false)
const openConfigDrawer = () => {
  showConfigDrawer.value = true
}
</script>
