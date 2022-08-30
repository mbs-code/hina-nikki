<template>
  <div class="h-full flex flex-col">
    <div class="p-2 flex items-center gap-2">
      <div class="flex items-center gap-1" style="height: 28px">
        <n-icon size="16">
          <Document />
        </n-icon>

        <span>{{ title }}</span>
      </div>

      <n-button
        v-for="(hashtag, _) of hashtags"
        :key="_"
        size="small"
        @click="onSearchHashtag(hashtag)"
      >
        <template #icon>
          <n-icon><PricetagOutline /></n-icon>
        </template>
        {{ hashtag }}
      </n-button>
    </div>

    <div class="flex items-center gap-1">
      <n-tooltip trigger="hover" placement="top">
        <template #trigger>
          <n-button
            size="small"
            :type="configStore.env.editor.lineWrap ? 'primary' : 'default'"
            strong
            @click="toggleLineWrap()"
          >
            <template #icon>
              <n-icon><ReturnDownBackSharp /></n-icon>
            </template>
          </n-button>
        </template>
        折り返し設定
      </n-tooltip>
    </div>

    <div class="grow">
      <TextEditor />
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  PricetagOutline,
  Document,
  ReturnDownBackSharp,
} from '@vicons/ionicons5'

const loaderCtx = inject(LoaderCtxKey)
const searchCtx = inject(SearchCtxKey)
const configStore = inject(ConfigStoreKey)

// startup
onMounted(async () => {
  // 今日を表示する // TODO: ここ？
  await loaderCtx.loadByToday()
})

const title = computed(() => loaderCtx.formReport?.title ?? '---')
const hashtags = computed(() => loaderCtx.selectedReport.value?.tags ?? [])

///

const onSearchHashtag = async (hashtag: string) => {
  await searchCtx.onSearch({
    match: hashtag,
    hashtags: [hashtag],
  })
}

///

const toggleLineWrap = () => {
  configStore.env.editor.lineWrap = !configStore.env.editor.lineWrap
}
</script>
