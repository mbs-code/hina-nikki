import { Editor } from '@toast-ui/editor'
import { defineStore } from 'pinia'

export const useEditorStore = defineStore('editor', () => {
  let _editor: Editor

  const bindEditor = (e: Editor) => { _editor = e }
  const unbindEditor = () => { _editor = undefined }

  /// //////////
  /// actions

  const onFocus = () => {
    // エディタの読み込み待機
    const id = setInterval(() => {
      if (_editor && _editor?.focus) {
        _editor?.focus() // フォーカス
        clearInterval(id)
      }
    }, 100)
    setTimeout(() => clearInterval(id), 2000)
  }

  const onInsertText = (text: string) => {
    _editor.insertText(text)
  }

  return {
    bindEditor,
    unbindEditor,

    onFocus,
    onInsertText,
  }
})
