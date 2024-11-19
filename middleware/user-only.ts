import { storeToRefs } from 'pinia';

export default defineNuxtRouteMiddleware(() => {
  const { isUser, isAuthenticated } = storeToRefs(useAuthStore());

  if (!isAuthenticated.value) {
    return navigateTo('/signIn');
  }

  if (!isUser.value) {
    return navigateTo('/signIn');
  }
});
