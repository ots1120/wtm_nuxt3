export default defineNuxtRouteMiddleware((to, from) => {
  const { isAuthenticated } = storeToRefs(useAuthStore());

  if (import.meta.client) {
    if (isAuthenticated.value) {
      // 이미 로그인한 경우 경로 이동
      const redirectPath = localStorage.getItem('redirectPath') || '/';
      localStorage.removeItem('redirectPath'); // 사용 후 삭제
      return navigateTo(redirectPath);
    }

    // 로그인되지 않은 경우 경로 저장
    if (!localStorage.getItem('redirectPath')) {
      localStorage.setItem('redirectPath', from.fullPath); // /signin
      console.log('Saved Redirect Path:', from.fullPath);
    }
  }
});
