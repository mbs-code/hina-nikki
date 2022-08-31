<template>
  <div class="h-full flex items-center gap-2">
    <div>Footer</div>

    <div class="flex-grow" name="padding" />

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
} from '@vicons/ionicons5'

const loaderCtx = inject(LoaderCtxKey)

const title = computed(() => loaderCtx.formReport?.title ?? '---')

const statusIcon = computed(() => {
  switch (loaderCtx.getStatus.value) {
    case 'dirty': return Alert
    case 'new': return Remove
    case 'none': return CheckmarkSharp
  }
})
</script>
