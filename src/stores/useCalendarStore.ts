import { defineStore } from 'pinia'
import { ReportAPI } from '~~/src/apis/ReportAPI'

export const useCalendarStore = defineStore('calendar', () => {
  const startDate = ref<Date>()
  const endDate = ref<Date>()

  const _badges = ref<Date[]>()

  const onLoad = async () => {
    const dates = startDate.value && endDate.value
      ? await ReportAPI.hasCalendar(startDate.value, endDate.value)
      : []
    _badges.value = dates
  }

  return {
    startDate,
    endDate,
    badges: computed(() => _badges),

    onLoad,
  }
})
