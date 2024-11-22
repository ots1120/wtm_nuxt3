import { storeToRefs } from 'pinia';

export default defineNuxtRouteMiddleware(() => {
  const { isUser, isAuthenticated } = storeToRefs(useAuthStore());

  // 예외 경로 설정
  const exemptRoutes = ['/admin/signUp'];
  if (!isAuthenticated.value) {
    return navigateTo('/signIn');
  }

  if (!isUser.value) {
    return navigateTo('/signIn');
  }
});
