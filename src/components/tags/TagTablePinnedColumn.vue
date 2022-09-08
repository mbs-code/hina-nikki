<template>
  <n-icon v-if="show" :component="Checkmark" />
</template>

<script setup lang="ts">
import { Checkmark } from '@vicons/ionicons5'

defineProps<{ show?: boolean }>()
</script>
