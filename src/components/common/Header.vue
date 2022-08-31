<template>
  <div class="h-full flex items-center gap-2">
    <n-button quaternary size="small" @click="toggleSidebar">
      <template #icon>
        <n-icon
          :component="configStore.env.useSidebar ? CaretBack : ReorderThree"
        />
      </template>
    </n-button>

    <div>Header</div>

    <div class="flex-grow" name="padding" />

    <n-button quaternary size="small" @click="emit('click:config')">
      <template #icon>
        <n-icon :component="Cog" />
      </template>
    </n-button>
  </div>
</template>

<script setup lang="ts">
import {
  ReorderThree,
  CaretBack,
  Cog,
} from '@vicons/ionicons5'

const emit = defineEmits<{ // eslint-disable-line func-call-spacing
  (e: 'click:config'): void
}>()

const configStore = inject(ConfigStoreKey)

const toggleSidebar = () => {
  configStore.env.useSidebar = !configStore.env.useSidebar
}
</script>
