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
    @keyup.ctrl.s="editorCtx.onSave()"
    @keyup.alt.shift.w="editorCtx.onMoveDate(-7)"
    @keyup.alt.shift.a="editorCtx.onMoveDate(-1)"
    @keyup.alt.shift.s="editorCtx.onMoveDate(7)"
    @keyup.alt.shift.d="editorCtx.onMoveDate(1)"
  />
</template>

<script setup lang="ts">
import { Ace } from 'ace-builds'
import { VAceEditor } from 'vue3-ace-editor'

import 'ace-builds/src-noconflict/mode-markdown'
import 'ace-builds/src-noconflict/theme-one_dark.js'

const editorCtx = inject(EditorCtxKey)

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
