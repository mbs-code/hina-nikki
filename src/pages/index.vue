<template>
  <div class="h-full flex flex-col">
    <div class="p-2 flex items-center gap-2">
      <div class="flex items-center gap-1" style="height: 28px">
        <n-icon size="16">
          <Document />
        </n-icon>

        <span>{{ title ?? '---' }}</span>
      </div>

      <n-button
        v-for="(hashtag, _) of hashtags"
        :key="_"
        size="small"
        @click="onSearch(hashtag)"
      >
        <template #icon>
          <n-icon><PricetagOutline /></n-icon>
        </template>
        {{ hashtag }}
      </n-button>
    </div>

    <TextEditor class="grow" />
  </div>
</template>

<script setup lang="ts">
import {
  PricetagOutline,
  Document,
} from '@vicons/ionicons5'

const loaderCtx = inject(LoaderCtxKey)
const editorCtx = inject(EditorCtxKey)
const searchCtx = inject(SearchCtxKey)

// startup
onMounted(async () => {
  // 今日を表示する
  await loaderCtx.onMoveToday()
})

const title = computed(() => {
  return loaderCtx.formattedReportTitle.value
})

const hashtags = computed(() => {
  const report = editorCtx.selectedReport.value
  const tags = report?.tags ?? []
  if (!report?.isDiary && report?.title) {
    tags.unshift(report?.title)
  }

  return tags
})

///

const onSearch = (hashtag: string) => {
  searchCtx.searchHashtag(hashtag)
}
</script>
