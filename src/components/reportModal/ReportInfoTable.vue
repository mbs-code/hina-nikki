<template>
  <div class="my-1">
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
          <td>{{ tags ?? '-' }}</td>
        </tr>
        <tr>
          <th>行数 / 文字数</th>
          <td>{{ lines?.toLocaleString() ?? '-' }} 行 / {{ size?.toLocaleString() ?? '-' }} 文字</td>
        </tr>
        <tr>
          <th>初回作成日</th>
          <td>{{ createdAt ?? '-' }}</td>
        </tr>
        <tr>
          <th>更新日</th>
          <td>{{ updatedAt ?? '-' }}</td>
        </tr>
        <tr>
          <th>状態</th>
          <td>{{ statusMessage }}</td>
        </tr>
      </tbody>
    </n-table>
    <div :style="{ color: themeVars.iconColor }">
      ※ 保存データを表示しています。
    </div>
  </div>
</template>

<script setup lang="ts">
import { useThemeVars } from 'naive-ui'
import { DateUtil } from '~~/src/utils/DateUtil'
import { TextUtil } from '~~/src/utils/TextUtil'

const loaderStore = useLoaderStore()

/// ////////////////////

const themeVars = useThemeVars()

const report = computed(() => loaderStore.selectedReport)

const tags = computed(() => {
  if (!report.value?.tags?.length) { return undefined }
  return report.value.tags.join(' ')
})

const size = computed(() => {
  const text = report.value?.text
  return TextUtil.charCount(text)
})

const lines = computed(() => {
  const text = report.value?.text
  return TextUtil.lineLength(text)
})

const createdAt = computed(() =>
  DateUtil.formatDisplay(report.value?.createdAt)
)
const updatedAt = computed(() =>
  DateUtil.formatDisplay(report.value?.updatedAt)
)

const statusMessage = computed(() => {
  switch (loaderStore.status) {
    case 'empty' : return '未ロード'
    case 'dirty': return '編集中'
    case 'new': return '新規'
    case 'none': return '保存済み'
  }
})
</script>
