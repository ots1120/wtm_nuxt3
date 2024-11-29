import { useAuthStore } from '~/stores/auth';

export default defineNuxtPlugin(() => {
  const authStore = useAuthStore();

  // auth 초기화 이후 Promise가 완료된 이후에 라우팅 처리
  return authStore.initializeAuth();
});
