// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  modules: ['@nuxtjs/tailwindcss'],
  typescript: { typeCheck: true },
  devtools: { enabled: true },
  tailwindcss: {
    // viewer: { endpoint: '/_tailwind', exportViewer: true },
  },
  css: ['~/assets/css/reset.css', '~/assets/css/font.css'],
  runtimeConfig: {
    public: {
      naverMapClientId: import.meta.env.NAVER_MAP_CLIENT_ID,
      apiBase: 'http://localhost:8080', // 실제 서버 주소로 추후 변경
    },
  },
});
