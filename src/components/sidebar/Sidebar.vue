<template>
  <div>
    <!-- ヘッダツール -->
    <!-- TODO: コンポーネント化とツールチップ、ショートカットキー -->
    <div
      class="pl-1 pr-3 flex flex-wrap items-center gap-1"
      :style="{ background: themeVars.modalColor }"
    >
      <n-button
        quaternary
        size="large"
        @click="loaderStore.onLoadByDateAndMove(-1)"
      >
        <template #icon>
          <n-icon :component="ChevronBack" />
        </template>
      </n-button>

      <n-button
        quaternary
        size="large"
        @click="loaderStore.onLoadByToday()"
      >
        <template #icon>
          <n-icon :component="TodayOutline" />
        </template>
        今日
      </n-button>

      <n-button
        quaternary
        size="large"
        @click="loaderStore.onLoadByDateAndMove(1)"
      >
        <template #icon>
          <n-icon :component="ChevronForward" />
        </template>
      </n-button>

      <div class="flex-grow" name="spacer" />

      <n-button
        quaternary
        size="large"
        @click="onLatestReport"
      >
        <template #icon>
          <n-icon :component="ArrowUndoOutline" />
        </template>
      </n-button>
    </div>

    <div class="m-1 pr-2 flex flex-col gap-2">
      <!-- カレンダー -->
      <DatePicker
        :value="loaderStore.loadedTitleDate"
        @update:value="onChangeDate"
      />

      <!-- 文字列検索 -->
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
            <n-icon :component="Search" />
          </template>
        </n-button>
      </n-input-group>

      <!-- クイックアクセス -->
      <div class="flex-grow">
        <!-- TODO: タブでお気に入りを実装 -->
        <n-card title="最近の更新" size="small">
          <SimpleReportList
            :value="loaderStore.selectedReport"
            :reports="displayCtx.recentReports.value"
            @update:value="onChangeReport"
          />
        </n-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ChevronBack,
  ChevronForward,
  TodayOutline,
  ArrowUndoOutline,
  Search,
} from '@vicons/ionicons5'
import { useThemeVars } from 'naive-ui'
import { Report } from '~~/src/databases/models/Report'

const loaderStore = useLoaderStore()

const explorerCtx = inject(ExplorerCtxKey)
const displayCtx = inject(DisplayCtxKey)
const themeVars = useThemeVars()

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
  await loaderStore.onLoadByDate(date)
}

// レポートが選択されたとき
const onChangeReport = async (report?: Report) => {
  await loaderStore.onLoadByReport(report)
}

// 自身の次のレポートを読み込む
// TODO: まとめる
const onLatestReport = async () => {
  const selected = loaderStore.selectedReport
  const reports = displayCtx.recentReports.value

  if (selected) {
    const index = reports.findIndex(r => r.id === selected.id)
    if (index >= 0) {
      const next = reports.at(index + 1)
      await loaderStore.onLoadByReport(next)
    }
  } else {
    // 選択が無い場合は、最新のやつ
    await loaderStore.onLoadByReport(reports.at(0))
  }
}
</script>
