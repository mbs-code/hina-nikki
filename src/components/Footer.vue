<template>
  <div class="flex gap-2">
    <div>footer</div>

    <div class="grow" name="padding" />

    <div class="flex items-center gap-1">
      <span>{{ editorCtx.formReport.title ?? '' }}</span>

      <n-icon size="16">
        <Alert v-if="status === 'edit'" />
        <CheckmarkSharp v-if="status === 'nochange'" />
        <Remove v-if="status === 'new'" />
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

const editorCtx = inject(EditorCtxKey)

const status = computed(() => {
  // 優先度: 編集中 > 新規 > 保存済

  const isDarty = editorCtx.isDirty.value
  if (isDarty) { return 'edit' }

  const isNew = editorCtx.isNew.value
  return isNew ? 'new' : 'nochange'
})
</script>
