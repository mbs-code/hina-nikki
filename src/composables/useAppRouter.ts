export const useAppRouter = () => {
  const route = useRoute()
  const router = useRouter()
  const loaderCtx = inject(LoaderCtxKey)

  const _saveBeforeRouting = async () => {
    // 今のページがエディタなら保存をかける
    // TODO: 自動保存
    if (route.name === 'index' && loaderCtx.isDirty) {
      await loaderCtx.save()
      await loaderCtx.close(false)
    }
  }

  ///

  const editor = async () => {
    if (route.name !== 'index') {
      await router.push({ name: 'index' })
    }
  }

  const tags = async () => {
    await _saveBeforeRouting()
    await router.push({ name: 'tags' })
  }

  const reports = async () => {
    await _saveBeforeRouting()
    await router.push({ name: 'reports' })
  }

  return {
    editor,
    tags,
    reports,
  }
}
