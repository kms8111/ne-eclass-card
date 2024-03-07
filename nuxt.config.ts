// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      lmsHost: process.env.LMS_HOST,
    },
  },

  ssr: false,
  devtools: {
    enabled: true,
  },

  experimental: {
    typedPages: true,
  },

  nitro: {
    prerender: {
      crawlLinks: true,
    },
  },

  modules: ['@pinia/nuxt', 'nuxt-primevue', '@vueuse/nuxt'],

  css: [
    // 'primevue/resources/themes/lara-light-blue/theme.css',
    'primevue/resources/themes/saga-blue/theme.css',
    'primeicons/primeicons.css',
    '~/assets/scss/main.scss',
  ],

  primevue: {
    options: {
      ripple: true,
      inputStyle: 'filled',
      pt: {},
    },
  },
});
