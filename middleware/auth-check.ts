export default defineNuxtRouteMiddleware(() => {
  const { isAuthenticated } = storeToRefs(useAuthStore());

  if (isAuthenticated.value) {
    // 이미 로그인한 사용자는 `/`로 리다이렉트
    return navigateTo('/');
  }
});
