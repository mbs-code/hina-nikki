import { Ace } from 'ace-builds'
import { InjectionKey } from 'nuxt/dist/app/compat/capi'
import { ReportAPI } from '~~/src/apis/ReportAPI'
import { FormReport, Report } from '~~/src/databases/models/Report'

export const useEditorCtx = () => {
  const editor = ref<Ace.Editor>()

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

    // あっても無くても挿入
    const report = await ReportAPI.getByTitle(title)
    _attachReport(report)
  }

  const _attachReport = (report?: Report) => {
    selectedReport.value = report
    formReport.title = report?.title ?? formReport.title ?? undefined
    formReport.text = report?.text ?? ''
  }

  /// //////////
  /// イベント系

  const onSave = async () => {
    if (formReport.title) {
      const reportId = selectedReport.value?.id
      const resReport = reportId
        ? await ReportAPI.update(reportId, { ...formReport })
        : await ReportAPI.create({ ...formReport })
      _attachReport(resReport)
    }
  }

  ///

  const getSelectedText = () => {
    const text = editor.value.getSelectedText()
    window.alert(text)
  }

  return {
    editor,

    selectedReport, // 現在選択されているレポート
    formReport, // temp値
    isNew, // 新しい要素か
    isDirty, // 編集中か

    loadReport, // 今のクエリで検索する
    onSave, // 保存する

    getSelectedText,
  }
}

export type EditorCtx = ReturnType<typeof useEditorCtx>

export const EditorCtxKey: InjectionKey<EditorCtx> =
  (Symbol('EditorCtxKey'))
