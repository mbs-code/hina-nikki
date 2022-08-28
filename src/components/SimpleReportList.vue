<template>
  <n-menu
    v-model:value="_value"
    class="report-menu"
    :options="options"
  />
</template>

<script setup lang="ts">
import { MenuOption } from 'naive-ui'
import { Report } from '~~/src/databases/models/Report'

const props = defineProps<{
  reports: Report[],
  selectedReport?: Report,
}>()

const emit = defineEmits<{ // eslint-disable-line func-call-spacing
  (e: 'update:selected-report', report: Report): void
}>()

const _value = computed({
  get: () => {
    const id = props.selectedReport?.id
    return id ? String(id) : undefined
  },
  set: (value?: string) => {
    const report = props.reports.find(r => r.id === Number(value))
    emit('update:selected-report', report)
  },
})

const options = computed<MenuOption[]>(() => {
  return props.reports.map(report => ({
    key: String(report.id),
    label: report.formattedTitle,
  }))
})
</script>

<style scoped lang="scss">
  .report-menu {
    margin-bottom: 2px; // gap

    ::v-deep(.n-menu-item) {
      height: auto;
      margin-top: 2px; // gap
    }

    ::v-deep(.n-menu-item-content) {
      height: auto;
      padding-left: 4px !important; // 内側 padding
      padding-right: 4px !important;
    }

    ::v-deep(.n-menu-item-content::before) {
      left: 0px; // 色の幅
      right: 0px;
    }
  }
  </style>
