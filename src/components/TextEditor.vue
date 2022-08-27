<template>
  <v-ace-editor
    v-model:value="editorCtx.formReport.text"
    class="editor"
    lang="markdown"
    theme="one_dark"
    :style="style"
    @init="onInit"
    @keydown.ctrl.s="editorCtx.onSave()"
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
