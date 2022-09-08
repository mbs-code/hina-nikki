<template>
  <n-data-table
    :data="tags"
    :columns="columns"
    size="small"
    flex-height
    :scroll-x="0"
  />
</template>

<script setup lang="ts">
import { TableColumn } from 'naive-ui/es/data-table/src/interface'
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
  (e: 'search', val: Tag): void,
}>()

///

const columns: TableColumn<Tag>[] = [
  {
    key: 'id',
    title: 'ID',
    align: 'center',
    width: 60,
    fixed: 'left',
  },
  {
    key: 'name',
    title: 'タグ名',
    width: 160,
    fixed: 'left',
  },
  {
    key: 'color',
    align: 'center',
    title: '色',
    width: 60,
    render: (row: Tag) => h(TagTableColorColumn, { color: row.color }),
  },
  {
    key: 'is_pinned',
    align: 'center',
    title: 'ピン',
    width: 60,
    render: (row: Tag) => h(TagTablePinnedColumn, { show: row.isPinned }),
  },
  {
    key: 'order',
    align: 'center',
    title: 'オーダー',
    width: 60,
  },
  {
    key: 'action',
    align: 'center',
    width: 190,
    title: () => h(TagTableActionHeader, { onCreate: () => emit('edit', undefined) }),
    render: (row: Tag) => h(TagTableActionColumn, {
      onSearch: () => emit('search', row),
      onEdit: () => emit('edit', row),
    }),
  },
]
</script>
