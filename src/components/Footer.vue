<template>
  <div class="flex gap-2">
    <div>footer</div>

    <div class="grow" name="padding" />

    <div class="flex items-center gap-1">
      <span>{{ title }}</span>

      <n-icon size="16">
        <component :is="statusIcon" />
      </n-icon>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  Alert,
  CheckmarkSharp,
  Remove,
} from '@vicons/ionicons5'

const loaderCtx = inject(LoaderCtxKey)

const title = computed(() => loaderCtx.formReport?.title ?? '---')
const statusIcon = computed(() => {
  // 優先度: 編集中 > 新規 > 保存済
  const isDarty = loaderCtx.isDirty.value
  if (isDarty) { return Alert }

  const isNew = loaderCtx.isNew.value
  return isNew ? Remove : CheckmarkSharp
})
</script>
