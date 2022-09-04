<template>
  <n-modal
    v-model:show="_show"
    title="ノート情報"
    preset="dialog"
    :block-scroll="false"
    style="width: 600px;"
  >
    <div class="flex flex-col gap-2">
      <ReportInfoTable />

      <TitleEditCard />

      <ReportDeleteCard @deleted="_show = false" />
    </div>
  </n-modal>
</template>

<script setup lang="ts">
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
</script>
