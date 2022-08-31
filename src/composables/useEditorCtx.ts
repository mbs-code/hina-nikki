import { Ace } from 'ace-builds'
import { InjectionKey } from 'nuxt/dist/app/compat/capi'
import { RegexUtil } from '~~/src/utils/RegexUtil'

export const useEditorCtx = () => {
  const _editor = ref<Ace.Editor>()

  /// //////////
  /// 設定型

  const bindEditor = (e: Ace.Editor) => {
    _editor.value = e
  }

  const setLineWrap = (value: boolean) => {
    _editor.value?.session?.setUseWrapMode(value)
  }

  const setPrintMargin = (value: boolean) => {
    _editor.value?.setShowPrintMargin(value)
  }

  const setTabSize = (value: number) => {
    _editor.value?.session?.setTabSize(value)
  }

  const insertText = (value: string) => {
    _editor.value?.insert(value)
  }

  const insertHashtag = (value: string) => {
    // 前方の文字を見てスペースを挿入する
    const pos = _editor.value.getCursorPosition()
    const activeLine = _editor.value.session.getDocument().getLine(pos.row)

    const t = activeLine.at(pos.column - 1)

    const text = (t && t !== ' ') ? ` ${value} ` : `${value} `
    insertText(text)
  }

  /// //////////
  /// イベント系

  const onFocus = () => {
    _editor.value?.focus() // フォーカス
  }

  // 現在のカーソルの場所のフレーズを取り出す（スペースまで）
  const getCursorPhrase = () => {
    const pos = _editor.value.getCursorPosition()
    const activeLine = _editor.value.session.getDocument().getLine(pos.row)

    // 前後のポインタをずらして、スペースまでを取り出す
    let st = pos.column
    while (st >= 0) {
      const t = activeLine.at(st)
      if (RegexUtil.hasSeparate(t)) { break }
      st--
    }

    let ed = pos.column
    while (ed < activeLine.length) {
      const t = activeLine.at(ed)
      if (RegexUtil.hasSeparate(t)) { break }
      ed++
    }

    return activeLine.substring(st + 1, ed)
  }

  return {
    bindEditor,

    setLineWrap,
    setPrintMargin,
    setTabSize,
    insertText,
    insertHashtag,

    onFocus,
    getCursorPhrase,
  }
}

export type EditorCtx = ReturnType<typeof useEditorCtx>

export const EditorCtxKey: InjectionKey<EditorCtx> =
  (Symbol('EditorCtxKey'))
