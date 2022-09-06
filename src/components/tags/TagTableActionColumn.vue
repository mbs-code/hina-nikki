<template>
  <n-button quaternary type="success" @click="emit('edit')">
    <template #icon>
      <n-icon :component="Pencil" />
    </template>
    編集
  </n-button>
</template>

<script setup lang="ts">
import { Pencil } from '@vicons/ionicons5'

const emit = defineEmits<{(e: 'edit'): void }>()
</script>
