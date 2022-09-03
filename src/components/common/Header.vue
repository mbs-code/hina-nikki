<template>
  <div class="h-full flex items-center gap-2">
    <n-button quaternary size="small" @click="toggleSidebar">
      <template #icon>
        <n-icon
          :component="configStore.env.useSidebar ? CaretBack : ReorderThree"
        />
      </template>
    </n-button>

    <template v-if="!configStore.env.useSidebar">
      <n-button
        quaternary
        size="small"
        @click="loaderStore.onLoadByDateAndMove(-1)"
      >
        <template #icon>
          <n-icon :component="ChevronBack" />
        </template>
      </n-button>

      <n-button
        quaternary
        size="small"
        @click="loaderStore.onLoadByToday()"
      >
        <template #icon>
          <n-icon :component="TodayOutline" />
        </template>
      </n-button>

      <n-button
        quaternary
        size="small"
        @click="loaderStore.onLoadByDateAndMove(1)"
      >
        <template #icon>
          <n-icon :component="ChevronForward" />
        </template>
      </n-button>

      <n-button
        quaternary
        size="small"
        @click="onLatestReport"
      >
        <template #icon>
          <n-icon :component="ArrowUndoOutline" />
        </template>
      </n-button>

      <n-button
        quaternary
        size="small"
        @click="explorerStore.showSearchModal = true"
      >
        <template #icon>
          <n-icon :component="Search" />
        </template>
      </n-button>
    </template>

    <div class="flex-grow" name="padding" />

    <n-button quaternary size="small" @click="movePage('reports')">
      <template #icon>
        <n-icon :component="DocumentTextOutline" />
      </template>
    </n-button>

    <n-button quaternary size="small" @click="movePage('tags')">
      <template #icon>
        <n-icon :component="PricetagsOutline" />
      </template>
    </n-button>

    <n-button quaternary size="small" @click="emit('click:config')">
      <template #icon>
        <n-icon :component="Cog" />
      </template>
    </n-button>
  </div>
</template>

<script setup lang="ts">
import {
  ReorderThree,
  CaretBack,
  Cog,
  ChevronBack,
  ChevronForward,
  TodayOutline,
  ArrowUndoOutline,
  Search,
  DocumentTextOutline,
  PricetagsOutline,
} from '@vicons/ionicons5'
import { useConfigStore } from '~~/src/stores/useConfigStore'

const configStore = useConfigStore()
const loaderStore = useLoaderStore()
const explorerStore = useExplorerStore()
const displayStore = useDisplayStore()

const emit = defineEmits<{ // eslint-disable-line func-call-spacing
  (e: 'click:config'): void
}>()

/// ////////////////////

const toggleSidebar = () => {
  configStore.env.useSidebar = !configStore.env.useSidebar
}

const appRouter = useAppRouter()
const movePage = async (name: string) => {
  switch (name) {
    case 'tags':
      await appRouter.tags()
      break
    case 'reports':
      await appRouter.reports()
      break
  }
}

// 自身の次のレポートを読み込む
// TODO: まとめる
const onLatestReport = async () => {
  const selected = loaderStore.selectedReport
  const reports = displayStore.recentReports

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
