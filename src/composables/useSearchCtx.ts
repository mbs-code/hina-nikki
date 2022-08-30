import { InjectionKey } from 'nuxt/dist/app/compat/capi'
import { ReportAPI } from '~~/src/apis/ReportAPI'
import { Report } from '~~/src/databases/models/Report'
import { RegexUtil } from '~~/src/utils/RegexUtil'

export type SearchParams = {
  phrase?: string, // 本文検索（textboxバインド）
  hashtags?: string[], // ハッシュタグ検索
  match?: string, // 完全一致
}

export const useSearchCtx = (
  { onSearched }: { onSearched: () => void },
) => {
  const params = reactive<SearchParams>({})

  const matchReport = ref<Report>()
  const reports = ref<Report[]>([])

  const onSearch = async (p?: SearchParams) => {
    // 完全一致について、 match が空のとき、match がハッシュタグ要素なら代入する
    if (!p?.match && RegexUtil.isHashtagTitle(p?.phrase)) {
      p.match = p.phrase
    }

    // 初期化
    matchReport.value = undefined
    reports.value = []
    params.phrase = p.phrase
    params.hashtags = p.hashtags
    params.match = p.match

    // 完全一致を探す
    matchReport.value = await ReportAPI.getByTitle(params.match ?? params.phrase)

    // 検索する
    reports.value = await ReportAPI.getAll({
      phrases: params.phrase ? params.phrase.split(' ') : undefined, // TODO: 正規表現で置き換える
      hashtags: params.hashtags,
      sorts: [['updated_at', 'desc']]
    })

    onSearched()
  }

  return {
    matchReport,
    reports,

    params,
    onSearch,
  }
}

export type SearchCtx = ReturnType<typeof useSearchCtx>

export const SearchCtxKey: InjectionKey<SearchCtx> =
  (Symbol('SearchCtxKey'))
