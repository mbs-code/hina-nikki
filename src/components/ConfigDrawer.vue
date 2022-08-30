<template>
  <n-drawer
    v-model:show="_show"
    :width="502"
    placement="right"
  >
    <n-drawer-content title="設定">
      Stoner is a 1965 novel by the American writer John Williams.
    </n-drawer-content>
  </n-drawer>

  <!-- <n-modal
    v-model:show="_show"
    title="ノート検索"
    preset="dialog"
    :block-scroll="false"
    style="width: 600px;"
  > -->
  <!-- <div class="flex flex-col gap-4">
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

      <div v-if="explorerCtx.matchReport.value || explorerCtx.params.match">
        <div>完全一致</div>
        <n-list hoverable clickable bordered>
          <template v-if="explorerCtx.matchReport.value">
            <n-list-item
              class="border-2"
              :style="{ borderColor: themeVars.primaryColor }"
              @click="onClickReport(explorerCtx.matchReport.value)"
            >
              <ReportPanel :report="explorerCtx.matchReport.value" />
            </n-list-item>
          </template>

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

      <div>
        <div>検索結果 ({{ explorerCtx.reports.value?.length }})</div>
        <div class="flex flex-col gap-2">
          <n-list hoverable clickable bordered>
            <n-list-item
              v-for="(report, _) of explorerCtx.reports.value"
              :key="_"
              @click="onClickReport(report)"
            >
              <ReportPanel :report="report" />
            </n-list-item>

            <n-empty
              v-if="!explorerCtx.reports.value?.length"
              class="m-2"
              size="huge"
              description="検索結果が空です"
            />
          </n-list>
        </div>
      </div>
    </div> -->
  <!-- </n-modal> -->
</template>

<script setup lang="ts">
import { useThemeVars } from 'naive-ui'
import { Search } from '@vicons/ionicons5'
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

// const loadCtx = inject(LoaderCtxKey)
// const explorerCtx = inject(ExplorerCtxKey)
// const themeVars = useThemeVars()

// /// ////////////////////
// // ノート検索

// const onSearchText = async () => {
//   const text = explorerCtx.params.phrase
//   await explorerCtx.onSearch({
//     phrase: text,
//   })
// }

// /// ////////////////////
// // ノート読み込み

// const onClickReport = async (report: Report) => {
//   await loadCtx.loadByReport(report)
//   _show.value = false
// }

// const onClickCreate = async (hashtag: string) => {
//   await loadCtx.loadByTitle(hashtag)
//   _show.value = false
// }
</script>
