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
  const isNew = editorCtx.isNew.value
  if (isNew) { return 'new' }

  const isDarty = editorCtx.isDirty.value
  return isDarty ? 'edit' : 'nochange'
})
</script>
