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

    <template #header-extra>
      <div class="flex items-center gap-1">
        <n-icon size="16">
          <TimeOutline />
        </n-icon>

        <span>{{ lastUpdatedStr }}</span>
      </div>
    </template>

    <template #description>
      <n-ellipsis
        class="break-all"
        :line-clamp="2"
        :tooltip="false"
      >
        {{ report.text }}
      </n-ellipsis>
    </template>
  </n-thing>
</template>

<script setup lang="ts">
import {
  CalendarOutline,
  PricetagOutline,
  TimeOutline,
} from '@vicons/ionicons5'
import { Report } from '~~/src/databases/models/Report'
import { DateUtil } from '~~/src/utils/DateUtil'

const props = defineProps<{
  report: Report,
}>()

const title = computed(() => {
  const report = props.report
  if (report.isDiary) {
    const date = DateUtil.parseByDiaryTitle(report.title)
    return DateUtil.formatDate(date)
  }

  return report.title
})

const lastUpdatedStr = computed(() => {
  const updated = props.report.updatedAt
  return DateUtil.formatHumanity(updated)
})
</script>
