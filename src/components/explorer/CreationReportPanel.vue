<template>
  <n-thing
    :title="title"
    content-style="margin-top: 10px;"
  >
    <template #avatar>
      <n-avatar :style="{ backgroundColor: iconColor }">
        <n-icon :component="AddCircleOutline" />
      </n-avatar>
    </template>

    <template #description>
      ノートを新規に作成する。
    </template>
  </n-thing>
</template>

<script setup lang="ts">
import { AddCircleOutline } from '@vicons/ionicons5'

defineProps<{
  title?: string,
  iconColor?: string,
}>()
</script>
