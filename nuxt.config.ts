import { defineNuxtConfig } from 'nuxt'

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  srcDir: 'src/',
  ssr: false,
  target: 'static',

  css: ['@/assets/index.scss'],

  modules: ['nuxt-windicss'],

  build: {
    transpile: ['kysely'],
  },
})
