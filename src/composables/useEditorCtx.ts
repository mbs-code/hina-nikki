import { Ace } from 'ace-builds'
import { InjectionKey } from 'nuxt/dist/app/compat/capi'
import { RegexUtil } from '~~/src/utils/RegexUtil'

export const useEditorCtx = () => {
  const _editor = ref<Ace.Editor>()

  const bindEditor = (e: Ace.Editor) => {
    _editor.value = e
  }

  /// //////////
  /// イベント系

  const onFocus = () => {
    _editor.value?.focus() // フォーカス
  }

  ///

  // const onClickHashtag = async () => {
  //   const hashTag = editorCtx.getActiveHashTag()
  //   if (hashTag) {
  //     await loadByHashtag(hashTag)
  //   }
  // }

  ///

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

  // TODO: config からの session 管理
  const setLineWrap = (value: boolean) => {
    _editor.value?.session?.setUseWrapMode(value)
  }

  const setTabSize = (value: number) => {
    _editor.value?.session?.setTabSize(value)
  }

  return {
    bindEditor, // バインド

    onFocus, // フォーカスを当てる

    getCursorPhrase, // カーソルの位置のフレーズを取り出す

    // getActiveHashTag,
    setLineWrap, // 折り返し設定
    setTabSize, // タブサイズ
  }
}

export type EditorCtx = ReturnType<typeof useEditorCtx>

export const EditorCtxKey: InjectionKey<EditorCtx> =
  (Symbol('EditorCtxKey'))
