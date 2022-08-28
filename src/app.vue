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
  </n-config-provider>
</template>

<script setup lang="ts">
import { darkTheme } from 'naive-ui'
import { Database } from '~~/src/databases/Database'

Database.debug = true

const key = ref<number>(Date.now())

const editorCtx = useEditorCtx()
const loaderCtx = useLoaderCtx(editorCtx)
provide(EditorCtxKey, editorCtx)
provide(LoaderCtxKey, loaderCtx)

onMounted(async () => {
  // DB migrate
  const { migrator } = Database.getInstance()
  await migrator.migrateToLatest()
})

const onWipe = async () => {
  await Database.dbWipe()
}
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
