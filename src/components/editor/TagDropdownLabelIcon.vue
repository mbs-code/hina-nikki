<template>
  <span v-if="color" :style="{ color: color }">●</span>
</template>

<script setup lang="ts">
defineProps<{ color?: string }>()
</script>
