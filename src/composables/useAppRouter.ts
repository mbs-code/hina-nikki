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
    if (route.name !== 'tags') {
      await router.push({ name: 'tags' })
      await loaderStore.onClose()
    }
  }

  const reports = async () => {
    if (route.name !== 'reports') {
      await router.push({ name: 'reports' })
      await loaderStore.onClose()
    }
  }

  return {
    editor,
    tags,
    reports,
  }
}
