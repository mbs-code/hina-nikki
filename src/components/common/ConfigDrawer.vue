<template>
  <n-drawer
    v-model:show="_show"
    :width="502"
    placement="right"
  >
    <n-drawer-content title="設定">
      <n-form
        size="small"
        label-placement="left"
        label-align="left"
        label-width="120px"
        @submit.prevent
      >
        <n-form-item label="ダークテーマ">
          <n-switch v-model:value="configStore.env.isDark" />
        </n-form-item>

        <n-card title="エディタ設定" size="small">
          <n-form-item label="右端で折り返す">
            <n-switch v-model:value="configStore.env.editor.lineWrap" />
          </n-form-item>

          <n-form-item label="印刷ガイドの表示">
            <n-switch v-model:value="configStore.env.editor.printMargin" />
          </n-form-item>

          <n-form-item label="フォントサイズ">
            <n-input-number
              v-model:value="configStore.env.editor.fontSize"
              :min="configStore.embed.minFontSize"
              :max="48"
            />
          </n-form-item>

          <n-form-item label="Tabサイズ" path="sliderValue">
            <n-input-number
              v-model:value="configStore.env.editor.tabSize"
              :min="1"
            />
          </n-form-item>
        </n-card>
      </n-form>
    </n-drawer-content>
  </n-drawer>
</template>

<script setup lang="ts">
const props = defineProps<{
  show: boolean,
}>()

const emit = defineEmits<{ // eslint-disable-line func-call-spacing
  (e: 'update:show', val: boolean): void
}>()

const _show = computed({
  get: () => props.show,
  set: (val: boolean) => emit('update:show', val),
})

const configStore = inject(ConfigStoreKey)
</script>
