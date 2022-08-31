<template>
  <div class="h-full flex flex-col">
    <div class="flex items-center gap-2">
      <!-- タイトル -->
      <n-button
        size="large"
        quaternary
        :type="statucColor"
        @click="openMetaDialog"
      >
        <!-- TODO: レポートダイアログを作成 -->
        <template #icon>
          <n-icon :component="Document" />
        </template>
        <span>{{ title }}</span>
      </n-button>

      <!-- ハッシュタグ -->
      <n-scrollbar x-scrollable>
        <div class="flex flex-grow shrink gap-2 mt-1.5">
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
      </n-scrollbar>

      <!-- タグ選択セレクト -->
      <n-dropdown trigger="hover" :options="tagOptions" @select="onTagSelect">
        <n-button size="large">
          <template #icon>
            <n-icon :component="Pricetags" />
          </template>
          <n-icon :component="ChevronDown" />
        </n-button>
      </n-dropdown>
    </div>

    <div class="flex-grow">
      <TextEditor />
    </div>

    <ReportMetaModal v-model:show="showMetaDialog" />
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
  switch (loaderCtx.getStatus.value) {
    case 'dirty': return 'warning'
    case 'new': return 'error'
    case 'none': return undefined
  }
})

const tagOptions = computed(() => {
  return displayCtx.tags.value.map(tag => ({
    label: tag.name,
    key: tag.name,
  }))
})

/// ////////////////////
// Toolbar アクション

const onTagSelect = (val: string) => {
  // タグを選択したら、カーソル位置に挿入する
  editorCtx.insertHashtag(val)
  editorCtx.onFocus()
}

const onSearchHashtag = async (hashtag: string) => {
  await explorerCtx.onSearch({
    match: hashtag,
    hashtags: [hashtag],
  })
}

/// ////////////////////
// ダイアログ

const showMetaDialog = ref<boolean>(false)
const openMetaDialog = () => {
  showMetaDialog.value = true
}
</script>
