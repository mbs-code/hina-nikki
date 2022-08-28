<template>
  <div class="h-full flex flex-col gap-2">
    <n-input-group>
      <n-input
        v-model:value="searchText"
        type="text"
        clearable
        placeholder="Search"
        @keydown.enter="onSearch"
      />

      <n-button ghost @click="onSearch">
        <template #icon>
          <n-icon><Search /></n-icon>
        </template>
      </n-button>
    </n-input-group>

    <n-date-picker
      ref="datePickerRef"
      :value="loaderCtx.selectedTimestamp.value"
      type="date"
      :panel="isCalendar"
      clearable
      @update:value="onChangeDate"
    />

    <div class="grow">
      <n-card title="最近の更新" size="small">
        <SimpleReportList
          :selected-report="editorCtx.selectedReport.value"
          :reports="favoriteCtx.recentReports.value"
          @update:selected-report="onChangeReport"
        />
      </n-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Search } from '@vicons/ionicons5'
import { useResizeObserver } from '@vueuse/core'
import { Report } from '~~/src/databases/models/Report'

const loaderCtx = inject(LoaderCtxKey)
const editorCtx = inject(EditorCtxKey)
const searchCtx = inject(SearchCtxKey)
const favoriteCtx = inject(FavoriteCtxKey)

///

const isCalendar = ref<boolean>(false)
useResizeObserver(document.body, (entries) => {
  const entry = entries[0]
  const { height } = entry.contentRect
  isCalendar.value = height > 600 // TODO: 設定
})

///

// TODO: searchCtx に入れる
const searchText = ref<string>()
const onSearch = async () => {
  await searchCtx.searchText(searchText.value ?? '')
}

///

const datePickerRef = ref()
const onChangeDate = async (timestamp?: number) => {
  // 日付が変更されたとき
  const date = timestamp ? new Date(timestamp) : undefined
  await loaderCtx.loadByDate(date)
}

const onChangeReport = async (report?: Report) => {
  // レポートが選択されたとき
  if (report) {
    await loaderCtx.loadByReport(report)
  }
}

///

// FIXME: null を指定した際に選択を解除するバグ対策
watch(loaderCtx.selectedTimestamp, (value: number) => {
  if (!value) {
    datePickerRef.value?.handlePanelUpdateValue(null)
  }
})
</script>
