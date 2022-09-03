<template>
  <div class="h-full flex items-center gap-1">
    <HeaderButton
      :tooltip="configStore.env.useSidebar ? 'サイドバーを閉じる' : 'サイドバーを開く'"
      :icon="configStore.env.useSidebar ? CaretBack : ReorderThree"
      @click="toggleSidebar"
    />

    <div>|</div>

    <HeaderButton
      tooltip="検索"
      :icon="Search"
      @click="explorerStore.showSearchModal = true"
    />
    <HeaderButton
      tooltip="前日に移動"
      :icon="ChevronBack"
      @click="loaderStore.onLoadByDateAndMove(-1)"
    />
    <HeaderButton
      tooltip="今日に移動"
      :icon="TodayOutline"
      @click="loaderStore.onLoadByToday()"
    />
    <HeaderButton
      tooltip="翌日に移動"
      :icon="ChevronForward"
      @click="loaderStore.onLoadByDateAndMove(1)"
    />
    <HeaderButton
      tooltip="一つ前のノートを表示"
      :icon="ArrowUndoOutline"
      @click="loaderStore.onLoadByPrevious()"
    />

    <div class="flex-grow" name="padding" />

    <HeaderButton
      tooltip="ノート一覧"
      :icon="DocumentTextOutline"
      @click="movePage('reports')"
    />
    <HeaderButton
      tooltip="タグ一覧"
      :icon="PricetagsOutline"
      @click="movePage('tags')"
    />
    <HeaderButton
      tooltip="設定"
      :icon="Cog"
      @click="emit('click:config')"
    />
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
</script>
