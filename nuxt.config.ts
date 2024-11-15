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
      baseApiUrl: import.meta.env.BASE_API_URL, // 실제 서버 주소로 추후 변경
      qrSecretKey: process.env.QR_SECRET_KEY,
    },
    script: [
      // 다음 주소 검색 API
      { src: '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js' },
    ],
    devServer: {
      host: '0.0.0.0',
      port: 3000,
    },
  },
});
