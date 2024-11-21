export default defineNuxtRouteMiddleware(async (to, from) => {
  const authStore = useAuthStore(); // Pinia 스토어 가져오기
  const isAuthenticated = authStore.isAuthenticated;
  const isUser = authStore.isUser;
  const isAdmin = authStore.isAdmin;

  // 인증 초기화 (첫 진입 시)
  if (!authStore.user) {
    await authStore.initializeAuth();
  }

  // 인증 및 인가 규칙
  const guestRoutes = [
    '/',
    '/signIn',
    '/signUp',
    '/stores',
    '/stores/[storeId]/home',
    '/stores/[storeId]/menu',
    '/stores/[storeId]/reviews',
    '/stores/[storeId]/notices',
  ];

  const userRoutes = [
    '/my',
    '/my/bookmarks',
    '/my/reviews',
    '/my/settings',
    '/my/tickets',
    '/my/tickets/history',
    '/my/tickets/stores/[storeId]',
    '/my/tickets/stores/[storeId]/history',
    '/stores/[storeId]/menu/new',
    '/stores/[storeId]/reviews/new',
    '/stores/[storeId]/tickets',
  ];

  const adminRoutes = [
    '/admin/signup',
    '/admin/stores/[storeId]',
    '/admin/stores/[storeId]/menus',
    '/admin/stores/[storeId]/myinfo',
    '/admin/stores/[storeId]/notices',
    '/admin/stores/[storeId]/tickets',
    '/admin/stores/[storeId]/reviews',
  ];

  // 게스트 전용 라우트
  if (guestRoutes.some((path) => to.path.startsWith(path))) {
    return; // 게스트는 접근 가능
  }

  // 유저 전용 라우트
  if (userRoutes.some((path) => to.path.startsWith(path))) {
    if (!isAuthenticated || !isUser) {
      return navigateTo('/signIn'); // 유저가 아니면 로그인 페이지로 이동
    }
    return;
  }

  // 관리자 전용 라우트
  if (adminRoutes.some((path) => to.path.startsWith(path))) {
    if (!isAuthenticated || !isAdmin) {
      return navigateTo('/'); // 관리자가 아니면 메인 페이지로 이동
    }
    return;
  }

  // 기본 접근 처리 (허용되지 않은 경우)
  if (!isAuthenticated) {
    return navigateTo('/signIn'); // 인증되지 않은 사용자 처리
  }
});
