<template>
  <div class="h-full flex flex-col gap-2">
    <div class="flex items-center gap-2">
      <span>{{ editorCtx.formReport.title }}</span>

      <n-button @click="editorCtx.getSelectedText()">
        Get Selected Text
      </n-button>
    </div>

    <TextEditor class="grow" />
  </div>
</template>

<script setup lang="ts">
const editorCtx = inject(EditorCtxKey)
</script>
