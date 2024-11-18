// stores/auth.ts
import { defineStore } from 'pinia';
import type { UserWithoutPassword } from '~/types/user';

export const useAuthStore = defineStore('auth', () => {
  const authUser = ref<Maybe<UserWithoutPassword>>(null);
  const jwtToken = ref<string | null>(null);

  const setUser = (user: Maybe<UserWithoutPassword>) => {
    authUser.value = user;
  };

  const signIn = async (email: string, password: string, role: string) => {
    try {
      const response = await fetch('/api/v1/auth/user/signIn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username: email, password, role }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw createError({
          statusCode: response.status,
          statusMessage: errorData.message || 'Login failed',
        });
      }

      // 로그인 후 인증 상태 초기화
      await initializeAuth();
    } catch (error: any) {
      throw createError({
        statusCode: error.statusCode || 500,
        statusMessage: error.statusMessage || 'Login failed',
      });
    }
  };

  const initializeAuth = async () => {
    try {
      const response = await fetch('/api/v1/auth/user/me', {
        method: 'GET',
        credentials: 'include', // 쿠키 포함
      });

      if (response.ok) {
        const data = await response.json();
        setUser({
          email: data.username,
          roles: data.roles,
          storeId: data.storeId,
        });
      } else {
        signOut();
      }
    } catch {
      signOut();
    }
  };

  const signOut = async () => {
    try {
      await fetch('/api/v1/auth/signout', {
        method: 'POST',
        credentials: 'include',
      });
      setUser(null);
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return {
    user: authUser,
    token: jwtToken,
    isAuthenticated: computed(() => !!authUser.value),
    isUser: computed(() => authUser.value?.roles.includes('USER') || false),
    isAdmin: computed(() => authUser.value?.roles.includes('ADMIN') || false),
    signIn,
    signOut,
    initializeAuth,
  };
});
