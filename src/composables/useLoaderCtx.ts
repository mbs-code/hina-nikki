import { InjectionKey } from 'nuxt/dist/app/compat/capi'
import { addDays } from 'date-fns'
import { EditorCtx } from '~~/src/composables/useEditorCtx'
import { DateUtil } from '~~/src/utils/DateUtil'
import { FormReport, Report } from '~~/src/databases/models/Report'
import { ReportAPI } from '~~/src/apis/ReportAPI'
import { RegexUtil } from '~~/src/utils/RegexUtil'

export const useLoaderCtx = (
  { editorCtx, onSaved }: { editorCtx: EditorCtx, onSaved: () => void }
) => {
  const _loadedTitle = ref<string>() // 読み込んだ際のタイトル

  const selectedReport = ref<Report>() // 読み込んだノート
  const formReport = reactive<FormReport>({ // 現在のキャッシュ
    title: '',
    text: '', // editor bind
  })

  // date picker 用
  const loadedTitleDate = computed(() => {
    const title = _loadedTitle.value
    const isDiary = RegexUtil.isDiaryTitle(title)
    return isDiary ? new Date(title) : undefined
  })

  const isNew = computed(() => !selectedReport.value)

  // new なら本文があるか、それ以外は一致しているか
  const isDirty = computed(() => isNew.value
    ? Boolean(formReport.text)
    : selectedReport.value?.text !== formReport.text
  )

  /// /////////////
  /// 汎用関数

  const save = async () => {
    const reportId = selectedReport.value?.id

    // DB記録
    const report = reportId
      ? await ReportAPI.update(reportId, { ...formReport })
      : await ReportAPI.create({ ...formReport })
    selectedReport.value = report

    // 値のバインド
    init(report)
    onSaved()
  }

  const init = (report?: Report) => {
    formReport.title = report?.title ?? _loadedTitle.value
    formReport.text = report?.text ?? ''

    // フォーカス処理
    editorCtx.onFocus()
  }

  const resetTitle = () => {
    formReport.title = selectedReport.value?.title ?? _loadedTitle.value
  }

  /// /////////////
  /// load util

  // TODO: 自動保存

  // タイトル文字列で読み込む
  const loadByTitle = async (title?: string) => {
    // 今ページが汚い状態なら一度保存する
    // TODO: アラートか設定行き
    if (isDirty.value) { await save() }

    // データを持ってくる（nullable）
    const report = await ReportAPI.getByTitle(title)
    _loadedTitle.value = title
    selectedReport.value = report

    // 値のバインド
    init(report)
  }

  // 日付で読み込む
  const loadByDate = async (date?: Date) => {
    const title = DateUtil.formatDiaryTitle(date)
    await loadByTitle(title)
  }

  // レポートで読み込む
  const loadByReport = async (report?: Report) => {
    // TODO: 面倒なのでタイトルで共通化する
    const title = report?.title
    await loadByTitle(title)
  }

  // 今日の日記を読み込む
  const loadByToday = async () => {
    await loadByDate(new Date())
  }

  // 日付を移動して読み込む
  const loadByDateAndMove = async (day: number) => {
    // 日付選択中なら加算、無ければ今日
    const loaded = loadedTitleDate.value
    const date = loaded
      ? addDays(loaded, day)
      : new Date()

    await loadByDate(date)
  }

  return {
    loadedTitleDate,
    selectedReport,

    formReport,
    isNew,
    isDirty,

    save,
    init,
    resetTitle,

    loadByTitle,
    loadByDate,
    loadByReport,
    loadByToday,
    loadByDateAndMove,
  }
}

export type LoaderCtx = ReturnType<typeof useLoaderCtx>

export const LoaderCtxKey: InjectionKey<LoaderCtx> =
  (Symbol('LoaderCtxKey'))
