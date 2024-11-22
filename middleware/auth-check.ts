export default defineNuxtRouteMiddleware((to, from) => {
  const { isAuthenticated } = storeToRefs(useAuthStore());
  const redirectPath = ref('');

  if (import.meta.client) {
    if (isAuthenticated.value) {
      // 이미 로그인한 경우 경로 이동
      redirectPath.value = localStorage.getItem('redirectPath') || '/';

      if (redirectPath.value === '/signin') {
        localStorage.removeItem('redirectPath'); // 사용 후 삭제
        return navigateTo('/');
      }

      localStorage.removeItem('redirectPath'); // 사용 후 삭제
      return navigateTo(redirectPath.value);
    } else if (!localStorage.getItem('redirectPath')) {
      console.log(from.fullPath);
      if (from.fullPath === '/signin') {
        console.log('from path is /signin :' + from.fullPath);
        return navigateTo('/');
      }
      localStorage.setItem('redirectPath', from.fullPath); //
      console.log('Saved Redirect Path:', from.fullPath);
    }
  }
});
