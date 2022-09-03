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

      <!-- 完全一致レポート -->
      <div v-if="explorerCtx.matchReport.value || explorerCtx.params.match">
        <div>完全一致</div>
        <n-list hoverable clickable bordered>
          <!-- 完全一致 -->
          <template v-if="explorerCtx.matchReport.value">
            <n-list-item
              class="border-2"
              :style="{ borderColor: themeVars.primaryColor }"
              @click="onClickReport(explorerCtx.matchReport.value)"
            >
              <ReportPanel :report="explorerCtx.matchReport.value" />
            </n-list-item>
          </template>

          <!-- 完全一致が無い場合は、作成アシスト -->
          <template v-else-if="explorerCtx.params.match">
            <n-list-item
              class="border-2"
              :style="{ borderColor: themeVars.infoColor }"
              @click="onClickCreate(explorerCtx.params.match)"
            >
              <CreationReportPanel
                :title="explorerCtx.params.match"
                :icon-color="themeVars.infoColor"
              />
            </n-list-item>
          </template>
        </n-list>
      </div>

      <!-- 検索結果 -->
      <div>
        <div>検索結果 ({{ explorerCtx.reports.value?.length }})</div>
        <div class="flex flex-col gap-2">
          <n-list hoverable clickable bordered>
            <!-- 検索要素 -->
            <n-list-item
              v-for="(report, _) of explorerCtx.reports.value"
              :key="_"
              @click="onClickReport(report)"
            >
              <ReportPanel :report="report" />
            </n-list-item>

            <!-- 一つもなかったら -->
            <n-empty
              v-if="!explorerCtx.reports.value?.length"
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

///

const explorerCtx = inject(ExplorerCtxKey)
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

const onClickReport = async (report: Report) => {
  await loaderStore.onLoadByReport(report)
  _show.value = false
}

const onClickCreate = async (hashtag: string) => {
  await loaderStore.onLoadByTitle(hashtag)
  _show.value = false
}
</script>
