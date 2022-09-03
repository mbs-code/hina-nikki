<template>
  <div class="h-full">
    <div
      v-show="loaderStore.isLoaded"
      ref="editorRef"
      class="tui-editor relative"
      @keydown.ctrl.s="loaderStore.onSave()"
      @wheel.ctrl.passive="onZoom"
    />

    <!-- 何も読み込んでいない場合(背景に描画) -->
    <n-card class="absolute w-full h-full">
      <div class="h-full flex items-center justify-center">
        <n-empty
          size="huge"
          description="ノートを選択してください"
        >
          <template #extra>
            <n-button @click="loaderStore.onLoadByToday()">
              今日のノート
            </n-button>
          </template>
        </n-empty>
      </div>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { Editor } from '@toast-ui/editor'
import '@/assets/toastui.scss'
import '@toast-ui/editor/dist/i18n/ja-jp'

const configStore = useConfigStore()
const loaderStore = useLoaderStore()

const editorRef = ref<HTMLDivElement>()
let editor: Editor

const editorCtx = inject(EditorCtxKey)

const text = computed({
  get: () => loaderStore.formReport.text ?? '',
  set: (value: string) => (loaderStore.formReport.text = value),
})

// 外部から値の挿入があった場合の処理
watch(text, () => {
  const now = editor.getMarkdown()
  if (text.value !== now) {
    editor.setMarkdown(text.value, true)
  }
})

// テーマ変更時、エディタを作り直す
watch(() => configStore.env.isDark, () => {
  editorInit()
})

const editorInit = () => {
  if (editor) { editor.destroy() }

  editor = new Editor({
    el: editorRef.value,
    height: '100%',
    initialValue: text.value,
    placeholder: '空のノートです ...',
    initialEditType: 'markdown',
    previewStyle: 'vertical', // v / h
    language: 'ja-JP',
    theme: configStore.env.isDark ? 'dark' : 'light',
    useCommandShortcut: false,
    usageStatistics: false,
    events: {
      change: () => (text.value = editor.getMarkdown())
    },
  })

  editorCtx.bindEditor(editor)
}

onMounted(() => editorInit())
onUnmounted(() => editor.destroy())

/// ////////////////////
/// ズーム関係

const zoom = computed({
  get: () => configStore.env.editor.zoom,
  set: (val: number) => {
    // 最小値制限
    if (val < configStore.embed.minZoomSize) {
      val = configStore.embed.minZoomSize
    }
    // 最大値制限
    if (configStore.embed.maxZoomSize < val) {
      val = configStore.embed.maxZoomSize
    }
    // 第一位で代入
    configStore.env.editor.zoom = Math.round(val * 10) / 10
  }
})

const onZoom = ({ deltaY }: WheelEvent) => {
  if (deltaY < 0) {
    zoom.value += 0.1
  } else if (deltaY > 0) {
    zoom.value -= 0.1
  }
}

/// ////////////////////
/// その他設定

const lineWrap = computed(() => {
  return configStore.env.editor.lineWrap ? 'break-spaces' : 'nowrap'
})

// /// ////////////////////
// /// イベント
// TODO: タグ追加機能
// const onClickPhrase = async () => {
//   // 選択フレーズを取り出す
//   const phrase = editorCtx.getCursorPhrase()

//   // もしハッシュタグなら検索をかける
//   if (RegexUtil.isHashtagTitle(phrase)) {
//     await explorerCtx.onSearch({ phrase })
//   }
// }
</script>

<style scoped lang="scss">
.tui-editor {
  // // 全体
  ::v-deep(.toastui-editor-defaultUI) {
    border: none;
  }

  // エディタ本体
  ::v-deep(.ProseMirror) {
    height: 100%;
    padding: 1em;
    overflow-x: scroll;

    div {
      zoom: v-bind(zoom);
      white-space: v-bind(lineWrap);
    }
  }

  // ビューワー
  ::v-deep(.toastui-editor-contents) {
    zoom: v-bind(zoom);
  }
}
</style>
