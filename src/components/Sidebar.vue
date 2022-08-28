<template>
  <div class="flex flex-col gap-2">
    <n-date-picker
      ref="datePickerRef"
      :value="loaderCtx.selectedTimestamp.value"
      type="date"
      panel
      clearable
      @update:value="onUpdateDate"
    />

    <n-input-group>
      <n-input
        v-model:value="searchText"
        type="text"
        clearable
        placeholder="Search"
      />

      <n-button ghost @click="onSearch">
        <template #icon>
          <n-icon><Search /></n-icon>
        </template>
      </n-button>
    </n-input-group>

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
import { Search } from '@vicons/ionicons5'
import { ReportAPI } from '~~/src/apis/ReportAPI'
import { Report } from '~~/src/databases/models/Report'

const loaderCtx = inject(LoaderCtxKey)
const searchCtx = inject(SearchCtxKey)

const isSelected = (report: Report) => {
  return loaderCtx.reportTitle.value === report.title
}

///

const searchText = ref<string>()

const onSearch = async () => {
  if (searchText.value) {
    await searchCtx.searchText(searchText.value)
  }
}

///

const onUpdateDate = async (val?: number) => {
  const date = val ? new Date(val) : null
  await loaderCtx.loadDate(date)
}

const datePickerRef = ref()
const openTagReport = async (title: string) => {
  // FIXME: null を指定してもカレンダーがクリアされないので、手動クリア
  datePickerRef.value?.handlePanelUpdateValue(null)

  await loaderCtx.loadHashtag(title)
}

///

const tagReports = ref<Report[]>([])
onMounted(async () => {
  tagReports.value = await ReportAPI.getAll({ isDiary: false })
})
</script>
