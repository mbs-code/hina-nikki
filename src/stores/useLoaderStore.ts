import { addDays } from 'date-fns'
import { defineStore } from 'pinia'
import { ReportAPI } from '~~/src/apis/ReportAPI'
import { FormReport, Report } from '~~/src/databases/models/Report'
import { DateUtil } from '~~/src/utils/DateUtil'
import { RegexUtil } from '~~/src/utils/RegexUtil'

export type ReportStatus = 'empty' | 'dirty' | 'new' | 'none'

export const useLoaderStore = defineStore('loader', () => {
  const editorStore = useEditorStore()
  const displayStore = useDisplayStore()
  const appRouter = useAppRouter()

  const _loadedTitle = ref<string>() // 読み込んだ際のタイトル
  const _selectedReport = ref<Report>() // 読み込んだノート

  const formReport = reactive<FormReport>({ // 現在のキャッシュ
    title: '',
    text: '', // editor bind
  })

  /// ////////////////////
  // util

  // 読み込んでいるタイトルの日付要素
  const loadedTitleDate = computed(() => {
    const title = _loadedTitle.value
    const isDiary = RegexUtil.isDiaryTitle(title)
    return isDiary ? new Date(title) : undefined
  })

  // なにか読み込んでいるか
  const isLoaded = computed(() => Boolean(_loadedTitle.value))

  // DBに存在するか
  const isNew = computed(() => !_selectedReport.value)

  // new なら本文があるか、それ以外は本文が一致しているか
  const isDirty = computed(() => {
    if (!isLoaded) { return false }

    return isNew.value
      ? Boolean(formReport.text)
      : _selectedReport.value?.text !== formReport.text
  })

  const status = computed<ReportStatus>(() => {
    // 優先度: 読み込みなし > 編集中 > 新規 > 保存済
    if (!isLoaded) { return 'empty' }
    if (isDirty.value) { return 'dirty' }
    return isNew.value ? 'new' : 'none'
  })

  /// ////////////////////
  // action

  // レポートを読み込む
  const _onLoad = async (title: string) => {
    // 今ページが汚い状態なら一度保存する
    if (isLoaded.value && isDirty.value) { await onSave() }

    // データを持ってきてバインドする
    const report = await ReportAPI.getByTitle(title)
    _loadedTitle.value = title
    _selectedReport.value = report
    onReset()

    // エディタページであることを確認
    await appRouter.editor()
    // フォーカス処理
    editorStore.onFocus()
  }

  const onSave = async () => {
    const reportId = _selectedReport.value?.id

    // DB記録
    const report = reportId
      ? await ReportAPI.update(reportId, { ...formReport })
      : await ReportAPI.create({ ...formReport })
    _selectedReport.value = report
    onReset()

    // UIデータを読み込み直す
    await displayStore.onLoad()
  }

  const onReset = () => {
    const report = _selectedReport.value
    formReport.title = report?.title ?? _loadedTitle.value
    formReport.text = report?.text ?? ''
  }

  const onResetTitle = () => {
    const report = _selectedReport.value
    formReport.title = report?.title ?? _loadedTitle.value
  }

  const onClose = async (withSave = true) => {
    // 今ページが汚い状態なら一度保存する
    // TODO: アラートか設定行き
    if (withSave && isDirty.value) { await onSave() }

    _loadedTitle.value = undefined
    _selectedReport.value = undefined
    onReset()
  }

  /// ////////////////////
  // action util

  // タイトル文字列で読み込む
  const onLoadByTitle = async (title?: string) => {
    await _onLoad(title)
  }

  // レポートで読み込む
  const onLoadByReport = async (report?: Report) => {
    // NOTE: id ではなくタイトルで取ってくることに共通化
    const title = report?.title
    await _onLoad(title)
  }

  // 日付で読み込む
  const onLoadByDate = async (date?: Date) => {
    const title = DateUtil.formatDiaryTitle(date)
    await _onLoad(title)
  }

  // 今日の日記を読み込む
  const onLoadByToday = async () => {
    await onLoadByDate(new Date())
  }

  // 日付を移動して読み込む
  const onLoadByDateAndMove = async (day: number) => {
    // 日付選択中なら加算、無ければ今日
    const loaded = loadedTitleDate.value
    const date = loaded
      ? addDays(loaded, day)
      : new Date()

    await onLoadByDate(date)
  }

  // 自身の一つ前のレポートを読み込む
  const onLoadByPrevious = async () => {
    const selected = _selectedReport.value
    const reports = displayStore.recentReports

    if (selected) {
      // 選択中は一つ前を探す
      const index = reports.findIndex(r => r.id === selected.id)
      if (index >= 0) {
        const next = reports.at(index + 1)
        await onLoadByReport(next)
      }
    } else {
      // 選択が無い場合は、最新のやつ
      await onLoadByReport(reports.at(0))
    }
  }

  return {
    formReport,

    loadedTitle: computed(() => _loadedTitle.value),
    selectedReport: computed(() => _selectedReport.value),
    loadedTitleDate,
    isLoaded,
    isNew,
    isDirty,
    status,

    onSave,
    onReset,
    onResetTitle,
    onClose,

    onLoadByTitle,
    onLoadByReport,
    onLoadByDate,
    onLoadByToday,
    onLoadByDateAndMove,
    onLoadByPrevious,
  }
})
