<template>
  <n-data-table
    :data="items"
    :columns="columns"
    size="small"
    flex-height
    :scroll-x="0"
    :row-props="rowProps"
  />
</template>

<script setup lang="ts">
import { TableColumn } from 'naive-ui/es/data-table/src/interface'
import ReportInstantTableActiveLineColumn from '~~/src/components/explorer/ReportInstantTableActiveLineColumn.vue'
import reportInstantTableIconColumnVue from '~~/src/components/explorer/reportInstantTableIconColumn.vue'
import { Report } from '~~/src/databases/models/Report'

type TableRow = {
  title: string
  activeLines: string[]
  report: Report
}

const props = defineProps<{
  reports: Report[],
  searchText?: string,
}>()

const emit = defineEmits<{ // eslint-disable-line func-call-spacing
  (e: 'click', val: Report): void,
}>()

///

const rowProps = (row: TableRow) => {
  return {
    onClick: () => emit('click', row.report),
  }
}

const columns: TableColumn<TableRow>[] = [
  {
    key: 'icon',
    title: '',
    align: 'center',
    width: 60,
    render: (row: TableRow) => h(reportInstantTableIconColumnVue, { report: row.report })
  },
  {
    key: 'title',
    title: 'タイトル',
    align: 'left',
    width: 120,
  },
  {
    key: 'activeLines',
    title: '本文',
    align: 'left',
    render: (row: TableRow) => h(ReportInstantTableActiveLineColumn, { lines: row.activeLines })
  },
]

const items = computed<TableRow[]>(() => (props.reports ?? []).map((report) => {
  const activeLines = (report.text ?? '')
    .split(/\r\n|\n/)
    .filter(text => text.includes(props.searchText))

  return {
    title: report.title,
    activeLines,
    report,
  }
}))
</script>
