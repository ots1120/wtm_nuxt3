// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  modules: ['@nuxtjs/tailwindcss'],
  typescript: { typeCheck: true },
  devtools: { enabled: true },
  tailwindcss: {
    // viewer: { endpoint: '/_tailwind', exportViewer: true },
  },
  css: [
    '~/assets/css/reset.css',
    '~/assets/css/font.css',
    '~/assets/css/styles.css',
  ],
  components: true,
});
