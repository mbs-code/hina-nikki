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
    <n-card class="absolute w-full h-full" style="top: 0; left: 0; z-index: -1">
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
import { useThemeVars } from 'naive-ui'

const configStore = useConfigStore()
const loaderStore = useLoaderStore()
const explorerStore = useExplorerStore()
const displayStore = useDisplayStore()
const editorStore = useEditorStore()
const themeVars = useThemeVars()

const editorRef = ref<HTMLDivElement>()
let editor: Editor

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

/// ////////////////////

const editorInit = async () => {
  if (editor) { editorDestroy() }
  await nextTick()

  // ウィジェット
  const widgetRules = []
  if (!configStore.env.editor.tagWidget) { widgetRules.push(tagWidget()) }

  editor = new Editor({
    el: editorRef.value,
    height: '100%',
    initialValue: text.value,
    placeholder: '空のノートです ...',
    initialEditType: 'markdown',
    hideModeSwitch: true, // TODO: zoom のせいで壊れる
    previewStyle: configStore.env.editor.splitPane ? 'vertical' : 'tab',
    language: 'ja-JP',
    theme: configStore.env.isDark ? 'dark' : 'light',
    useCommandShortcut: false,
    usageStatistics: false,
    widgetRules,
    events: {
      change: () => (text.value = editor.getMarkdown()),
    },
  })

  editorStore.bindEditor(editor)
}

const editorDestroy = () => {
  editorStore.unbindEditor()
  editor.destroy()
}

onMounted(() => editorInit())
onUnmounted(() => editorDestroy())

// テーマ変更時、エディタを作り直す
watch(() => configStore.env.isDark, () => editorInit())
// widget モードを切り替えるとき、エディタを作り直す
watch(() => configStore.env.editor.tagWidget, () => editorInit())
// splitView を切り替えたとき、エディタを作り直す
watch(() => configStore.env.editor.splitPane, () => editorInit())

///

const tagWidget = () => {
  // eslint-disable-next-line no-useless-escape
  const tagRegex = /\[(#[^\s\[\]]{1,15})\]/ // [#asdf]
  return {
    rule: tagRegex,
    toDOM (text: string) {
      const matched = text.match(tagRegex)

      const span = document.createElement('span')
      span.classList.add('widget-tag')
      span.innerText = matched[1]
      span.addEventListener('click', () => onClickTextTag(matched[1]))

      // 色探索
      const tag = displayStore.tags.find((tag) => tag.name === matched[1])
      span.style.backgroundColor = tag?.color || themeVars.value.tagColor

      return span
    },
  }
}

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
/// CSS埋め込み

const lineWrap = computed(() => {
  return configStore.env.editor.lineWrap ? 'break-spaces' : 'nowrap'
})

const liOddTextColor = computed(() => {
  return configStore.env.editor.paintListItem ? '#4b96e6' : 'inherit'
})

const liEvenTextColor = computed(() => {
  return configStore.env.editor.paintListItem ? '#ef6767' : 'inherit'
})

/// ////////////////////
/// イベント

const onClickTextTag = async (hashtag: string) => {
  await explorerStore.onSearchByHashtag(hashtag)
}

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
      word-break: break-all; // 常に折り返し
    }
  }

  // ビューワー
  ::v-deep(.toastui-editor-contents) {
    zoom: v-bind(zoom);
    word-break: break-all; // 常に折り返し
  }

  // widget タグ
  ::v-deep(.ProseMirror) {
    .widget-tag {
      cursor: pointer;
    }
  }
  ::v-deep(.widget-tag) {
    margin: 0px 2px;
    padding: 0px 5px;
    border-radius: 4px;

    white-space: nowrap;
  }

  // リスト要素の色つけ
  ::v-deep(.toastui-editor-md-list-item-odd) {
    ~ .toastui-editor-md-marked-text {
      color: v-bind(liOddTextColor);
    }
  }
  ::v-deep(.toastui-editor-md-list-item-even) {
    ~ .toastui-editor-md-marked-text {
      color: v-bind(liEvenTextColor);
    }
  }
}
</style>
