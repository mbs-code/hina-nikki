<template>
  <div>
    <div>calendar</div>
    <div>{{ selectedDate }}</div>
    <CalendarPicker v-model:date="selectedDate" :badges="badges" />
  </div>
</template>

<script setup lang="ts">
const selectedDate = ref<Date>()

const badges = ref<Date[]>([new Date('2022-09-04'), new Date('2022-09-05')])
</script>
