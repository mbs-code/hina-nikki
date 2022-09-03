export const useAppRouter = () => {
  const route = useRoute()
  const router = useRouter()

  const loaderStore = useLoaderStore()

  const editor = async () => {
    if (route.name !== 'index') {
      await router.push({ name: 'index' })
    }
  }

  const tags = async () => {
    if (route.name === 'index' && loaderStore.isDirty) {
      await loaderStore.onSave()
    }

    await router.push({ name: 'tags' })
    await loaderStore.onClose(false)
  }

  const reports = async () => {
    if (route.name === 'index' && loaderStore.isDirty) {
      await loaderStore.onSave()
    }

    await router.push({ name: 'reports' })
    await loaderStore.onClose(false)
  }

  return {
    editor,
    tags,
    reports,
  }
}
