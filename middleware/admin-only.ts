import { storeToRefs } from 'pinia';

// admin - only.ts;

export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore();
  const { isAdmin, isAuthenticated, user } = storeToRefs(authStore);

  // 예외 경로 설정
  const exemptRoutes = ['/admin/signUp'];

  // 현재 경로가 예외 경로에 포함되면 미들웨어 통과
  if (exemptRoutes.includes(to.path)) {
    return;
  }

  if (!isAuthenticated.value) {
    return navigateTo('/signIn');
  }

  if (!isAdmin.value) {
    return navigateTo('/');
  }

  // storeId를 문자열로 변환
  const storeId = user.value?.storeId?.toString() || null;

  // 라우트의 storeId와 비교
  if (to.params.storeId && to.params.storeId !== storeId) {
    console.warn(`Mismatched storeId: ${to.params.storeId}`);
    return navigateTo(`/admin/stores/${storeId}`);
  }
});
