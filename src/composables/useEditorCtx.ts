import { Editor } from '@toast-ui/editor'
import { InjectionKey } from 'nuxt/dist/app/compat/capi'
// import { Ace } from 'ace-builds'
// import { RegexUtil } from '~~/src/utils/RegexUtil'

// TODO: 整理中
export const useEditorCtx = () => {
  let _editor: Editor

  const bindEditor = (e: Editor) => {
    _editor = e
  }

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

  /// //////////
  /// イベント系

  const onFocus = () => {
    _editor.focus() // フォーカス
  }

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
  // }

  return {
    bindEditor,

    // setLineWrap,
    // setPrintMargin,
    // setTabSize,
    // insertText,
    // insertHashtag,

    onFocus,
    // getCursorPhrase,
  }
}

export type EditorCtx = ReturnType<typeof useEditorCtx>

export const EditorCtxKey: InjectionKey<EditorCtx> =
  (Symbol('EditorCtxKey'))
