<template>
  <n-date-picker
    ref="datePickerRef"
    v-model:value="_value"
    type="date"
    :panel="configStore.env.useCalendar"
    :actions="null"
  />
</template>

<script setup lang="ts">
import { useConfigStore } from '~~/src/stores/useConfigStore'

const configStore = useConfigStore()

const props = defineProps<{
  value?: Date,
}>()

const emit = defineEmits<{ // eslint-disable-line func-call-spacing
  (e: 'update:value', value?: Date): void
}>()

/// ////////////////////

// FIXME: 内部更新時に外まで伝搬させないフラグ
const isInnerUpdate = ref<boolean>(false)

const _value = computed({
  get: () => props.value?.getTime() ?? undefined,
  set: (value?: number) => {
    if (!isInnerUpdate.value) {
      const date = value ? new Date(value) : undefined
      emit('update:value', date)
    }
  },
})

///

// FIXME: null を指定した際に選択を解除するバグ対策
const datePickerRef = ref()
watch(() => props.value, (value?: Date) => {
  if (!value) {
    isInnerUpdate.value = true
    datePickerRef.value?.handlePanelUpdateValue(null, true)
    isInnerUpdate.value = false
  }
})
</script>
