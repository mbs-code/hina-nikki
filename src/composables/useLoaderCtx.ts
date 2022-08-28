import { InjectionKey } from 'nuxt/dist/app/compat/capi'
import { addDays } from 'date-fns'
import { EditorCtx } from '~~/src/composables/useEditorCtx'
import { DateUtil } from '~~/src/utils/DateUtil'
import { Report } from '~~/src/databases/models/Report'

export const useLoaderCtx = (editorCtx: EditorCtx) => {
  const _selectedDate = ref<Date>() // カレンダー日付
  const _selectedHashtag = ref<string>() // 選択しているタグ名

  const selectedTimestamp = computed(() => {
    return _selectedDate.value?.getTime() ?? null
  })

  const reportTitle = computed(() => {
    const date = _selectedDate.value
    if (date) { return DateUtil.formatDiaryTitle(date) }

    const tagName = _selectedHashtag.value
    if (tagName) { return tagName }

    return undefined
  })

  const formattedReportTitle = computed(() => {
    const date = _selectedDate.value
    if (date) { return DateUtil.formatDate(date) }

    const tagName = _selectedHashtag.value
    if (tagName) { return tagName }

    return undefined
  })

  ///

  // 日付で読み込む
  const loadByDate = async (date?: Date) => {
    _selectedDate.value = date
    _selectedHashtag.value = undefined

    await editorCtx.loadReport(reportTitle.value) // 読み込み
  }

  // ハッシュタグで読み込む
  const loadByHashtag = async (hashtag?: string) => {
    _selectedDate.value = undefined
    _selectedHashtag.value = hashtag

    await editorCtx.loadReport(reportTitle.value) // 読み込み
  }

  // レポートで読み込む
  const loadByReport = async (report: Report) => {
    // 振り分ける
    if (report.isDiary) {
      const date = DateUtil.parseByDiaryTitle(report.title)
      await loadByDate(date)
    } else {
      await loadByHashtag(report.title)
    }
  }

  ///

  // 日付の移動
  const onMoveDate = async (day: number) => {
    // 日付選択中なら加算、無ければ今日
    const date = _selectedDate.value
      ? addDays(_selectedDate.value, day)
      : new Date()

    await loadByDate(date)
  }

  // 今日へ移動
  const onMoveToday = async () => {
    await loadByDate(new Date())
  }

  const onClickHashtag = async () => {
    const hashTag = editorCtx.getActiveHashTag()
    if (hashTag) {
      await loadByHashtag(hashTag)
    }
  }

  return {
    selectedTimestamp,
    reportTitle,
    formattedReportTitle,

    loadByDate,
    loadByHashtag,
    loadByReport,

    onMoveDate,
    onMoveToday,
    onClickHashtag,
  }
}

export type LoaderCtx = ReturnType<typeof useLoaderCtx>

export const LoaderCtxKey: InjectionKey<LoaderCtx> =
  (Symbol('LoaderCtxKey'))
