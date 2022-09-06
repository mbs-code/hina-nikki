<template>
  <div>
    <TagTable
      :tags="tags"
      @edit="openEditDialog"
    />

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

const tags = ref<Tag[]>([])

const fetchTags = async () => {
  tags.value = await TagAPI.getAll({})
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
