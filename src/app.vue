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

const key = ref<number>(Date.now())

const theme = computed(() =>
  configStore.env.isDark ? darkTheme : lightTheme
)

///

const configStore = useConfigStore()
provide(ConfigStoreKey, configStore)

/// //////////

onBeforeMount(async () => {
  // load config
  await configStore.load()

  // loading ui
  // await loadUiData()
})
</script>
