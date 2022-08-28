<template>
  <n-modal
    v-model:show="_show"
    title="ノート検索"
    preset="dialog"
    :block-scroll="false"
  >
    <n-scrollbar class="pr-3" style="max-height: calc(100vh - 100px)">
      <div class="flex flex-col gap-2">
        <template v-if="searchCtx.matchReport.value">
          <n-list hoverable clickable bordered>
            <n-list-item @click="onClick(searchCtx.matchReport.value)">
              <ReportPanel :report="searchCtx.matchReport.value" />
            </n-list-item>
          </n-list>
        </template>

        <n-list hoverable clickable bordered>
          <n-list-item
            v-for="(report, _) of searchCtx.reports.value"
            :key="_"
            @click="onClick(report)"
          >
            <ReportPanel :report="report" />
          </n-list-item>
        </n-list>
      </div>
    </n-scrollbar>
  </n-modal>
</template>

<script setup lang="ts">
import { parse as dateParse } from 'date-fns'
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

const onClick = async (report: Report) => {
  if (report.isDiary) {
    const date = dateParse(report.title, 'yyyyMMdd', new Date())
    await loadCtx.loadDate(date)
  } else {
    await loadCtx.loadHashtag(report.title)
  }

  _show.value = false
}
</script>
