<template>
  <n-modal
    v-model:show="_show"
    title="ノート検索"
    preset="dialog"
    :block-scroll="false"
    style="width: 600px;"
  >
    <div class="flex flex-col gap-4">
      <!-- 検索フィールド -->
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

      <!-- 完全一致レポート -->
      <div v-if="explorerStore.matchReport || explorerStore.params.match">
        <div>完全一致</div>
        <n-list hoverable clickable bordered>
          <!-- 完全一致 -->
          <template v-if="explorerStore.matchReport">
            <n-list-item
              class="border-2"
              :style="{ borderColor: themeVars.primaryColor }"
              @click="onClickReport(explorerStore.matchReport)"
            >
              <ReportPanel :report="explorerStore.matchReport" />
            </n-list-item>
          </template>

          <!-- 完全一致が無い場合は、作成アシスト -->
          <template v-else-if="explorerStore.params.match">
            <n-list-item
              class="border-2"
              :style="{ borderColor: themeVars.infoColor }"
              @click="onClickCreate(explorerStore.params.match)"
            >
              <CreationReportPanel
                :title="explorerStore.params.match"
                :icon-color="themeVars.infoColor"
              />
            </n-list-item>
          </template>
        </n-list>
      </div>

      <!-- 検索結果 -->
      <div>
        <div>検索結果 ({{ explorerStore.reports.length }})</div>
        <div class="flex flex-col gap-2">
          <n-list hoverable clickable bordered>
            <!-- 検索要素 -->
            <n-list-item
              v-for="(report, _) of explorerStore.reports"
              :key="_"
              @click="onClickReport(report)"
            >
              <ReportPanel :report="report" />
            </n-list-item>

            <!-- 一つもなかったら -->
            <n-empty
              v-if="!explorerStore.reports.length"
              class="m-2"
              size="huge"
              description="検索結果が空です"
            />
          </n-list>
        </div>
      </div>
    </div>
  </n-modal>
</template>

<script setup lang="ts">
import { useThemeVars } from 'naive-ui'
import { Search } from '@vicons/ionicons5'
import { Report } from '~~/src/databases/models/Report'

const loaderStore = useLoaderStore()
const explorerStore = useExplorerStore()
const themeVars = useThemeVars()

const props = defineProps<{
  show: boolean,
}>()

const emit = defineEmits<{ // eslint-disable-line func-call-spacing
  (e: 'update:show', val: boolean): void
}>()

const _show = computed({
  get: () => props.show,
  set: (val: boolean) => emit('update:show', val),
})

/// ////////////////////
// ノート読み込み

const onClickReport = async (report: Report) => {
  await loaderStore.onLoadByReport(report)
  _show.value = false
}

const onClickCreate = async (hashtag: string) => {
  await loaderStore.onLoadByTitle(hashtag)
  _show.value = false
}
</script>
