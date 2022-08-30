<template>
  <n-modal
    v-model:show="_show"
    title="ノート検索"
    preset="dialog"
    :block-scroll="false"
    style="width: 600px"
  >
    <div>{{ explorerCtx.params }}</div>

    <n-scrollbar class="pr-3" style="max-height: calc(100vh - 100px)">
      <div class="flex flex-col gap-2">
        <template v-if="explorerCtx.matchReport.value || explorerCtx.params.match">
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
        </template>

        <div>検索結果</div>
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
    </n-scrollbar>
  </n-modal>
</template>

<script setup lang="ts">
import { useThemeVars } from 'naive-ui'
import { Report } from '~~/src/databases/models/Report'

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

const loadCtx = inject(LoaderCtxKey)
const explorerCtx = inject(ExplorerCtxKey)
const themeVars = useThemeVars()

/// ////////////////////
// ノート読み込み

const onClickReport = async (report: Report) => {
  await loadCtx.loadByReport(report)
  _show.value = false
}

const onClickCreate = async (hashtag: string) => {
  await loadCtx.loadByTitle(hashtag)
  _show.value = false
}
</script>
