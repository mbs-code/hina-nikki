<template>
  <div class="h-full flex flex-col">
    <div class="flex items-center gap-2">
      <!-- タイトル -->
      <n-button
        size="large"
        quaternary
        :type="statucColor"
      >
        <!-- TODO: レポートダイアログを作成 -->
        <template #icon>
          <n-icon :component="Document" />
        </template>
        <span>{{ title }}</span>
      </n-button>

      <!-- ハッシュタグ -->
      <div class="flex flex-grow flex-wrap gap-2 p-1">
        <n-button
          v-for="(hashtag, _) of hashtags"
          :key="_"
          size="small"
          @click="onSearchHashtag(hashtag)"
        >
          <template #icon>
            <n-icon :component="PricetagOutline" />
          </template>
          {{ hashtag }}
        </n-button>
      </div>

      <!-- タグ選択セレクト -->
      <n-popselect
        :options="tagOptions"
        size="medium"
        scrollable
        @update:value="onTagSelect"
      >
        <n-button size="large">
          <template #icon>
            <n-icon :component="Pricetags" />
          </template>
          <n-icon :component="ChevronDown" />
        </n-button>
      </n-popselect>
    </div>

    <div class="flex-grow">
      <TextEditor />
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  Document,
  ChevronDown,
  PricetagOutline,
  Pricetags,
} from '@vicons/ionicons5'

const editorCtx = inject(EditorCtxKey)
const loaderCtx = inject(LoaderCtxKey)
const explorerCtx = inject(ExplorerCtxKey)
const displayCtx = inject(DisplayCtxKey)

// startup
onMounted(async () => {
  // 今日を表示する // TODO: ここ？
  await loaderCtx.loadByToday()
})

const title = computed(() => loaderCtx.formReport?.title ?? '---')
const hashtags = computed(() => loaderCtx.selectedReport.value?.tags ?? [])

const statucColor = computed(() => {
  // 優先度: 編集中 > 新規 > 保存済
  const isDarty = loaderCtx.isDirty.value
  if (isDarty) { return 'warning' }

  const isNew = loaderCtx.isNew.value
  return isNew ? 'error' : undefined
})

/// ////////////////////
// タグ アクション

const tagOptions = computed(() => {
  return displayCtx.tags.value.map(tag => ({
    label: tag.name,
    value: tag.name,
  }))
})

const onTagSelect = (val: string) => {
  // タグを選択したら、カーソル位置に挿入する
  editorCtx.insertHashtag(val)
}

/// ////////////////////
// Toolbar アクション

const onSearchHashtag = async (hashtag: string) => {
  await explorerCtx.onSearch({
    match: hashtag,
    hashtags: [hashtag],
  })
}
</script>
