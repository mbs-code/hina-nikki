import { defineStore } from 'pinia'
import { ReportAPI } from '~~/src/apis/ReportAPI'
import { TagAPI } from '~~/src/apis/TagAPI'
import { Report } from '~~/src/databases/models/Report'
import { Tag } from '~~/src/databases/models/Tag'

export const useDisplayStore = defineStore('display', () => {
  const _recentReports = ref<Report[]>([]) // 最近の更新
  const _tags = ref<Tag[]>([]) // タグ一覧

  const onLoad = async () => {
    // 最近の更新を最新順に
    _recentReports.value = await ReportAPI.getAll({
      sorts: [['updated_at', 'desc']],
      limit: 10, // TODO: サイズ
    })

    // 一通りのタグ
    _tags.value = await TagAPI.getAll({
      sorts: [['updated_at', 'desc']],
      limit: 100, // TODO: 暫定
    })
  }

  return {
    recentReports: computed(() => _recentReports.value),
    tags: computed(() => _tags.value),

    onLoad,
  }
})
