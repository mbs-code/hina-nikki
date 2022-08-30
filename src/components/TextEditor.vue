<template>
  <!-- NOTE: タイトル要素が無いバグ時は非表示にする -->
  <v-ace-editor
    v-if="loaderCtx.formReport.title"
    v-model:value="loaderCtx.formReport.text"
    class="h-full"
    lang="markdown"
    theme="one_dark"
    placeholder="空のノートです ..."
    :style="style"
    @init="onInit"
    @keydown.ctrl.s="loaderCtx.save()"
    @keyup.alt.w="loaderCtx.loadByDateAndMove(-7)"
    @keyup.alt.a="loaderCtx.loadByDateAndMove(-1)"
    @keyup.alt.s="loaderCtx.loadByDateAndMove(7)"
    @keyup.alt.d="loaderCtx.loadByDateAndMove(1)"
    @keyup.alt.q="loaderCtx.loadByToday()"
    @wheel.ctrl.passive="onEditorWheel"
    @click.alt="onClickPhrase"
  />

  <n-card v-else class="w-full h-full">
    <div class="h-full flex items-center justify-center">
      <n-empty
        size="huge"
        description="ノートを選択してください"
      >
        <template #extra>
          <n-button @click="loaderCtx.loadByToday()">
            今日のノート
          </n-button>
        </template>
      </n-empty>
    </div>
  </n-card>
</template>

<script setup lang="ts">
import { Ace } from 'ace-builds'
import { VAceEditor } from 'vue3-ace-editor'

import 'ace-builds/src-noconflict/mode-markdown'
import 'ace-builds/src-noconflict/theme-one_dark.js'
import { RegexUtil } from '~~/src/utils/RegexUtil'

const editorCtx = inject(EditorCtxKey)
const loaderCtx = inject(LoaderCtxKey)
const explorerCtx = inject(ExplorerCtxKey)
const configStore = inject(ConfigStoreKey)

const style = computed(() => ({
  fontSize: configStore.env.editor.fontSize + 'px',
}))

const onInit = (e: Ace.Editor) => {
  editorCtx.bindEditor(e)
}

const onEditorWheel = ({ deltaY }: WheelEvent) => {
  if (deltaY < 0) {
    configStore.env.editor.fontSize++
  } else if (deltaY > 0) {
    configStore.env.editor.fontSize = Math.max(
      configStore.env.editor.fontSize - 1,
      configStore.embed.minFontSize, // 最小値制限
    )
  }
}

const onClickPhrase = async () => {
  // 選択フレーズを取り出す
  const phrase = editorCtx.getCursorPhrase()

  // もしハッシュタグなら検索をかける
  if (RegexUtil.isHashtagTitle(phrase)) {
    await explorerCtx.onSearch({ phrase })
  }
}

// TODO: config のデータバインドは watch でやる、初回実行あり
</script>

<!-- <style scoped lang="scss">
.editor {
  ::v-deep(.ace_string.ace_strong) {
    color: red;
  }

  ::v-deep(.ace_markup.ace_list) {
    color: orange;
  }
}
</style> -->
