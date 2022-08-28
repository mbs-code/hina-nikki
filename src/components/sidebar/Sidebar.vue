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

    <DatePicker
      :value="loaderCtx.selectedDate.value"
      @update:value="onChangeDate"
    />

    <div class="grow">
      <n-card title="最近の更新" size="small">
        <SimpleReportList
          :value="editorCtx.selectedReport.value"
          :reports="favoriteCtx.recentReports.value"
          @update:value="onChangeReport"
        />
      </n-card>
    </div>
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

const onChangeDate = async (date?: Date) => {
  // 日付が変更されたとき
  await loaderCtx.loadByDate(date)
}

const onChangeReport = async (report?: Report) => {
  // レポートが選択されたとき
  if (report) {
    await loaderCtx.loadByReport(report)
  }
}

</script>
