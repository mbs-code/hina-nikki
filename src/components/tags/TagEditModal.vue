<template>
  <n-modal
    v-model:show="_show"
    :title="tag?.id ? 'タグ編集' : 'タグ作成'"
    preset="dialog"
    :block-scroll="false"
    style="width: 500px;"
    :mask-closable="false"
  >
    <n-spin :show="loading">
      <n-form
        label-placement="left"
        label-align="left"
        label-width="140px"
        :show-feedback="false"
        @submit.prevent
      >
        <div class="flex flex-col gap-2">
          <n-form-item label="タグ名">
            <n-input ref="autofocusRef" v-model:value="form.name" placeholder="#xxxxxx" />
          </n-form-item>

          <n-form-item label="色">
            <InputColorPicker v-model:value="form.color" />
          </n-form-item>

          <n-form-item label="ピンどめ">
            <n-switch v-model:value="form.isPinned">
              <template #checked-icon>
                <n-icon :component="Checkmark" />
              </template>
            </n-switch>
          </n-form-item>

          <n-form-item label="優先度">
            <n-input-number
              v-model:value="form.order"
              class="w-full"
              :min="0"
              step="10"
            />
          </n-form-item>

          <n-form-item class="mt-4" label=" ">
            <div class="w-full flex gap-4">
              <n-button type="primary" @click="onSubmit">
                保存
              </n-button>

              <n-button @click="onInit">
                リセット
              </n-button>

              <div class="flex-grow" />

              <n-button v-if="tag?.id" type="error" tertiary @click="onRemove">
                削除
              </n-button>
            </div>
          </n-form-item>
        </div>
      </n-form>
    </n-spin>
  </n-modal>
</template>

<script setup lang="ts">
import { Checkmark } from '@vicons/ionicons5'
import { useDialog, useMessage } from 'naive-ui'
import { TagAPI } from '~~/src/apis/TagAPI'
import { FormTag, Tag } from '~~/src/databases/models/Tag'

const message = useMessage()
const dialog = useDialog()

const props = defineProps<{
  show: boolean,
  tag?: Tag,
}>()

const emit = defineEmits<{ // eslint-disable-line func-call-spacing
  (e: 'update:show', val: boolean): void,
  (e: 'saved', val: Tag): void,
  (e: 'deleted', val: Tag): void,
}>()

const _show = computed({
  get: () => props.show,
  set: (val: boolean) => emit('update:show', val),
})

/// ////////////////////

const loading = ref<boolean>(false)
const autofocusRef = ref()

const form = reactive<FormTag>({
  name: '',
  color: null,
  isPinned: false,
  order: 0,
})

const onInit = () => {
  form.name = props.tag?.name || ''
  form.color = props.tag?.color || null
  form.isPinned = props.tag?.isPinned || false
  form.order = props.tag?.order || 0

  nextTick(() => autofocusRef.value?.focus())
}

watch(_show, val => val && onInit())

const onSubmit = async () => {
  loading.value = true

  try {
    const pid = props.tag?.id
    const saveTag = pid
      ? await TagAPI.update(pid, { ...form })
      : await TagAPI.create({ ...form })

    message.success(`保存しました (${saveTag.id})`)
    emit('saved', saveTag)
    _show.value = false
  } catch (err) {
    message.error(err.toString())
  } finally {
    loading.value = false
  }
}

const onRemove = () => {
  dialog.error({
    title: '警告',
    content: 'タグを削除します。',
    positiveText: 'OK',
    negativeText: 'キャンセル',
    onPositiveClick: async () => {
      loading.value = true

      try {
        const pid = props.tag?.id
        if (pid) {
          await TagAPI.remove(pid)

          message.success(`削除しました (${pid})`)
          emit('deleted', props.tag)
          _show.value = false
        }
      } catch (err) {
        message.error(err.toString())
      } finally {
        loading.value = false
      }
    },
  })
}
</script>
