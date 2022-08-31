<template>
  <n-modal
    v-model:show="_show"
    title="ノート情報"
    preset="dialog"
    :block-scroll="false"
    style="width: 600px;"
  >
    <div class="flex flex-col gap-2">
      <n-table :single-line="false" stripe size="small">
        <tbody>
          <tr>
            <th style="width: 170px">
              内部ID
            </th>
            <td>{{ report?.id ?? '-' }}</td>
          </tr>
          <tr>
            <th>タイトル</th>
            <td>{{ report?.title ?? '-' }}</td>
          </tr>
          <tr>
            <!-- TODO: タグクリックできるように -->
            <th>タグ</th>
            <td>{{ report?.tags?.join(' ') ?? '-' }}</td>
          </tr>
          <tr>
            <th>行数 / 文字数</th>
            <td>{{ lines?.toLocaleString() ?? '-' }} 行 / {{ length?.toLocaleString() ?? '-' }} 文字</td>
          </tr>
          <tr>
            <th>初回作成日</th>
            <td>{{ createdAt ?? '-' }}</td>
          </tr>
          <tr>
            <th>更新日</th>
            <td>{{ updatedAt ?? '-' }}</td>
          </tr>
        </tbody>
      </n-table>

      <TitleEditCard />
    </div>
  </n-modal>
</template>

<script setup lang="ts">
import { DateUtil } from '~~/src/utils/DateUtil'

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

///

const loaderCtx = inject(LoaderCtxKey)

const report = computed(() => loaderCtx.selectedReport.value)

const length = computed(() => report.value?.text?.length)

const lines = computed(() => {
  if (!report.value?.text) { return undefined }

  const res = (report.value?.text ?? '').match(/\r\n|\n/g)
  return (res ? res.length : 0) + 1
})

const createdAt = computed(() =>
  DateUtil.formatDisplay(report.value?.createdAt)
)
const updatedAt = computed(() =>
  DateUtil.formatDisplay(report.value?.updatedAt)
)
</script>
