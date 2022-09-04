import { defineStore } from 'pinia'
import { ReportAPI } from '~~/src/apis/ReportAPI'
import { Report } from '~~/src/databases/models/Report'
import { RegexUtil } from '~~/src/utils/RegexUtil'

export type ExploreParams = {
  phrase?: string, // 本文検索（textboxバインド）
  hashtags?: string[], // ハッシュタグ検索
  match?: string, // 完全一致
}

export const useExplorerStore = defineStore('explorer', () => {
  const _params = reactive<ExploreParams>({})

  const _matchReport = ref<Report>() // 完全一致のレポート
  const _reports = ref<Report[]>([]) // 検索レポート配列

  /// ////////////////////
  // action

  const onSearch = async (params: ExploreParams) => {
    // 初期化
    _matchReport.value = undefined
    _reports.value = []

    _params.phrase = params.phrase
    _params.hashtags = params.hashtags
    _params.match = params.match
    searchText.value = params.phrase // 検索ボックス同期

    // 完全一致を探す
    _matchReport.value = await ReportAPI.getByTitle(_params.match ?? _params.phrase)

    // 検索する
    _reports.value = await ReportAPI.getAll({
      phrases: _params.phrase ? _params.phrase.split(RegexUtil.separateRegex) : undefined,
      hashtags: _params.hashtags,
      sorts: [['updated_at', 'desc']]
    })

    // 検索モーダルを表示
    showSearchModal.value = true
  }

  /// ////////////////////
  // action util

  // ハッシュタグで検索
  const onSearchByHashtag = async (hashtag: string) => {
    await onSearch({
      match: hashtag,
      hashtags: [hashtag],
    })
  }

  // 検索ボックスの値を使って検索
  const searchText = ref<string>() // 検索ボックス
  const onSearchText = async () => {
    // 単一要素なら完全一致にもする
    const text = searchText.value?.trim() ?? ''
    const isSinglePhrase = !RegexUtil.hasSeparate(text)

    await onSearch({
      phrase: text,
      match: isSinglePhrase ? text : undefined,
    })
  }

  /// ////////////////////
  // モーダル

  const showSearchModal = ref<boolean>(false) // モーダル

  return {
    params: _params,
    matchReport: computed(() => _matchReport.value),
    reports: computed(() => _reports.value),

    onSearch,
    onSearchByHashtag,
    onSearchText,

    searchText,
    showSearchModal,
  }
})
