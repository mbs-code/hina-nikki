<template>
  <n-card
    v-if="loaderCtx.selectedReport.value?.id"
    size="small"
  >
    <div class="flex flex-col gap-2">
      <n-button
        ghost
        type="error"
        @click="onDelete"
      >
        <template #icon>
          <n-icon :component="TrashBin" />
        </template>
        ノートを削除する
      </n-button>
    </div>
  </n-card>
</template>

<script setup lang="ts">
import {
  TrashBin,
} from '@vicons/ionicons5'
import { useDialog } from 'naive-ui'
import { ReportAPI } from '~~/src/apis/ReportAPI'

const emit = defineEmits<{ // eslint-disable-line func-call-spacing
  (e: 'deleted'): void
}>()

const loaderCtx = inject(LoaderCtxKey)

const dialog = useDialog()
const onDelete = () => {
  dialog.error({
    title: '警告',
    content: '本当に削除しますか？',
    positiveText: '削除',
    negativeText: 'キャンセル',
    onPositiveClick: async () => {
      const id = loaderCtx.selectedReport.value?.id
      if (id) {
        await ReportAPI.remove(id)
        await loaderCtx.loadByTitle()

        emit('deleted')
      }
    },
  })
}
</script>
