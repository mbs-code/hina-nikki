import { InjectionKey } from 'nuxt/dist/app/compat/capi'
import { readTextFile, writeTextFile, BaseDirectory } from '@tauri-apps/api/fs'
import { load as yamlLoad, dump as yamlDump } from 'js-yaml'
import { EditorCtx } from '~~/src/composables/useEditorCtx'

export type Config = {
  isDark: boolean
  editor: {
    lineWrap: boolean
    fontSize: number
    tabSize: number
  }
}

export const useConfigStore = (editorCtx: EditorCtx) => {
  const isLoading = ref<boolean>(false)

  const embed = reactive({
    minFontSize: 8,
  })

  const env = reactive<Config>({
    isDark: false,
    editor: {
      lineWrap: false,
      fontSize: 14,
      tabSize: 2,
    },
  })

  watch(() => env.editor.lineWrap, (value: boolean) => {
    editorCtx.setLineWrap(value)
  })

  // TODO: 設定 オートセーブ、debounceをする
  watch(env, () => { save() })

  ///

  const _attachConfig = () => {
    editorCtx.setLineWrap(env.editor.lineWrap)
    editorCtx.setTabSize(env.editor.tabSize)
  }

  const load = async () => {
    try {
      isLoading.value = true

      // win: user\AppData\Roaming\com.tauri.dev\config.yaml
      const text = await readTextFile('config.yaml', { dir: BaseDirectory.App })
      const obj = yamlLoad(text) as any

      env.isDark = obj?.isDark ? Boolean(obj.isDark) : env.isDark
      env.editor.lineWrap = obj?.editor?.lineWrap ? Boolean(obj.editor.lineWrap) : env.editor.lineWrap
      env.editor.fontSize = obj?.editor?.fontSize ? Number(obj.editor.fontSize) : env.editor.fontSize
      env.editor.tabSize = obj?.editor?.tabSize ? Number(obj.editor.tabSize) : env.editor.tabSize

      _attachConfig()
    } catch (err) {
      /** */
    } finally {
      isLoading.value = false
    }
  }

  const save = async () => {
    if (isLoading.value) { return }

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
