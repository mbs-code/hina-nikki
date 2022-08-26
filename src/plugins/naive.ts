import naive from 'naive-ui'

// ref: https://www.naiveui.com/en-US/os-theme/docs/import-on-demand
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(naive)
})
