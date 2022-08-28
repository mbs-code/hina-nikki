import { Ace } from 'ace-builds'
import { InjectionKey } from 'nuxt/dist/app/compat/capi'
import { ReportAPI } from '~~/src/apis/ReportAPI'
import { FormReport, Report } from '~~/src/databases/models/Report'
import { RegexUtil } from '~~/src/utils/RegexUtil'

export const useEditorCtx = () => {
  const _editor = ref<Ace.Editor>()

  const bindEditor = (e: Ace.Editor) => (_editor.value = e)

  /// //////////
  /// データ更新系

  const selectedReport = ref<Report>()
  const formReport = reactive<FormReport>({
    title: '',
    text: '',
  })

  const isNew = computed(() => !selectedReport.value)

  const isDirty = computed(() => isNew.value
    ? Boolean(formReport.text)
    : selectedReport.value?.text !== formReport.text
  )

  const loadReport = async (title?: string) => {
    // 今ページを開いていたら一度保存する
    // TODO: アラートか設定行き
    if (isDirty.value) { await onSave() }

    // タイトルを記入
    formReport.title = title

    // あっても無くても持ってくる
    const report = await ReportAPI.getByTitle(title)
    _attachReport(report)
  }

  const _attachReport = (report?: Report) => {
    selectedReport.value = report
    formReport.title = report?.title ?? formReport.title ?? undefined
    formReport.text = report?.text ?? ''

    _editor.value?.focus() // フォーカス
  }

  /// //////////
  /// イベント系

  const onSave = async () => {
    const reportId = selectedReport.value?.id

    // タイトル必須
    if (!formReport.title) { return }
    // 新規作成時、本文必須
    if (!reportId && !formReport.text) { return }

    const resReport = reportId
      ? await ReportAPI.update(reportId, { ...formReport })
      : await ReportAPI.create({ ...formReport })
    _attachReport(resReport)
  }

  ///

  const getActiveHashTag = () => {
    const pos = _editor.value.getCursorPosition()
    const activeLine = _editor.value.session.getDocument().getLine(pos.row)

    // 前後のポインタをずらして、スペースまでを取り出す
    let st = pos.column
    while (st >= 0) {
      const t = activeLine.at(st)
      if (RegexUtil.isSeparate(t)) { break }
      st--
    }

    let ed = pos.column
    while (ed < activeLine.length) {
      const t = activeLine.at(ed)
      if (RegexUtil.isSeparate(t)) { break }
      ed++
    }

    const activePhrase = activeLine.substring(st + 1, ed)
    return RegexUtil.isHashtag(activePhrase)
      ? activePhrase
      : undefined
  }

  return {
    bindEditor, // バインド

    selectedReport, // 現在選択されているレポート
    formReport, // temp値
    isNew, // 新しい要素か
    isDirty, // 編集中か

    loadReport, // 今のクエリで検索する
    onSave, // 保存する

    getActiveHashTag,
  }
}

export type EditorCtx = ReturnType<typeof useEditorCtx>

export const EditorCtxKey: InjectionKey<EditorCtx> =
  (Symbol('EditorCtxKey'))
