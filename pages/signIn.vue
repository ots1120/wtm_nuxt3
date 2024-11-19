<template>
  <div class="min-h-screen bg-white">
    <div class="flex justify-center p-4 overflow-hidden">
      <BrandImg class="w-full h-full object-cover" />
    </div>
    <!-- Main Content -->
    <div class="px-4 pt-8">
      <!-- Account Type Toggle -->
      <div class="flex rounded-lg p-1 mb-6">
        <button
          class="flex-1 py-2 px-4 rounded-md text-sm"
          :class="role === 'USER' ? 'bg-slate-100 shadow' : 'text-gray-500'"
          @click="role = 'USER'"
        >
          손님
        </button>
        <button
          class="flex-1 py-2 px-4 rounded-md text-sm"
          :class="role === 'ADMIN' ? 'bg-slate-100 shadow' : 'text-gray-500'"
          @click="role = 'ADMIN'"
        >
          사장님
        </button>
      </div>

      <!-- Login Form -->
      <form class="space-y-4" @submit.prevent="handleSignIn">
        <input
          v-model="username"
          type="email"
          placeholder="이메일을 입력해 주세요."
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <input
          v-model="password"
          type="password"
          placeholder="비밀번호를 입력해 주십시오."
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />

        <button
          type="submit"
          class="w-full text-white py-3 rounded-lg font-medium bg-[#db3d39] hover:bg-[#ba342f] transition-colors"
        >
          로그인
        </button>
        <p
          v-if="loginErrorMessage"
          class="text-red-500 text-center text-sm mt-2"
        >
          {{ loginErrorMessage }}
        </p>
      </form>

      <!-- Social Login -->
      <div v-if="role === 'USER'">
        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gray-500"
                >SNS 계정으로 계속하기</span
              >
            </div>
          </div>
          <div class="mt-6 flex justify-center space-x-6">
            <button
              class="w-12 h-12 rounded-full bg-[#FEE500] hover:bg-[#FDD800] transition-colors flex items-center justify-center"
              aria-label="카카오 계정으로 로그인"
              @click="onKakaoLogin"
            >
              <SocialLoginIconKakao />
            </button>

            <button
              class="w-12 h-12 rounded-full bg-[#03C75A] hover:bg-[#02B351] transition-colors flex items-center justify-center"
              aria-label="네이버 계정으로 로그인"
              @click="onNaverLogin"
            >
              <SocialLoginIconNaver />
            </button>

            <!-- Google Login -->
            <button
              class="w-12 h-12 rounded-full bg-white hover:bg-gray-200 transition-colors flex items-center justify-center border border-gray-200"
              aria-label="구글 계정으로 로그인"
              @click="onGoogleLogin"
            >
              <SocialLoginIconGoogle />
            </button>
          </div>
        </div>
      </div>

      <!-- Links -->
      <div class="mt-6 text-center">
        <p class="text-sm text-gray-600">아직 회원이 아니신가요?</p>

        <NuxtLink :to="toSignUpPage">
          <button class="mt-1 text-sm font-medium text-gray-900 underline">
            회원가입
          </button>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import BrandImg from '~/components/icons/BrandImg.vue';
import SocialLoginIconGoogle from '~/components/icons/SocialLoginIconGoogle.vue';
import SocialLoginIconNaver from '~/components/icons/SocialLoginIconNaver.vue';
import SocialLoginIconKakao from '~/components/icons/SocialLoginIconKakao.vue';

const config = useRuntimeConfig();
const baseApiUrl = config.public.baseApiUrl;

definePageMeta({
  layout: 'login',
  middleware: ['auth-check'],
});
const username = ref('');
const password = ref('');
const role = ref('USER');
const loginErrorMessage = ref('');

const authStore = useAuthStore();

const onKakaoLogin = async () => {
  await navigateTo(`${baseApiUrl}/oauth2/authorization/kakao`, {
    external: true,
  });
};

const onNaverLogin = async () => {
  await navigateTo(`${baseApiUrl}/oauth2/authorization/naver`, {
    external: true,
  });
};

const onGoogleLogin = async () => {
  await navigateTo(`${baseApiUrl}/oauth2/authorization/google`, {
    external: true,
  });
};

const toSignUpPage = computed(() => {
  return role.value === 'USER' ? '/signUp' : '/admin/signUp';
});

const handleSignIn = async () => {
  try {
    await authStore.signIn(username.value, password.value, role.value);

    // 성공 후 페이지 이동
    if (authStore.isUser) {
      await navigateTo('/');
    } else if (authStore.isAdmin) {
      await navigateTo(`/admin/stores/${authStore.storeId}`);
    }
    
  } catch (error) {
    console.log(error);
    loginErrorMessage.value = error.statusMessage || '로그인에 실패했습니다.';
  }
};
</script>
