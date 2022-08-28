<template>
  <div>
    <n-date-picker
      ref="datePickerRef"
      :value="searchCtx.selectedTimestamp.value"
      type="date"
      panel
      clearable
      @update:value="onUpdateDate"
    />

    <n-table size="small">
      <tr>
        <td>Alt + wasd</td>
        <td>日付の移動</td>
      </tr>
      <tr>
        <td>Alt + q</td>
        <td>今日に移動</td>
      </tr>
      <tr>
        <td>Ctrl + s</td>
        <td>保存</td>
      </tr>
    </n-table>

    <div class="flex flex-col gap-1">
      <template v-for="(tagReport, _) of tagReports" :key="_">
        <n-button
          size="medium"
          :type="isSelected(tagReport) ? 'primary' : 'default'"
          :tertiary="isSelected(tagReport)"
          @click="openTagReport(tagReport.title)"
        >
          {{ tagReport.title }}
        </n-button>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ReportAPI } from '~~/src/apis/ReportAPI'
import { Report } from '~~/src/databases/models/Report'

const searchCtx = inject(SearchCtxKey)

const isSelected = (report: Report) => {
  return searchCtx.reportTitle.value === report.title
}

///

const onUpdateDate = async (val?: number) => {
  const date = val ? new Date(val) : null
  await searchCtx.loadDate(date)
}

const datePickerRef = ref()
const openTagReport = async (title: string) => {
  // FIXME: null を指定してもカレンダーがクリアされないので、手動クリア
  datePickerRef.value?.handlePanelUpdateValue(null)

  await searchCtx.loadHashtag(title)
}

///

const tagReports = ref<Report[]>([])
onMounted(async () => {
  tagReports.value = await ReportAPI.getAll({ isDiary: false })
})
</script>
