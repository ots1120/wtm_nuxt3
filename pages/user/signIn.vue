<template>
  <div class="min-h-screen bg-white">
    <div class="flex justify-between items-center p-4">
      <img alt="WTM" class="mx-auto" />
    </div>
    <!-- Main Content -->
    <div class="px-4 pt-8">
      <!-- Account Type Toggle -->
      <div class="flex rounded-lg bg-gray-100 p-1 mb-6">
        <button
          class="flex-1 py-2 px-4 rounded-md text-sm"
          :class="accountType === 'user' ? 'bg-white shadow' : 'text-gray-500'"
          @click="accountType = 'user'"
        >
          손님
        </button>
        <button
          class="flex-1 py-2 px-4 rounded-md text-sm"
          :class="accountType === 'admin' ? 'bg-white shadow' : 'text-gray-500'"
          @click="accountType = 'admin'"
        >
          사장님
        </button>
      </div>

      <!-- Login Form -->
      <form class="space-y-4" @submit.prevent="signIn">
        <input
          v-model="email"
          type="email"
          placeholder="아이디(이메일)을 입력해 주십시오."
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
          class="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors"
        >
          로그인
        </button>
      </form>

      <!-- Social Login -->
      <div class="mt-6 space-y-4">
        <button
          class="w-full bg-[#FEE500] text-black py-3 rounded-lg font-medium hover:bg-[#FDD800] transition-colors flex items-center justify-center"
          @click="onKakaoLogin"
        >
          <span class="text-xl font-bold mr-2">KAKAO</span>
          카카오 로그인
        </button>
        <button
          class="w-full bg-[#03C75A] text-white py-3 rounded-lg font-medium hover:bg-[#02B351] transition-colors flex items-center justify-center"
          @click="onNaverLogin"
        >
          <span class="text-xl font-bold mr-2">NAVER</span>
          네이버 로그인
        </button>
        <button
          class="w-full bg-[#03C75A] text-white py-3 rounded-lg font-medium hover:bg-[#02B351] transition-colors flex items-center justify-center"
          @click="onGoogleLogin"
        >
          <span class="text-xl font-bold mr-2">GOOGLE</span>
          구글 로그인
        </button>
      </div>

      <!-- Other Login Methods -->
      <div class="mt-6">
        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-white text-gray-500"
              >다른 계정으로 계속하기</span
            >
          </div>
        </div>

        <div class="mt-6 flex justify-center space-x-6">
          <div class="w-12 h-12 rounded-full bg-gray-200"></div>
          <div class="w-12 h-12 rounded-full bg-gray-200"></div>
          <div class="w-12 h-12 rounded-full bg-gray-200"></div>
        </div>
      </div>

      <!-- Links -->
      <div class="mt-6 text-center">
        <p class="text-sm text-gray-600">아직 회원이 아니신가요?</p>

        <NuxtLink to="/user/signUp">
          <button class="mt-1 text-sm font-medium text-gray-900 underline">
            회원가입
          </button>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'login',
});

const router = useRouter();
const accountType = ref('user');
const email = ref('');
const password = ref('');

const onKakaoLogin = () => {
  // window.location.href = 'http://localhost:8080/login/oauth2/code/kakao';
  window.location.href = 'http://localhost:8080/oauth2/authorization/kakao';
};

const onNaverLogin = () => {
  window.location.href = 'http://localhost:8080/oauth2/authorization/naver';
};

const onGoogleLogin = () => {
  window.location.href = 'http://localhost:8080/oauth2/authorization/google';
};

const data = () => {
  fetch('http://localhost:8080/user', {
    method: 'GET',
  })
    .then((res) => res.json())
    .then((data) => {
      alert(data);
    })
    .catch((error) => alert(error));
};
console.log(data);
</script>
