<template>
  <n-drawer
    v-model:show="_show"
    :width="400"
    placement="right"
  >
    <n-drawer-content title="設定">
      <n-form
        size="small"
        label-placement="left"
        label-align="left"
        label-width="140px"
        :show-feedback="false"
        @submit.prevent
      >
        <div class="flex flex-col gap-2">
          <n-card title="デザイン" size="small">
            <div class="flex flex-col gap-2">
              <n-form-item label="ダークテーマ">
                <n-switch v-model:value="configStore.env.isDark" />
              </n-form-item>

              <n-form-item label="サイドバーを表示する">
                <n-switch v-model:value="configStore.env.useSidebar" />
              </n-form-item>

              <n-form-item label="カレンダーを使用する">
                <n-switch v-model:value="configStore.env.useCalendar" />
              </n-form-item>
            </div>
          </n-card>

          <n-card title="エディタ設定" size="small">
            <div class="flex flex-col gap-2">
              <n-form-item label="右端で折り返す">
                <n-switch v-model:value="configStore.env.editor.lineWrap" />
              </n-form-item>

              <n-form-item label="ズーム率">
                <n-input-number
                  v-model:value="configStore.env.editor.zoom"
                  :min="configStore.embed.minZoomSize"
                  :max="configStore.embed.maxZoomSize"
                  step="0.1"
                />
              </n-form-item>
            </div>
          </n-card>

          <n-card size="small" :bordered="false">
            <div class="flex flex-col gap-2">
              <!-- <n-form-item label="移動時に自動保存する">
                <n-switch v-model:value="configStore.env.saveWhenLeave" />
              </n-form-item> -->

              <n-form-item label="隠された機能">
                <n-switch v-model:value="isDebug" />
              </n-form-item>

              <n-form-item>
                <div class="flex items-center gap-4">
                  <n-button v-if="isDebug" type="error" @click="onDBWipe">
                    DBの初期化
                  </n-button>
                </div>
              </n-form-item>
            </div>
          </n-card>
        </div>
      </n-form>
    </n-drawer-content>
  </n-drawer>
</template>

<script setup lang="ts">
import { useDialog } from 'naive-ui'
import { Database } from '~~/src/databases/Database'
import { useConfigStore } from '~~/src/stores/useConfigStore'

const configStore = useConfigStore()

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

/// ////////////////////
/// DB周り

// const Database = inject(DatabaseKey)

const isDebug = ref<boolean>()

const dialog = useDialog()
const onDBWipe = () => {
  dialog.error({
    title: '警告',
    content: 'DBのデータは全て削除されます。',
    positiveText: 'OK',
    negativeText: 'キャンセル',
    onPositiveClick: async () => {
      // TODO: バックアップ用意してもいいかも、github式確認画面でもいいかも
      await Database.dbWipe()
      window.location.reload()
    },
  })
}
</script>
