<template>
  <n-config-provider :theme="theme">
    <n-dialog-provider>
      <n-message-provider>
        <NuxtLayout>
          <NuxtPage :key="key" />
        </NuxtLayout>
      </n-message-provider>
    </n-dialog-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import { darkTheme, lightTheme } from 'naive-ui'

const configStore = useConfigStore()

/// //////////

const key = ref<number>(Date.now())

const theme = computed(() =>
  configStore.env.isDark ? darkTheme : lightTheme
)
</script>
