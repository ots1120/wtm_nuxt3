import { storeToRefs } from 'pinia';

export default defineNuxtRouteMiddleware(() => {
  const { isUser, isAuthenticated } = storeToRefs(useAuthStore());

  // 예외 경로   설정
  const exemptRoutes = ['/admin/signUp'];
  if (!isAuthenticated.value) {
    return navigateTo('/signIn');
  }

  // user 가 들어갈수 있는 페이지는 모두 admin도 들어갈수 있어야해서 아래 조건 삭제함

  // if (!isUser.value) {
  //   return navigateTo('/signIn');
  // }
});
