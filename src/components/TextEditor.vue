<template>
  <v-ace-editor
    v-model:value="editorCtx.content.value"
    class="editor"
    lang="markdown"
    theme="one_dark"
    :style="style"
    @init="onInit"
  />
</template>

<script setup lang="ts">
import { Ace } from 'ace-builds'
import { VAceEditor } from 'vue3-ace-editor'

import 'ace-builds/src-noconflict/mode-markdown'
import 'ace-builds/src-noconflict/theme-one_dark.js'

const editorCtx = inject(EditorCtxKey)

const style = computed(() => ({
  fontSize: editorCtx.fontSize.value + 'px'
}))

///

const onInit = (e: Ace.Editor) => {
  editorCtx.editor.value = e
}

</script>
