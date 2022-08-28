import { InjectionKey } from 'nuxt/dist/app/compat/capi'
import { ReportAPI } from '~~/src/apis/ReportAPI'
import { Report } from '~~/src/databases/models/Report'

export const useSearchCtx = (openDialog: () => void) => {
  const matchReport = ref<Report>()
  const reports = ref<Report[]>([])

  const searchHashtag = async (hashtag: string) => {
    matchReport.value = await ReportAPI.getByTitle(hashtag)

    const items = await ReportAPI.getAll({
      hashtags: [hashtag],
      sorts: [['updated_at', 'desc']]
    })
    reports.value = items

    openDialog()
  }

  return {
    matchReport,
    reports,

    searchHashtag,
  }
}

export type SearchCtx = ReturnType<typeof useSearchCtx>

export const SearchCtxKey: InjectionKey<SearchCtx> =
  (Symbol('SearchCtxKey'))
