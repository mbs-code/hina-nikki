<template>
  <n-button quaternary type="info" @click="emit('create')">
    <template #icon>
      <n-icon :component="Add" />
    </template>
    追加
  </n-button>

  <n-button>
    <template #icon>
      <n-icon :component="EllipsisVertical" />
    </template>
  </n-button>
</template>

<script setup lang="ts">
import { Add, EllipsisVertical } from '@vicons/ionicons5'

const emit = defineEmits<{(e: 'create'): void }>()
</script>
