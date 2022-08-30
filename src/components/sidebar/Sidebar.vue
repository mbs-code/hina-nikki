<template>
  <div class="h-full flex flex-col gap-2">
    <n-input-group>
      <n-input
        v-model:value="explorerCtx.params.phrase"
        type="text"
        clearable
        placeholder="Search"
        @keydown.enter="onSearchText"
      />

      <n-button ghost @click="onSearchText">
        <template #icon>
          <n-icon><Search /></n-icon>
        </template>
      </n-button>
    </n-input-group>

    <DatePicker
      :value="loaderCtx.loadedTitleDate.value"
      @update:value="onChangeDate"
    />

    <div class="flex-grow">
      <n-card title="最近の更新" size="small">
        <SimpleReportList
          :value="loaderCtx.selectedReport.value"
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
const explorerCtx = inject(ExplorerCtxKey)
const favoriteCtx = inject(FavoriteCtxKey)

/// ////////////////////
// ノート検索

const onSearchText = async () => {
  const text = explorerCtx.params.phrase
  await explorerCtx.onSearch({
    phrase: text,
  })
}

/// ////////////////////
// ノート読み込み

// 日付が変更されたとき
const onChangeDate = async (date?: Date) => {
  await loaderCtx.loadByDate(date)
}

// レポートが選択されたとき
const onChangeReport = async (report?: Report) => {
  await loaderCtx.loadByReport(report)
}
</script>
