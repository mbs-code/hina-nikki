<template>
  <div class="h-full flex flex-col gap-2">
    <div>
      <n-button @click="editorCtx.getSelectedText()">
        Get Selected Text
      </n-button>
    </div>

    <TextEditor class="grow" />
  </div>
</template>

<script setup lang="ts">
const editorCtx = useEditorCtx()
provide(EditorCtxKey, editorCtx)
</script>
