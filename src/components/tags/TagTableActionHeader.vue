<template>
  <div class="flex justify-center gap-2">
    <n-button quaternary type="info" @click="emit('create')">
      <template #icon>
        <n-icon :component="Add" />
      </template>
      追加
    </n-button>

    <n-dropdown trigger="hover" :options="options" @select="onSelectMenu">
      <n-button quaternary>
        <template #icon>
          <n-icon :component="EllipsisVertical" />
        </template>
      </n-button>
    </n-dropdown>
  </div>
</template>

<script setup lang="ts">
import { Add, EllipsisVertical } from '@vicons/ionicons5'
import { useDialog } from 'naive-ui'

const emit = defineEmits<{ // eslint-disable-line func-call-spacing
  (e: 'create'): void,
  (e: 'remove:unused'): void,
}>()

const options = [
  { label: '使用していないタグを削除する', key: 'delete-unused-key' }
]

const dialog = useDialog()
const onSelectMenu = (key: string) => {
  switch (key) {
    case 'delete-unused-key':
      dialog.error({
        title: '確認',
        content: 'ピン止めが無い、未使用のタグを削除します。',
        positiveText: '削除',
        negativeText: 'キャンセル',
        onPositiveClick: () => {
          emit('remove:unused')
        },
      })
      break
  }
}
</script>
