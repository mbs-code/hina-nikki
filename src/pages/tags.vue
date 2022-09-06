<template>
  <div>
    <n-spin :show="loading">
      <TagTable
        :tags="tags"
        @edit="openEditDialog"
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
import { Tag } from '~~/src/databases/models/Tag'
import { TagAPI } from '~~/src/apis/TagAPI'
import { useMessage } from 'naive-ui'

const message = useMessage()

const loading = ref<boolean>(false)
const tags = ref<Tag[]>([])

const fetchTags = async () => {
  loading.value = false

  try {
    tags.value = await TagAPI.getAll({})
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
</script>
