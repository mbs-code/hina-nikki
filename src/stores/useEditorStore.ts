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

  return {
    bindEditor,
    unbindEditor,

    onFocus,
  }
})

/// //////////
/// 設定型

// const setLineWrap = (value: boolean) => {
//   _editor.value?.session?.setUseWrapMode(value)
// }

// const setPrintMargin = (value: boolean) => {
//   _editor.value?.setShowPrintMargin(value)
// }

// const setTabSize = (value: number) => {
//   _editor.value?.session?.setTabSize(value)
// }

// const insertText = (value: string) => {
//   _editor.value?.insert(value)
// }

// const insertHashtag = (value: string) => {
//   // 前方の文字を見てスペースを挿入する
//   const pos = _editor.value.getCursorPosition()
//   const activeLine = _editor.value.session.getDocument().getLine(pos.row)

//   const ptr = pos.column - 1
//   const t = activeLine.at(ptr)

//   const text = (ptr >= 0 && t && t !== ' ') ? ` ${value} ` : `${value} `
//   insertText(text)
// }

// // 現在のカーソルの場所のフレーズを取り出す（スペースまで）
// const getCursorPhrase = () => {
//   const pos = _editor.value.getCursorPosition()
//   const activeLine = _editor.value.session.getDocument().getLine(pos.row)

//   // 前後のポインタをずらして、スペースまでを取り出す
//   let st = pos.column
//   while (st >= 0) {
//     const t = activeLine.at(st)
//     if (RegexUtil.hasSeparate(t)) { break }
//     st--
//   }

//   let ed = pos.column
//   while (ed < activeLine.length) {
//     const t = activeLine.at(ed)
//     if (RegexUtil.hasSeparate(t)) { break }
//     ed++
//   }
//   return activeLine.substring(st + 1, ed)
//
