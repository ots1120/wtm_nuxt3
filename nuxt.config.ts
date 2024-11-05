// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  components: true, // 모든 하위 폴더에서 자동 등록 활성화
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
});
