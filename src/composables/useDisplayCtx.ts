import { InjectionKey } from 'nuxt/dist/app/compat/capi'
import { ReportAPI } from '~~/src/apis/ReportAPI'
import { TagAPI } from '~~/src/apis/TagAPI'
import { Report } from '~~/src/databases/models/Report'
import { Tag } from '~~/src/databases/models/Tag'

export const useDisplayCtx = () => {
  const recentReports = ref<Report[]>([])
  const tags = ref<Tag[]>([])

  const load = async () => {
    // 最近の更新を最新順に
    recentReports.value = await ReportAPI.getAll({
      sorts: [['updated_at', 'desc']],
      limit: 10, // TODO: サイズ
    })

    // 一通りのタグ
    tags.value = await TagAPI.getAll({
      sorts: [['updated_at', 'desc']],
      limit: 100, // TODO: 暫定
    })
  }

  return {
    recentReports, // 最近の更新
    tags, // タグ一覧

    load,
  }
}

export type DisplayCtx = ReturnType<typeof useDisplayCtx>

export const DisplayCtxKey: InjectionKey<DisplayCtx> =
  (Symbol('DisplayCtxKey'))
