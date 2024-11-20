<template>
  <div class="min-h-screen bg-black">
    <!-- Main content container -->
    <div class="max-w-md mx-auto relative">
      <!-- Hero image section -->
      <div class="relative h-screen">
        <img
          alt="Korean hot pot dish with side dishes"
          class="w-full h-full object-cover"
        />

        <!-- Overlay gradient -->
        <div
          class="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-90"
        ></div>

        <!-- Content overlay -->
        <div class="absolute bottom-0 left-0 right-0 p-6 space-y-6">
          <!-- Main text -->
          <h1 class="text-white text-2xl font-medium leading-tight">
            매일 맛있는 메뉴로<br />
            든든한 식사하세요!
          </h1>

          <!-- Primary CTA Button -->
          <button
            class="w-full bg-[#FF6B45] text-white py-4 rounded-lg text-lg font-medium hover:bg-[#FF8565] transition-colors"
            @click="toSearch"
          >
            바로 시작하기
          </button>

          <!-- Secondary link -->
          <div class="flex items-center justify-center space-x-2 text-gray-300">
            <span>이미 계정이 있으신가요?</span>
            <button class="text-[#FF6B45] font-medium" @click="toSignIn">
              로그인
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const toSearch = () => {
  navigateTo('/search');
};

const toSignIn = () => {
  navigateTo('/signIn');
};
</script>

<style scoped>
/* Custom font settings for Korean text */
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700&display=swap');

:root {
  font-family: 'Noto Sans KR', sans-serif;
}

/* Smooth transition for interactive elements */
button {
  transition: all 0.2s ease-in-out;
}

button:active {
  transform: scale(0.98);
}
</style>
