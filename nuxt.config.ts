import vuetify from 'vite-plugin-vuetify';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  css: ['@/assets/styles/main.scss'],
  modules: ['@pinia/nuxt', '@nuxtjs/tailwindcss', '@nuxt/eslint'],

  build: {
    transpile: ['vuetify'],
  },
  vite: {
    ssr: {
      noExternal: ['vuetify'],
    },
    plugins: [vuetify()],
  },
});