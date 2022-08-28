<template>
  <n-modal
    v-model:show="_show"
    title="ノート検索"
    preset="dialog"
    :block-scroll="false"
  >
    <n-scrollbar class="pr-3" style="max-height: calc(100vh - 100px)">
      <div class="flex flex-col gap-2">
        <n-list v-if="hasResult" hoverable clickable bordered>
          <!-- 完全一致 -->
          <template v-if="searchCtx.matchReport.value">
            <n-list-item
              :style="{
                borderWidth: '2px',
                borderColor: themeVars.primaryColor,
              }"
              @click="onClick(searchCtx.matchReport.value)"
            >
              <ReportPanel :report="searchCtx.matchReport.value" />
            </n-list-item>
          </template>

          <!-- 検索要素 -->
          <n-list-item
            v-for="(report, _) of searchCtx.reports.value"
            :key="_"
            @click="onClick(report)"
          >
            <ReportPanel :report="report" />
          </n-list-item>
        </n-list>

        <!-- 一つもなかったら -->
        <n-empty
          v-else
          size="huge"
          description="検索結果が空です"
        />
      </div>
    </n-scrollbar>
  </n-modal>
</template>

<script setup lang="ts">
import { useThemeVars } from 'naive-ui'
import { Report } from '~~/src/databases/models/Report'
import { DateUtil } from '~~/src/utils/DateUtil'

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

const hasResult = computed(() =>
  Boolean(searchCtx.matchReport.value) || searchCtx.reports.value.length
)

const onClick = async (report: Report) => {
  if (report.isDiary) {
    const date = DateUtil.parseByDiaryTitle(report.title)
    await loadCtx.loadDate(date)
  } else {
    await loadCtx.loadHashtag(report.title)
  }

  _show.value = false
}
</script>
