import { defineStore } from 'pinia'
import { ReportAPI } from '~~/src/apis/ReportAPI'
import { Report } from '~~/src/databases/models/Report'

export const useExplorerStore = defineStore('explorer', () => {
  const searchText = ref<string>() // 検索ボックス
  const showSearchModal = ref<boolean>(false) // モーダル

  const _matchText = ref<string>()

  const _matchReport = ref<Report>() // 完全一致のレポート
  const _reports = ref<Report[]>([]) // 検索レポート配列

  /// ////////////////////
  // action

  const onSearch = async () => {
    // 初期化
    _matchText.value = undefined
    _matchReport.value = undefined
    _reports.value = []

    const phrases = (searchText.value ?? '').split(' ')

    // 完全一致を探す
    if (phrases.length === 1) {
      _matchText.value = phrases.at(0)
      _matchReport.value = await ReportAPI.getByTitle(phrases.at(0))
    }

    // 検索する
    const hashtagTexts = phrases.filter(phrase => phrase.startsWith('#'))
    const texts = phrases.filter(phrase => !phrase.startsWith('#'))

    _reports.value = await ReportAPI.getAll({
      phrases: texts,
      hashtags: hashtagTexts,
      sorts: [['updated_at', 'desc']]
    })

    // 検索モーダルを表示
    showSearchModal.value = true
  }

  const onSearchWithText = async (text: string) => {
    searchText.value = text
    await onSearch()
  }

  /// ////////////////////
  // モーダル

  return {
    searchText,
    showSearchModal,

    matchText: computed(() => _matchText.value),
    matchReport: computed(() => _matchReport.value),
    reports: computed(() => _reports.value),

    onSearch,
    onSearchWithText,
  }
})
