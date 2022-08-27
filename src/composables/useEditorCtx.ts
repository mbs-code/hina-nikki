import { Ace } from 'ace-builds'
import { InjectionKey } from 'nuxt/dist/app/compat/capi'
import { format as dateFormat } from 'date-fns'
import { ReportAPI } from '~~/src/apis/ReportAPI'
import { FormReport, Report } from '~~/src/databases/models/Report'

export const useEditorCtx = () => {
  const editor = ref<Ace.Editor>()
  const fontSize = ref<number>(14)
  const selectedDate = ref<Date>() // カレンダー日付

  /// //////////
  /// データ更新系

  const _selectedReport = ref<Report>()
  const formReport = reactive<FormReport>({
    title: '',
    text: '',
  })

  const loadReport = async () => {
    const title = selectedDate.value
      ? dateFormat(selectedDate.value, 'yyyyMMdd')
      : ''

    const report = await ReportAPI.getByTitle(title)
    _attachReport(report)
  }

  const _attachReport = (report?: Report) => {
    _selectedReport.value = report
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
    const id = _selectedReport.value?.id
    const resReport = id
      ? await ReportAPI.update(id, { ...formReport })
      : await ReportAPI.create({ ...formReport })
    _attachReport(resReport)
  }

  const getSelectedText = () => {
    const text = editor.value.getSelectedText()
    window.alert(text)
  }

  return {
    editor,
    fontSize,
    selectedDate,

    formReport, // 現在選択されているレポート
    loadReport,

    onSave,
    getSelectedText,
  }
}

export const EditorCtxKey: InjectionKey<ReturnType<typeof useEditorCtx>> =
  (Symbol('EditorCtxKey'))
