import { storeToRefs } from 'pinia';

export default defineNuxtRouteMiddleware(() => {
  const { isAdmin, isAuthenticated } = storeToRefs(useAuthStore());

  if (!isAuthenticated.value) {
    return navigateTo('/signIn');
  }

  if (!isAdmin.value) {
    return navigateTo('/');
  }
});
