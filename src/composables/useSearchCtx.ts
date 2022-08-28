import { InjectionKey } from 'nuxt/dist/app/compat/capi'
import { format as dateFormat, addDays } from 'date-fns'
import { EditorCtx } from '~~/src/composables/useEditorCtx'

export const useSearchCtx = (editorCtx: EditorCtx) => {
  const _selectedDate = ref<Date>() // カレンダー日付
  const _selectedTagName = ref<string>() // 選択しているタグ名

  const selectedTimestamp = computed(() => {
    return _selectedDate.value?.getTime() ?? null
  })

  const reportTitle = computed(() => {
    const date = _selectedDate.value
    if (date) { return dateFormat(date, 'yyyyMMdd') }

    const tagName = _selectedTagName.value
    if (tagName) { return tagName }

    return undefined
  })

  ///

  // 日付で読み込む
  const loadDate = async (date?: Date) => {
    _selectedDate.value = date
    _selectedTagName.value = undefined

    await editorCtx.loadReport(reportTitle.value) // 読み込み
  }

  // タグ名で読み込む
  const loadTagName = async (name?: string) => {
    _selectedDate.value = undefined
    _selectedTagName.value = name

    await editorCtx.loadReport(reportTitle.value) // 読み込み
  }

  ///

  // 日付の移動
  const onMoveDate = async (day: number) => {
    // 日付選択中なら加算、無ければ今日
    const date = _selectedDate.value
      ? addDays(_selectedDate.value, day)
      : new Date()

    await loadDate(date)
  }

  // 今日へ移動
  const onMoveToday = async () => {
    await loadDate(new Date())
  }

  return {
    selectedTimestamp,

    reportTitle,

    loadDate,
    loadTagName,

    onMoveDate,
    onMoveToday,
  }
}

export type SearchCtx = ReturnType<typeof useSearchCtx>

export const SearchCtxKey: InjectionKey<SearchCtx> =
  (Symbol('SearchCtxKey'))
