<template>
  <n-modal
    v-model:show="_show"
    title="ノート検索"
    preset="dialog"
    :block-scroll="false"
    style="width: 600px"
  >
    <div>{{ searchCtx.params }}</div>

    <n-scrollbar class="pr-3" style="max-height: calc(100vh - 100px)">
      <div class="flex flex-col gap-2">
        <template v-if="searchCtx.matchReport.value || searchCtx.params.match">
          <div>完全一致</div>
          <n-list hoverable clickable bordered>
            <!-- 完全一致 -->
            <template v-if="searchCtx.matchReport.value">
              <n-list-item
                class="border-2"
                :style="{ borderColor: themeVars.primaryColor }"
                @click="onClickReport(searchCtx.matchReport.value)"
              >
                <ReportPanel :report="searchCtx.matchReport.value" />
              </n-list-item>
            </template>

            <!-- 完全一致が無い場合は、作成アシスト -->
            <template v-else-if="searchCtx.params.match">
              <n-list-item
                class="border-2"
                :style="{ borderColor: themeVars.infoColor }"
                @click="onClickCreate(searchCtx.params.match)"
              >
                <CreationReportPanel
                  :title="searchCtx.params.match"
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
            v-for="(report, _) of searchCtx.reports.value"
            :key="_"
            @click="onClickReport(report)"
          >
            <ReportPanel :report="report" />
          </n-list-item>

          <!-- 一つもなかったら -->
          <n-empty
            v-if="!searchCtx.reports.value?.length"
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
const searchCtx = inject(SearchCtxKey)
const themeVars = useThemeVars()

/// ////////////////////
// ノート読み込み

const onClickReport = async (report: Report) => {
  await loadCtx.loadByReport(report)
  _show.value = false
}

const onClickCreate = async (hashtag: string) => {
  await loadCtx.loadByHashtag(hashtag)
  _show.value = false
}
</script>
