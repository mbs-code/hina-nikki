<template>
  <n-menu
    ref="menuRef"
    v-model:value="_value"
    class="report-menu"
    :options="options"
  />
</template>

<script setup lang="ts">
import {
  CalendarOutline,
  PricetagOutline,
} from '@vicons/ionicons5'
import { MenuOption, NIcon } from 'naive-ui'
import { Report } from '~~/src/databases/models/Report'

const props = defineProps<{
  reports: Report[],
  value?: Report,
}>()

const emit = defineEmits<{ // eslint-disable-line func-call-spacing
  (e: 'update:value', report: Report): void
}>()

const _value = computed({
  get: () => {
    const id = props.value?.id
    return id ? String(id) : undefined
  },
  set: (value?: string) => {
    const report = props.reports.find(r => r.id === Number(value))
    emit('update:value', report)
  },
})

const options = computed<MenuOption[]>(() => {
  return props.reports.map(report => ({
    key: String(report.id),
    label: report.formattedTitle,
    icon: () => h(NIcon, null, { default: () => h(report.isDiary ? CalendarOutline : PricetagOutline) },
    ),
  }))
})

///

// FIXME: null を指定した際に選択を解除するバグ対策
const menuRef = ref()
watch(() => props.value, (report?: Report) => {
  if (!report) {
    menuRef.value.uncontrolledValue = null
  }
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
