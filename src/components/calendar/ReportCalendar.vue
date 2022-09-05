<template>
  <div>
    <div>calendar</div>
    <div>{{ selectedDate }}</div>
    <CalendarPicker v-model:date="selectedDate" />
  </div>
</template>

<script setup lang="ts">
const selectedDate = ref<Date>()
</script>
