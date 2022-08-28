import { InjectionKey } from 'nuxt/dist/app/compat/capi'
import { ReportAPI } from '~~/src/apis/ReportAPI'
import { Report } from '~~/src/databases/models/Report'

export const useFavoriteCtx = () => {
  const hashtagReports = ref<Report[]>([])
  const recentReports = ref<Report[]>([])

  const loadFavorites = async () => {
    const hashes = await ReportAPI.getAll({
      isDiary: false,
      sorts: [['created_at', 'asc']],
    })
    hashtagReports.value = hashes

    const recents = await ReportAPI.getAll({
      sorts: [['updated_at', 'desc']],
      limit: 10,
    })
    recentReports.value = recents
  }

  return {
    hashtagReports,
    recentReports,

    loadFavorites,
  }
}

export type FavoriteCtx = ReturnType<typeof useFavoriteCtx>

export const FavoriteCtxKey: InjectionKey<FavoriteCtx> =
  (Symbol('FavoriteCtxKey'))
