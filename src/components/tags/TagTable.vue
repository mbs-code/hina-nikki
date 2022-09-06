<template>
  <n-data-table
    :data="tags"
    :columns="columns"
    size="small"
    flex-height
    style="height: calc(100vh - 60px)"
  />
</template>

<script setup lang="ts">
import TagTableColorColumn from '~~/src/components/tags/TagTableColorColumn.vue'
import TagTablePinnedColumn from '~~/src/components/tags/TagTablePinnedColumn.vue'
import TagTableActionColumn from '~~/src/components/tags/TagTableActionColumn.vue'
import TagTableActionHeader from '~~/src/components/tags/TagTableActionHeader.vue'
import { Tag } from '~~/src/databases/models/Tag'

defineProps<{
  tags: Tag[],
}>()

const emit = defineEmits<{ // eslint-disable-line func-call-spacing
  (e: 'click', val: MouseEvent): void,
  (e: 'edit', val: Tag): void,
}>()

///

const columns = [
  {
    key: 'id',
    title: 'ID',
    align: 'center',
  },
  {
    key: 'name',
    title: 'タグ名'
  },
  {
    key: 'color',
    align: 'center',
    title: '色',
    render: (row: Tag) => h(TagTableColorColumn, { color: row.color }),
  },
  {
    key: 'is_pinned',
    align: 'center',
    title: 'ピン',
    render: (row: Tag) => h(TagTablePinnedColumn, { show: row.isPinned }),
  },
  {
    key: 'order',
    align: 'center',
    title: 'オーダー',
  },
  {
    key: 'action',
    align: 'center',
    title: (row: Tag) => h(TagTableActionHeader, { onCreate: () => emit('edit', row) }),
    render: (row: Tag) => h(TagTableActionColumn, { onEdit: () => emit('edit', row) }),
  },
]
</script>
