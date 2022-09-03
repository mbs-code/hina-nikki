<template>
  <n-card
    v-if="loaderStore.isLoaded"
    title="タイトルを編集する"
    size="small"
  >
    <div class="flex flex-col gap-2">
      <n-input-group>
        <n-button
          :type="canEditTitle ? undefined : 'primary'"
          @click="canEditTitle = !canEditTitle"
        >
          <n-icon :component="canEditTitle ? LockOpenOutline : LockClosedOutline" />
        </n-button>
        <n-input
          v-model:value="loaderStore.formReport.title"
          type="text"
          :disabled="!canEditTitle"
        />
      </n-input-group>

      <div class="flex items-center justify-end gap-4">
        <span class="flex-grow" :style="{ color: themeVars.iconColor }">
          [特殊タイトル] 日記: "yyyy-MM-dd" | タグ: "#xxxx"
        </span>
        <n-button
          :disabled="!canEditTitle"
          @click="onReset"
        >
          リセット
        </n-button>
        <n-button
          :disabled="!canEditTitle"
          :type="canEditTitle ? 'primary' : undefined"
          @click="onSave"
        >
          保存
        </n-button>
      </div>
    </div>
  </n-card>
</template>

<script setup lang="ts">
import {
  LockClosedOutline,
  LockOpenOutline,
} from '@vicons/ionicons5'
import { useThemeVars } from 'naive-ui'

const loaderStore = useLoaderStore()
const themeVars = useThemeVars()

/// ////////////////////

const canEditTitle = ref<boolean>(false)

const onReset = () => {
  loaderStore.onResetTitle()
}

const onSave = async () => {
  if (!loaderStore.formReport.title?.trim()) { return }

  // TODO: エラートースト

  await loaderStore.onSave()
  canEditTitle.value = false
}
</script>
