<template>
  <div class="h-full flex flex-col">
    <div class="p-2 flex items-center gap-2">
      <span>{{ editorCtx.formReport.title }}</span>

      <n-button @click="editorCtx.getSelectedText()">
        Get Selected Text
      </n-button>
    </div>

    <TextEditor class="grow" />
  </div>
</template>

<script setup lang="ts">
const loaderCtx = inject(LoaderCtxKey)
const editorCtx = inject(EditorCtxKey)

// startup
onMounted(async () => {
  // 今日を表示する
  await loaderCtx.onMoveToday()
})
</script>
