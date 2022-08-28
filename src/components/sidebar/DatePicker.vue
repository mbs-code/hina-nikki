<template>
  <n-date-picker
    ref="datePickerRef"
    v-model:value="_value"
    type="date"
    :panel="showInline"
    clearable
  />
</template>

<script setup lang="ts">
const props = defineProps<{
  value?: Date,
}>()

const emit = defineEmits<{ // eslint-disable-line func-call-spacing
  (e: 'update:value', value?: Date): void
}>()

const _value = computed({
  get: () => props.value?.getTime() ?? undefined,
  set: (value?: number) => {
    const date = value ? new Date(value) : undefined
    emit('update:value', date)
  },
})

///

const showInline = ref<boolean>(false)
useResizeObserver(document.body, (entries) => {
  const entry = entries[0]
  const { height } = entry.contentRect
  showInline.value = height > 600 // TODO: 設定
})

///

// FIXME: null を指定した際に選択を解除するバグ対策
const datePickerRef = ref()
watch(() => props.value, (value?: Date) => {
  if (!value) {
    datePickerRef.value?.handlePanelUpdateValue(null, true)
  }
})
</script>
