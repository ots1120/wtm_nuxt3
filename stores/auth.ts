// stores/auth.ts
import { defineStore } from 'pinia';
import type { UserWithoutPassword } from '~/types/user';

export const useAuthStore = defineStore('auth', () => {
  const config = useRuntimeConfig();
  const baseApiUrl = config.public.baseApiUrl;

  const authUser = ref<Maybe<UserWithoutPassword>>(null);
  const jwtToken = ref<string | null>(null);

  const setUser = (user: Maybe<UserWithoutPassword>) => {
    authUser.value = user;
  };

  const signIn = async (username: string, password: string, role: string) => {
    try {
      const response = await fetch(`${baseApiUrl}/api/v1/auth/signIn`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password, role }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw createError({
          statusCode: response.status,
          statusMessage: errorData.message || '로그인 실패',
        });
      }

      // 로그인 후 인증 상태 초기화
      // await initializeAuth();
    } catch (error: any) {
      throw createError({
        statusCode: error.statusCode || 500,
        statusMessage: error.statusMessage || '로그인 실패',
      });
    }
  };
  const initializeAuth = async () => {
    try {
      const response = await fetch(`${baseApiUrl}/api/v1/auth/me`, {
        method: 'GET',
        credentials: 'include', // 쿠키 포함
      });

      if (response.ok) {
        const data = await response.json();
        setUser({
          username: data.username,
          role: data.role,
          storeId: data.storeId,
          userId: data.userId,
        });
      } else if (response.status === 401) {
        // 만료된 토큰 처리
        console.warn('JWT token expired or user not authenticated');
        setUser(null);
      } else {
        throw new Error('User not authenticated');
      }
    } catch (error) {
      console.error('Error during initializeAuth:', error);
      setUser(null);
    }
  };

  const signOut = async () => {
    try {
      await fetch(`${baseApiUrl}/api/v1/auth/signout`, {
        method: 'POST',
        credentials: 'include',
      });
      setUser(null);
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const storeId = computed(() => authUser.value?.storeId || null);
  const userId = computed(() => authUser.value?.userId || null);

  return {
    user: authUser,
    token: jwtToken,
    storeId,
    userId,
    isAuthenticated: computed(() => !!authUser.value),
    isUser: computed(() => authUser.value?.role === 'USER'),
    isAdmin: computed(() => authUser.value?.role === 'ADMIN'),
    signIn,
    signOut,
    initializeAuth,
  };
});
