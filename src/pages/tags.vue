<template>
  <div>
    <n-spin :show="loading">
      <TagTable
        :tags="tags"
        style="height: calc(100vh - 60px)"
        @edit="openEditDialog"
        @search="onSearchHashtag"
        @remove:unused="onRemoveUnusedTag"
      />
    </n-spin>

    <TagEditModal
      v-model:show="showEditDialog"
      :tag="selectedTag"
      @saved="fetchTags"
      @deleted="fetchTags"
    />
  </div>
</template>

<script setup lang="ts">
import { useMessage } from 'naive-ui'
import { Tag } from '~~/src/databases/models/Tag'
import { TagAPI } from '~~/src/apis/TagAPI'
import { ReportAPI } from '~~/src/apis/ReportAPI'

const message = useMessage()
const explorerStore = useExplorerStore()

const loading = ref<boolean>(false)
const tags = ref<Tag[]>([])

const fetchTags = async () => {
  loading.value = false

  try {
    tags.value = await TagAPI.getAll({
      sorts: [['is_pinned', 'desc'], ['order', 'desc'], ['id', 'asc']],
    })
  } catch (err) {
    message.error(err.toString())
  } finally {
    loading.value = false
  }
}

onMounted(() => fetchTags())

///

const onRemoveUnusedTag = async () => {
  let deleteCnt = 0

  // タグ一つ一つ検索していく
  for (const tag of tags.value) {
    // ピンがあるものは削除しない
    if (!tag.isPinned) {
      const exists = await ReportAPI.getAll({
        hashtags: [tag.name],
      })
      if (exists.length === 0) {
        await TagAPI.remove(tag.id)
        deleteCnt++
      }
    }
  }

  message.success(`${deleteCnt} 個のタグを削除しました`)
  await fetchTags()
}

///

const selectedTag = ref<Tag>()
const showEditDialog = ref<boolean>(false)
const openEditDialog = (tag?: Tag) => {
  selectedTag.value = tag
  showEditDialog.value = true
}

const onSearchHashtag = async (tag: Tag) => {
  await explorerStore.onSearchByHashtag(tag.name)
}
</script>
