<template>
  <div>
    <n-ellipsis
      v-for="(line, _) of lines"
      :key="_"
      class="!block"
    >
      {{ line }}
    </n-ellipsis>
  </div>
</template>

<script setup lang="ts">
defineProps<{ lines: string[] }>()
</script>
