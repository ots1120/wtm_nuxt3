export default defineNuxtRouteMiddleware((to) => {
  const { isAuthenticated } = storeToRefs(useAuthStore());

  if (process.client) {
    if (isAuthenticated.value) {
      // 이미 로그인한 경우 경로 이동
      const redirectPath = localStorage.getItem('redirectPath') || '/';
      localStorage.removeItem('redirectPath'); // 사용 후 삭제
      return navigateTo(redirectPath);
    }

    // 로그인되지 않은 경우 경로 저장
    if (!localStorage.getItem('redirectPath')) {
      localStorage.setItem('redirectPath', to.fullPath);
      console.log('Saved Redirect Path:', to.fullPath);
    }
  }
});
