<template>
  <div class="flex items-center justify-center">
    <n-icon :component="icon" :size="24" />
  </div>
</template>

<script setup lang="ts">
import {
  DocumentOutline,
  CalendarOutline,
  PricetagOutline,
} from '@vicons/ionicons5'
import { Report } from '~~/src/databases/models/Report'

const props = defineProps<{ report: Report }>()

const icon = computed(() => {
  if (props.report.isDiary) { return CalendarOutline }
  if (props.report.isHashtag) { return PricetagOutline }
  return DocumentOutline
})
</script>
