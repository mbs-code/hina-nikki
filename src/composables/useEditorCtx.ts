import { Ace } from 'ace-builds'
import { InjectionKey } from 'nuxt/dist/app/compat/capi'

const sample =
`# テスト

## こんにちは

- AAA
- BBB
- CCC

**asd**












`

export const useEditorCtx = () => {
  const editor = ref<Ace.Editor>()
  const content = ref<string>(sample)

  const fontSize = ref<number>(14)

  ///

  const getSelectedText = () => {
    const text = editor.value.getSelectedText()
    window.alert(text)
  }

  return {
    editor,
    content,
    fontSize,

    getSelectedText
  }
}

export const EditorCtxKey: InjectionKey<ReturnType<typeof useEditorCtx>> =
  (Symbol('EditorCtxKey'))
