import { storeToRefs } from 'pinia';

export default defineNuxtRouteMiddleware(() => {
  const { isUser, isAuthenticated } = storeToRefs(useAuthStore());
  if (isAuthenticated.value) {
    if (import.meta.server) return navigateTo('/');
    return abortNavigation();
  }
});
