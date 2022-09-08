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
            @click="explorerStore.onSearchByHashtag(hashtag)"
          >
            <template #icon>
              <n-icon :component="PricetagOutline" />
            </template>
            {{ hashtag }}
          </n-button>
        </div>
      </n-scrollbar>

      <!-- タグウィジェットの展開スイッチ -->
      <n-switch v-model:value="configStore.env.editor.tagWidget" class="w-[120px]">
        <template #icon>
          <n-icon :component="Code" />
        </template>
      </n-switch>

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
      <TuiEditor />
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
  Code,
} from '@vicons/ionicons5'
import TagDropdownLabelIcon from '~~/src/components/editor/TagDropdownLabelIcon.vue'

const configStore = useConfigStore()
const loaderStore = useLoaderStore()
const editorStore = useEditorStore()
const explorerStore = useExplorerStore()
const displayStore = useDisplayStore()

// startup
onMounted(async () => {
  // エディタの更新
  await editorStore.onReload()

  // 何も表示していなければ、今日を表示する
  if (!loaderStore.isLoaded) {
    await loaderStore.onLoadByToday()
  }
})

/// ////////////////////
// 描画系

const title = computed(() => loaderStore.formReport?.title ?? '---')
const hashtags = computed(() => loaderStore.selectedReport?.tags ?? [])

const statucColor = computed(() => {
  switch (loaderStore.status) {
    case 'empty': return undefined
    case 'dirty': return 'warning'
    case 'new': return 'error'
    case 'none': return undefined
  }
})

const tagOptions = computed(() => {
  return displayStore.tags.map(tag => ({
    label: tag.name,
    key: tag.name,
    icon: () => h(TagDropdownLabelIcon, { color: tag.color }),
  }))
})

/// ////////////////////
// Toolbar アクション

const onTagSelect = (_val: string) => {
  // タグを選択したら、カーソル位置に挿入する
  editorStore.onInsertText(`[${_val}]`)
}

/// ////////////////////
// レポート詳細ダイアログ

const showMetaDialog = ref<boolean>(false)
const openMetaDialog = () => {
  showMetaDialog.value = true
}
</script>
