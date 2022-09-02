import { InjectionKey } from 'nuxt/dist/app/compat/capi'
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

export const useConfigStore = () => {
  const loading = ref<boolean>(false)

  const embed = reactive({
    minZoomSize: 0.5,
    maxZoomSize: 3,
  })

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
  watch(env, () => { loading.value && save() }, { deep: true })

  ///

  const _attachBool = (value: any, defaultValue: any) => {
    if (value === null) { return defaultValue }
    return !!value
  }

  const _attachNumber = (value: any, defaultValue: any) => {
    if (value === null) { return defaultValue }
    return Number(value)
  }

  const load = async () => {
    try {
      loading.value = true

      // win: user\AppData\Roaming\com.tauri.dev\config.yaml
      const text = await readTextFile('config.yaml', { dir: BaseDirectory.App })
      const obj = yamlLoad(text) as any

      env.isDark = _attachBool(obj?.isDark, env.isDark)
      env.useSidebar = _attachBool(obj?.useSidebar, env.useSidebar)
      env.useCalendar = _attachBool(obj?.useCalendar, env.useCalendar)
      env.saveWhenLeave = _attachBool(obj?.saveWhenLeave, env.saveWhenLeave)

      env.editor.lineWrap = _attachBool(obj?.editor?.lineWrap, env.editor.lineWrap)
      env.editor.zoom = _attachNumber(obj?.editor?.zoom, env.editor.zoom)
    } catch (err) {
      /** */
    } finally {
      loading.value = false
    }
  }

  const save = async () => {
    if (loading.value) { return }

    try {
      // win: user\AppData\Roaming\com.tauri.dev\config.yaml
      const text = yamlDump(env)
      await writeTextFile('config.yaml', text, { dir: BaseDirectory.App })
    } catch (err) {
      window.alert(err) // TODO:
    }
  }

  return {
    embed,
    env,

    load,
    save,
  }
}

export type ConfigStore = ReturnType<typeof useConfigStore>

export const ConfigStoreKey: InjectionKey<ConfigStore> =
  (Symbol('ConfigStoreKey'))
