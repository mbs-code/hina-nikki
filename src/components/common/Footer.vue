<template>
  <div class="h-full flex items-center gap-2">
    <!-- db stat -->
    <div class="flex items-center gap-1">
      <n-icon :component="DocumentsOutline" />
      {{ displayStore.reportCount?.toLocaleString() ?? '-' }}
    </div>

    <div class="flex items-center gap-1">
      <n-icon :component="PricetagsOutline" />
      {{ displayStore.tagCount?.toLocaleString() ?? '-' }}
    </div>

    <div class="flex-grow" name="padding" />

    <!-- page stat -->
    <div v-if="loaderStore.isLoaded" class="flex items-center gap-2">
      <span>{{ lines?.toLocaleString() ?? '-' }}行</span>
      <span>{{ count?.toLocaleString() ?? '-' }}文字</span>
    </div>

    <!-- 読み込みステータス -->
    <div class="flex items-center gap-1">
      <span>{{ title }}</span>

      <n-icon :component="statusIcon" />
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  Alert,
  CheckmarkSharp,
  Remove,
  DocumentsOutline,
  PricetagsOutline,
} from '@vicons/ionicons5'
import { TextUtil } from '~~/src/utils/TextUtil'

const loaderStore = useLoaderStore()
const displayStore = useDisplayStore()

const title = computed(() => loaderStore.formReport?.title ?? '---')

const count = computed(() => {
  const text = loaderStore.formReport.text
  return TextUtil.charCount(text)
})

const lines = computed(() => {
  const text = loaderStore.formReport.text
  return TextUtil.lineLength(text)
})

const statusIcon = computed(() => {
  switch (loaderStore.status) {
    case 'empty': return CheckmarkSharp
    case 'dirty': return Alert
    case 'new': return Remove
    case 'none': return CheckmarkSharp
  }
})
</script>
