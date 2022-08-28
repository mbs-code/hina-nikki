<template>
  <div class="flex flex-col gap-2">
    <n-date-picker
      ref="datePickerRef"
      :value="loaderCtx.selectedTimestamp.value"
      type="date"
      panel
      clearable
      @update:value="onChangeDate"
    />

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

    <SimpleReportList
      :selected-report="editorCtx.selectedReport.value"
      :reports="favoriteCtx.recentReports.value"
      @update:selected-report="onChangeReport"
    />
  </div>
</template>

<script setup lang="ts">
import { Search } from '@vicons/ionicons5'
import { Report } from '~~/src/databases/models/Report'

const loaderCtx = inject(LoaderCtxKey)
const editorCtx = inject(EditorCtxKey)
const searchCtx = inject(SearchCtxKey)
const favoriteCtx = inject(FavoriteCtxKey)

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
  if (timestamp) {
    const date = new Date(timestamp)
    await loaderCtx.loadByDate(date)
  }
}

const onChangeReport = async (report?: Report) => {
  // レポートが選択されたとき
  if (report) {
    await loaderCtx.loadByReport(report)
  }
}

watch(loaderCtx.selectedTimestamp, (value: number) => {
  // FIXME: バグ対策
  if (!value) {
    datePickerRef.value?.handlePanelUpdateValue(null)
  }
})
</script>
