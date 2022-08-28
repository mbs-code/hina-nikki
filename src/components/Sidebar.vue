<template>
  <div>
    <n-date-picker
      ref="datePickerRef"
      :value="searchCtx.selectedTimestamp.value"
      type="date"
      panel
      clearable
      @update:value="onUpdateDate"
    />

    <n-table size="small">
      <tr>
        <td>Alt + wasd</td>
        <td>日付の移動</td>
      </tr>
      <tr>
        <td>Alt + q</td>
        <td>今日に移動</td>
      </tr>
      <tr>
        <td>Ctrl + s</td>
        <td>保存</td>
      </tr>
    </n-table>

    <n-button @click="testAsdPage">
      #asd
    </n-button>

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
const searchCtx = inject(SearchCtxKey)

const onUpdateDate = async (val?: number) => {
  const date = val ? new Date(val) : null
  await searchCtx.loadDate(date)
}

const datePickerRef = ref()
const testAsdPage = async () => {
  // FIXME: null を指定してもカレンダーがクリアされないので、手動クリア
  datePickerRef.value?.handlePanelUpdateValue(null)

  await searchCtx.loadTagName('#asd')
}
</script>
