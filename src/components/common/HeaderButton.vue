<template>
  <n-tooltip trigger="hover">
    <template #trigger>
      <n-button
        quaternary
        size="small"
        @click="emit('click', $event)"
      >
        <template #icon>
          <n-icon :component="icon" />
        </template>
      </n-button>
    </template>
    {{ tooltip }}
  </n-tooltip>
</template>

<script setup lang="ts">
import { Component } from 'vue'

defineProps<{
  icon: Component,
  tooltip: string,
}>()

const emit = defineEmits<{ // eslint-disable-line func-call-spacing
  (e: 'click', val: MouseEvent): void
}>()
</script>
