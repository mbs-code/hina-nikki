<template>
  <!-- NOTE: タイトル要素が無いバグ時は非表示にする -->
  <v-ace-editor
    v-if="editorCtx.formReport.title"
    v-model:value="editorCtx.formReport.text"
    class="editor"
    lang="markdown"
    theme="one_dark"
    placeholder="空のノートです ..."
    :style="style"
    @init="onInit"
    @keydown.ctrl.s="editorCtx.onSave()"
    @keyup.alt.w="loaderCtx.onMoveDate(-7)"
    @keyup.alt.a="loaderCtx.onMoveDate(-1)"
    @keyup.alt.s="loaderCtx.onMoveDate(7)"
    @keyup.alt.d="loaderCtx.onMoveDate(1)"
    @keyup.alt.q="loaderCtx.onMoveToday()"
    @click.alt="loaderCtx.onClickHashtag()"
    @wheel.ctrl="onWheel"
  />

  <div v-else class="flex items-center justify-center">
    <n-empty
      size="huge"
      description="ノートを選択してください"
    >
      <template #extra>
        <n-button @click="loaderCtx.onMoveToday()">
          今日のノート
        </n-button>
      </template>
    </n-empty>
  </div>
</template>

<script setup lang="ts">
import { Ace } from 'ace-builds'
import { VAceEditor } from 'vue3-ace-editor'

import 'ace-builds/src-noconflict/mode-markdown'
import 'ace-builds/src-noconflict/theme-one_dark.js'

const editorCtx = inject(EditorCtxKey)
const loaderCtx = inject(LoaderCtxKey)
const configStore = inject(ConfigStoreKey)

const style = computed(() => ({
  fontSize: configStore.env.editor.fontSize + 'px',
}))

const onInit = (e: Ace.Editor) => {
  editorCtx.bindEditor(e)
}

const onWheel = ({ deltaY }: WheelEvent) => {
  if (deltaY < 0) {
    configStore.env.editor.fontSize++
  } else if (deltaY > 0) {
    configStore.env.editor.fontSize = Math.max(
      configStore.env.editor.fontSize - 1,
      configStore.embed.minFontSize, // 最小値制限
    )
  }
}
</script>
