<template>
  <!-- NOTE: タイトル要素が無いバグ時は非表示にする -->
  <v-ace-editor
    v-if="editorCtx.formReport.title"
    v-model:value="editorCtx.formReport.text"
    class="editor"
    lang="markdown"
    theme="one_dark"
    :style="style"
    @init="onInit"
    @keydown.ctrl.s="editorCtx.onSave()"
    @keyup.alt.w="searchCtx.onMoveDate(-7)"
    @keyup.alt.a="searchCtx.onMoveDate(-1)"
    @keyup.alt.s="searchCtx.onMoveDate(7)"
    @keyup.alt.d="searchCtx.onMoveDate(1)"
    @keyup.alt.q="searchCtx.onMoveToday()"
  />

  <div v-else class="flex items-center justify-center">
    <n-empty
      size="huge"
      description="ノートを選択してください"
    >
      <template #extra>
        <n-button @click="searchCtx.onMoveToday()">
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
const searchCtx = inject(SearchCtxKey)

// TODO: 設定画面を作る
const options = {
  fontSize: 14,
  tabSize: 2,
}

const style = computed(() => ({
  fontSize: options.fontSize + 'px',
}))

const onInit = (e: Ace.Editor) => {
  editorCtx.editor.value = e
  editorCtx.editor.value.session.setTabSize(options.tabSize)
}
</script>
