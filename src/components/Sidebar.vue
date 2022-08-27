<template>
  <div>
    <n-date-picker
      v-model:value="timestamp"
      type="date"
      panel
      @update:value="onChangeDate"
    />

    <div>side</div>
    <div>side</div>
    <div>side</div>
    <div>side</div>
    <div>side</div>
    <div>side</div>
    <div>side</div>
    <div>side</div>
    <div>side</div>
    <div>side</div>
    <div>side</div>
    <div>side</div>
    <div>side</div>
    <div>side</div>
    <div>side</div>
    <div>side</div>
    <div>side</div>
    <div>side</div>
    <div>side</div>
    <div>side</div>
    <div>side</div>
    <div>side</div>
    <div>side</div>
    <div>side</div>
    <div>side</div>
    <div>side</div>
    <div>side</div>
    <div>side</div>
  </div>
</template>

<script setup lang="ts">
const editorCtx = inject(EditorCtxKey)

const timestamp = computed({
  get: () => editorCtx.selectedDate.value?.getTime(),
  set: (value?: number) => (editorCtx.selectedDate.value = value ? new Date(value) : undefined),
})

const onChangeDate = async () => {
  await editorCtx.loadReport()
}
</script>
