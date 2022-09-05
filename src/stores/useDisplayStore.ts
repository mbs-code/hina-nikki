import { defineStore } from 'pinia'
import { ReportAPI } from '~~/src/apis/ReportAPI'
import { TagAPI } from '~~/src/apis/TagAPI'
import { Report } from '~~/src/databases/models/Report'
import { Tag } from '~~/src/databases/models/Tag'

export const useDisplayStore = defineStore('display', () => {
  const configStore = useConfigStore()
  const calendarStore = useCalendarStore()

  const _recentReports = ref<Report[]>([]) // 最近の更新
  const _tags = ref<Tag[]>([]) // タグ一覧

  const _reportCount = ref<number>(0)
  const _tagCount = ref<number>(0)

  const onLoad = async () => {
    // 最近の更新を最新順に
    _recentReports.value = await ReportAPI.getAll({
      sorts: [['updated_at', 'desc']],
      limit: configStore.env.latestReportNum,
    })

    // 一通りのタグ
    _tags.value = await TagAPI.getAll({
      sorts: [['updated_at', 'desc']],
      limit: 100, // TODO: 暫定
    })

    // 総数
    _reportCount.value = await ReportAPI.count()
    _tagCount.value = await TagAPI.count()

    // カレンダー
    await calendarStore.onLoad()
  }

  // 個数が変わったら再ロード
  watch(() => configStore.env.latestReportNum, () => onLoad())

  return {
    recentReports: computed(() => _recentReports.value),
    tags: computed(() => _tags.value),

    reportCount: computed(() => _reportCount.value),
    tagCount: computed(() => _tagCount.value),

    onLoad,
  }
})
