<template>
  <div class="h-full flex flex-col">
    <div class="p-2 flex items-center gap-2">
      <span>{{ editorCtx.formReport.title }}</span>

      <n-button
        v-for="(hashtag, _) of hashtags"
        :key="_"
        @click="onSearch(hashtag)"
      >
        {{ hashtag }}
      </n-button>

      <!-- <n-button @click="editorCtx.getSelectedText()">
        Get Selected Text
      </n-button> -->
    </div>

    <TextEditor class="grow" />
  </div>
</template>

<script setup lang="ts">
const loaderCtx = inject(LoaderCtxKey)
const editorCtx = inject(EditorCtxKey)
const searchCtx = inject(SearchCtxKey)

// startup
onMounted(async () => {
  // 今日を表示する
  await loaderCtx.onMoveToday()
})

const hashtags = computed(() => {
  return editorCtx.selectedReport.value?.tags ?? []
})

///

const onSearch = (hashtag: string) => {
  searchCtx.searchHashtag(hashtag)
}
</script>
