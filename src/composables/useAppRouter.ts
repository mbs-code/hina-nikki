export const useAppRouter = () => {
  const route = useRoute()
  const router = useRouter()
  const loaderCtx = inject(LoaderCtxKey) // TODO

  const editor = async () => {
    if (route.name !== 'index') {
      await router.push({ name: 'index' })
    }
  }

  const tags = async () => {
    if (route.name === 'index' && loaderCtx.isDirty) {
      await loaderCtx.save()
    }

    await router.push({ name: 'tags' })
    await loaderCtx.close(false)
  }

  const reports = async () => {
    if (route.name === 'index' && loaderCtx.isDirty) {
      await loaderCtx.save()
    }

    await router.push({ name: 'reports' })
    await loaderCtx.close(false)
  }

  return {
    editor,
    tags,
    reports,
  }
}
