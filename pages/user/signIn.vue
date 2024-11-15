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

const config = useRuntimeConfig;
const baseApiUrl = config.public.baseApiUrl;

definePageMeta({
  layout: 'login',
});
const username = ref('');
const password = ref('');
const role = ref('USER');
const loginErrorMessage = ref('');

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
  return role.value === 'USER' ? '/user/signUp' : '/admin/signUp';
});

const handleSignIn = async () => {
  try {
    const response = await fetch(`${baseApiUrl}/api/v1/auth/user/signIn`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // 쿠키를 포함하여 요청
      body: JSON.stringify({
        username: username.value,
        password: password.value,
        role: role.value, // role 추가
      }),
    });
    console.log(response);
    if (!response.ok) {
      const errorData = await response.json();
      console.log(errorData);
      if (errorData.message === 'Role mismatch') {
        loginErrorMessage.value = '선택한 계정 유형과 일치하지 않습니다.';
      } else {
        loginErrorMessage.value =
          '로그인에 실패했습니다. 이메일이나 패스워드를 확인하고 다시 시도해 주세요.';
      }
      throw new Error(errorData.message);
    }

    // 헤더에서 토큰을 추출
    const token = response.headers.get('Authorization');
    if (token) {
      // 로컬 스토리지에 저장 (또는 다른 저장소 사용 가능)
      localStorage.setItem('Authorization', token);
      console.log('토큰 저장 완료:', token);
    } else {
      console.warn('Authorization 헤더가 없습니다.');
    }
    // 로그인 성공 후 Nuxt의 navigateTo로 user role에 따라 홈 경로로 이동
    if (role.value === 'USER') await navigateTo('/');
    else if (role.value === 'ADMIN') await navigateTo('/admin/dashboard');
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message); // 'message' 프로퍼티에 접근 가능
    } else {
      console.log('Unknown error occurred');
    }
  }
};
</script>
