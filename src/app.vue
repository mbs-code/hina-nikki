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
import { useConfigStore } from '~~/src/stores/useConfigStore'

const configStore = useConfigStore()

/// //////////

const key = ref<number>(Date.now())

const theme = computed(() =>
  configStore.env.isDark ? darkTheme : lightTheme
)

///

const editorCtx = useEditorCtx()
const loaderCtx = useLoaderCtx(editorCtx)
const explorerCtx = useExplorerCtx()
const displayCtx = useDisplayCtx()

provide(EditorCtxKey, editorCtx)
provide(LoaderCtxKey, loaderCtx)
provide(ExplorerCtxKey, explorerCtx)
provide(DisplayCtxKey, displayCtx)
</script>
