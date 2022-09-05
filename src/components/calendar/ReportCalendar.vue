<template>
  <div>
    <div>calendar</div>
    <div>{{ selectedDate }}</div>
    <CalendarPicker
      v-model:date="selectedDate"
      :badges="badges"
      @change:month="onChangeMonth"
    />
  </div>
</template>

<script setup lang="ts">
import { ReportAPI } from '~~/src/apis/ReportAPI'

const selectedDate = ref<Date>()

const badges = ref<Date[]>()

const onChangeMonth = async (start: Date, end: Date) => {
  const dates = await ReportAPI.hasCalendar(start, end)
  badges.value = dates
}
</script>
