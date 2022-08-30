import { Ace } from 'ace-builds'
import { InjectionKey } from 'nuxt/dist/app/compat/capi'

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

  // const getActiveHashTag = () => {
  //   const pos = _editor.value.getCursorPosition()
  //   const activeLine = _editor.value.session.getDocument().getLine(pos.row)

  //   // 前後のポインタをずらして、スペースまでを取り出す
  //   let st = pos.column
  //   while (st >= 0) {
  //     const t = activeLine.at(st)
  //     if (RegexUtil.isSeparate(t)) { break }
  //     st--
  //   }

  //   let ed = pos.column
  //   while (ed < activeLine.length) {
  //     const t = activeLine.at(ed)
  //     if (RegexUtil.isSeparate(t)) { break }
  //     ed++
  //   }

  //   const activePhrase = activeLine.substring(st + 1, ed)
  //   return RegexUtil.isHashtag(activePhrase)
  //     ? activePhrase
  //     : undefined
  // }

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

    // getActiveHashTag,
    setLineWrap, // 折り返し設定
    setTabSize, // タブサイズ
  }
}

export type EditorCtx = ReturnType<typeof useEditorCtx>

export const EditorCtxKey: InjectionKey<EditorCtx> =
  (Symbol('EditorCtxKey'))
