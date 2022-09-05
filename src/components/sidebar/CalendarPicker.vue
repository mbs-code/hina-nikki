<template>
  <n-card size="small">
    <div class="flex flex-col gap-1">
      <!-- ヘッダ -->
      <div class="flex items-center gap-2">
        <n-button size="tiny" class="cell-item" @click="onPrevYear">
          <template #icon>
            <n-icon :component="ArrowBack" />
          </template>
        </n-button>
        <n-button size="tiny" class="cell-item" @click="onPrevMonth">
          <template #icon>
            <n-icon :component="ChevronBack" />
          </template>
        </n-button>

        <n-button size="tiny" quaternary class="flex-grow cell-item" @click="onToday">
          {{ yearMonth }}
        </n-button>

        <n-button size="tiny" class="cell-item" @click="onNextMonth">
          <template #icon>
            <n-icon :component="ChevronForward" />
          </template>
        </n-button>
        <n-button size="tiny" class="cell-item" @click="onNextYear">
          <template #icon>
            <n-icon :component="ArrowForward" />
          </template>
        </n-button>
      </div>

      <!-- 週要素 -->
      <div class="flex gap-2">
        <div v-for="(dd, _) of weekHeaders" :key="_" class="cell-item">
          {{ dd }}
        </div>
      </div>

      <!-- カレンダー -->
      <div class="flex flex-col gap-2">
        <div v-for="(ww, _) of dateMap" :key="_" class="flex gap-2">
          <template v-for="(dd, __) of ww" :key="`${_}-${__}`">
            <n-badge class="cell-item" dot type="info">
              <n-button
                v-bind="dd.buttonBind"
                size="tiny"
                class="cell-item"
                @click="onClickDate(dd)"
              >
                <!-- quaternary -->
                <template #icon>
                  {{ dd.day }}
                </template>
              </n-button>
            </n-badge>
          </template>
        </div>
      </div>
    </div>
  </n-card>
</template>

<script setup lang="ts">
import { startOfMonth, addDays, isSameMonth, isSameDay, startOfWeek, format, addYears, addMonths } from 'date-fns' // eslint-disable-line import/no-duplicates
import { ja } from 'date-fns/locale' // eslint-disable-line import/no-duplicates
import { ArrowBack, ArrowForward, ChevronBack, ChevronForward } from '@vicons/ionicons5'

const props = defineProps<{
  date?: Date,
}>()

const emit = defineEmits<{ // eslint-disable-line func-call-spacing
  (e: 'update:date', val?: Date): void,
}>()

const _selectedDate = computed({
  get: () => props.date,
  set: (val?: Date) => emit('update:date', val)
})

/// ////////////////////

// const selectedDate = ref<Date>(new Date()) // 選択
const innerDate = ref<Date>(new Date()) // 表示している基準
const startWod = ref<0 | 2 | 3 | 1 | 4 | 5 | 6>(1) // 週の開始曜日

type DateParams = {
  date: Date,
  day: number,
  buttonBind: { [key: string]: unknown },
}

/// ////////////////////

const yearMonth = computed(() => format(innerDate.value, 'yyyy年M月'))

const weekHeaders = computed(() => {
  return [...new Array(7)]
    .map((_, i) => {
      let idx = i - startWod.value
      if (idx < 0) { idx = 7 + idx }
      return idx
    })
    .map(i => ja.localize.day(i, { width: 'short' }))
})

const dateMap = computed(() => {
  // 左上要素を検索
  const startOfMonthDate = startOfMonth(innerDate.value)
  const wod = startOfMonthDate.getDay()
  let add = startWod.value - wod
  if (add > 0) { add = add - 7 }

  let ptr = startOfWeek(startOfMonthDate, { locale: ja, weekStartsOn: startWod.value })

  // 週 x 曜日 で回してカレンダーを生成
  const now = new Date()
  const ww: DateParams[][] = []
  for (let w = 0; w < 6; w++) {
    const dd: DateParams[] = []
    for (let d = 0; d < 7; d++) {
      // ボタンの属性作成
      const bind: { [key: string]: unknown } = {}
      const isSelected = _selectedDate.value
        ? isSameDay(ptr, _selectedDate.value)
        : false

      if (isSelected) { // 選択
        bind.type = 'primary'
      } else if (isSameDay(ptr, now)) { // 今日
        bind.type = 'primary'
        bind.secondary = true
      } else if (isSameMonth(ptr, innerDate.value)) { // 同月
        bind.tertiary = true
      } else { // 他月
        bind.quaternary = true
      }

      dd.push({
        date: ptr,
        day: ptr.getDate(),
        buttonBind: bind,
      })
      ptr = addDays(ptr, 1)
    }
    ww.push(dd)
  }

  return ww
})

///

const onClickDate = (params: DateParams) => {
  _selectedDate.value = isSameDay(_selectedDate.value, params.date)
    ? undefined
    : params.date
}

const onPrevYear = () => (innerDate.value = addYears(innerDate.value, -1))
const onPrevMonth = () => (innerDate.value = addMonths(innerDate.value, -1))
const onToday = () => (innerDate.value = new Date())
const onNextMonth = () => (innerDate.value = addMonths(innerDate.value, 1))
const onNextYear = () => (innerDate.value = addYears(innerDate.value, 1))
</script>

<style scoped lang="scss">
.n-card {
  width: 265px;
}

.cell-item {
  width: 26px;
  height: 26px;
  min-width: 26px;
  min-height: 26px;
  text-align: center;
  text-justify: middle;
}

.n-badge ::v-deep(.n-badge-sup) {
  width: 5px;
  height: 5px;
  min-width: 5px;
  bottom: calc(100% - 3px);
}
</style>
