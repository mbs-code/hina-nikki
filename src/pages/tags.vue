<template>
  <div>
    <n-spin :show="loading">
      <TagTable
        :tags="tags"
        style="height: calc(100vh - 60px)"
        @edit="openEditDialog"
        @search="onSearchHashtag"
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

const selectedTag = ref<Tag>()
const showEditDialog = ref<boolean>(false)
const openEditDialog = (tag?: Tag) => {
  selectedTag.value = tag
  showEditDialog.value = true
}

const onSearchHashtag = async (tag: Tag) => {
  console.log('search')
  await explorerStore.onSearchByHashtag(tag.name)
}
</script>
