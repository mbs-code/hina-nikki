import { defineStore } from 'pinia'
import { readTextFile, writeTextFile, BaseDirectory } from '@tauri-apps/api/fs'
import { load as yamlLoad, dump as yamlDump } from 'js-yaml'

export type Config = {
  isDark: boolean
  useSidebar: boolean
  useCalendar: boolean

  saveWhenLeave: boolean
  editor: {
    lineWrap: boolean
    zoom: number
  }
}

export const useConfigStore = defineStore('config', () => {
  const _fileName = 'config.yaml'
  const _loading = ref<boolean>(false)

  // 定数
  const embed = reactive({
    minZoomSize: 0.5,
    maxZoomSize: 3,
  })

  // 変数
  const env = reactive<Config>({
    isDark: false,
    useSidebar: true,
    useCalendar: true,
    saveWhenLeave: true,
    editor: {
      lineWrap: false,
      zoom: 1,
    },
  })

  // auto save
  watch(env, async () => {
    if (!_loading.value) {
      await onSave()
    }
  }, { deep: true })

  /// ////////////////////
  // action

  const onLoad = async () => {
    try {
      _loading.value = true

      // win: user\AppData\Roaming\com.tauri.dev\config.yaml
      const text = await readTextFile(_fileName, { dir: BaseDirectory.App })
      const obj = yamlLoad(text) as any

      env.isDark = _attachBool(obj?.isDark, env.isDark)
      env.useSidebar = _attachBool(obj?.useSidebar, env.useSidebar)
      env.useCalendar = _attachBool(obj?.useCalendar, env.useCalendar)
      env.saveWhenLeave = _attachBool(obj?.saveWhenLeave, env.saveWhenLeave)

      env.editor.lineWrap = _attachBool(obj?.editor?.lineWrap, env.editor.lineWrap)
      env.editor.zoom = _attachNumber(obj?.editor?.zoom, env.editor.zoom)
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err)
      window.alert('設定ファイルの読み込みに失敗しました。')
    } finally {
      _loading.value = false
    }
  }

  const onSave = async () => {
    try {
      // win: user\AppData\Roaming\com.tauri.dev\config.yaml
      const text = yamlDump(env)
      await writeTextFile(_fileName, text, { dir: BaseDirectory.App })
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err)
      window.alert('設定ファイルの保存に失敗しました。')
    }
  }

  return {
    embed: computed(() => embed),
    env,

    onLoad,
    onSave,
  }
})

/// ////////////////////
// Util

const _attachBool = (value: any, defaultValue: any) => {
  if (value === null) { return defaultValue }
  return !!value
}

const _attachNumber = (value: any, defaultValue: any) => {
  if (value === null) { return defaultValue }
  return Number(value)
}
