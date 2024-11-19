import { storeToRefs } from 'pinia';

export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore();
  const { isAdmin, isAuthenticated, user } = storeToRefs(authStore);

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
