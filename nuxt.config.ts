import { defineNuxtConfig } from 'nuxt'
import eslint from 'vite-plugin-eslint'

const isProduct = process.env.NODE_ENV === 'production'

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  srcDir: 'src/',
  ssr: false,
  target: 'static',

  app: {
    head: {
      script: [
        !isProduct && { src: 'http://localhost:8098' }, // vue devtools
      ],
    },
  },

  css: ['@/assets/index.scss'],

  modules: ['nuxt-windicss', '@vueuse/nuxt', '@pinia/nuxt'],

  build: {
    transpile: ['kysely'],
  },

  components: [{
    path: '~/components',
    pathPrefix: false,
  }],

  vite: {
    plugins: [eslint({ fix: true })],
  },
})
