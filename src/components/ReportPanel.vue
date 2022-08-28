<template>
  <n-thing
    v-if="report"
    :title="title"
    content-style="margin-top: 10px;"
  >
    <template #avatar>
      <n-avatar>
        <n-icon>
          <CalendarOutline v-if="report.isDiary" />
          <PricetagOutline v-else />
        </n-icon>
      </n-avatar>
    </template>

    <template #description>
      <div class="flex items-center gap-1">
        <n-icon size="16">
          <TimeOutline />
        </n-icon>

        <span>{{ lastUpdatedStr }}</span>
      </div>
    </template>
  </n-thing>
</template>

<script setup lang="ts">
import {
  CalendarOutline,
  PricetagOutline,
  TimeOutline,
} from '@vicons/ionicons5'
import {
  parse as dateParse,
  format as dateFormat,
  formatDistanceToNow,
// eslint-disable-next-line import/no-duplicates
} from 'date-fns'
// eslint-disable-next-line import/no-duplicates
import { ja } from 'date-fns/locale'
import { Report } from '~~/src/databases/models/Report'

const props = defineProps<{
  report: Report,
}>()

const title = computed(() => {
  const report = props.report
  if (report.isDiary) {
    const date = dateParse(report.title, 'yyyyMMdd', new Date())
    return dateFormat(date, 'yyyy-MM-dd')
  }

  return report.title
})

const lastUpdatedStr = computed(() => {
  const updated = props.report.updatedAt
  return formatDistanceToNow(updated, { addSuffix: true, locale: ja })
})
</script>
