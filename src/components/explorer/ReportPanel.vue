<template>
  <n-thing
    v-if="report"
    :title="report.formattedTitle"
    content-style="margin-top: 10px;"
  >
    <template #avatar>
      <n-avatar>
        <!-- TODO: ハッシュタグとプレーンを分ける -->
        <n-icon :component="report.isDiary ? CalendarOutline : PricetagOutline" />
      </n-avatar>
    </template>

    <template #header-extra>
      <div class="flex items-center gap-1">
        <n-icon :component="TimeOutline" />

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

const lastUpdatedStr = computed(() => {
  const updated = props.report.updatedAt
  return DateUtil.formatHumanity(updated)
})
</script>
