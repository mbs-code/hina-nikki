<template>
  <div class="flex gap-2">
    <n-button quaternary type="info" @click="emit('search')">
      <template #icon>
        <n-icon :component="Search" />
      </template>
      検索
    </n-button>

    <n-button quaternary type="success" @click="emit('edit')">
      <template #icon>
        <n-icon :component="Pencil" />
      </template>
      編集
    </n-button>
  </div>
</template>

<script setup lang="ts">
import { Search, Pencil } from '@vicons/ionicons5'

const emit = defineEmits<{ // eslint-disable-line func-call-spacing
  (e: 'edit'): void,
  (e: 'search'): void,
}>()
</script>
