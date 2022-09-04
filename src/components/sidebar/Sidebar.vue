<template>
  <div class="m-1 pr-2 flex flex-col gap-2">
    <!-- 文字列検索 -->
    <n-input-group>
      <n-input
        v-model:value="explorerStore.searchText"
        type="text"
        clearable
        placeholder="Search"
        @keydown.enter="explorerStore.onSearchText()"
      />

      <n-button ghost @click="explorerStore.onSearchText()">
        <template #icon>
          <n-icon :component="Search" />
        </template>
      </n-button>
    </n-input-group>

    <!-- カレンダー -->
    <DatePicker
      :value="loaderStore.loadedTitleDate"
      @update:value="loaderStore.onLoadByDate($event)"
    />

    <!-- クイックアクセス -->
    <div class="flex-grow">
      <!-- TODO: タブでお気に入りを実装 -->
      <n-card title="最近の更新" size="small">
        <SimpleReportList
          :value="loaderStore.selectedReport"
          :reports="displayStore.recentReports"
          @update:value="loaderStore.onLoadByReport($event)"
        />
      </n-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Search } from '@vicons/ionicons5'

const loaderStore = useLoaderStore()
const explorerStore = useExplorerStore()
const displayStore = useDisplayStore()
</script>
