import { Ace } from 'ace-builds'
import { InjectionKey } from 'nuxt/dist/app/compat/capi'
import { format as dateFormat, addDays } from 'date-fns'
import { ReportAPI } from '~~/src/apis/ReportAPI'
import { FormReport, Report } from '~~/src/databases/models/Report'

export const useEditorCtx = () => {
  const editor = ref<Ace.Editor>()
  const selectedDate = ref<Date>() // カレンダー日付

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

  const loadReport = async () => {
    // 今ページを開いていたら一度保存する
    // TODO: アラートか設定行き
    if (isDirty.value) { await onSave() }

    // タイトルを生成
    const title = selectedDate.value
      ? dateFormat(selectedDate.value, 'yyyyMMdd')
      : ''
    formReport.title = title

    const report = await ReportAPI.getByTitle(title)
    _attachReport(report)
  }

  const _attachReport = (report?: Report) => {
    selectedReport.value = report
    formReport.title = report?.title ?? formReport.title ?? ''
    formReport.text = report?.text ?? ''
  }

  // startup
  onMounted(async () => {
    selectedDate.value = new Date()
    await loadReport()
  })

  /// //////////
  /// イベント系

  const onSave = async () => {
    const reportId = selectedReport.value?.id
    const resReport = reportId
      ? await ReportAPI.update(reportId, { ...formReport })
      : await ReportAPI.create({ ...formReport })
    _attachReport(resReport)
  }

  const onMoveDate = async (day: number) => {
    const date = selectedDate.value ?? new Date()
    const prev = addDays(date, day)
    selectedDate.value = prev
    await loadReport()
  }

  ///

  const getSelectedText = () => {
    const text = editor.value.getSelectedText()
    window.alert(text)
  }

  return {
    editor,
    selectedDate,

    selectedReport, // 現在選択されているレポート
    formReport, // temp値
    isNew, // 新しい要素か
    isDirty, // 編集中か

    loadReport, // 今のクエリで検索する
    onSave, // 保存する
    onMoveDate, // 日付を移動する

    getSelectedText,
  }
}

export const EditorCtxKey: InjectionKey<ReturnType<typeof useEditorCtx>> =
  (Symbol('EditorCtxKey'))
