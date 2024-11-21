<template>
  <div class="min-h-screen bg-gray-100 flex justify-center">
    <!-- 모바일 컨테이너 -->
    <div
      class="w-full max-w-md relative bg-white min-h-screen shadow-lg flex flex-col"
    >
      <!-- 콘텐츠 영역 -->
      <NuxtPage class="flex-1 mb-24" />

      <!-- 고정 하단 네비게이션 -->
      <UserBottomNav class="w-full max-w-md z-20 mx-auto" />
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.mt-16 {
  margin-top: 4rem; /* 헤더 높이에 따라 조정 */
}
.mb-20 {
  margin-bottom: 5rem; /* 푸터 높이에 따라 조정 */
}

/* 레이아웃이 최소한 전체 뷰포트 높이를 차지하도록 설정 */
.min-h-screen {
  min-height: 100vh;
}
</style>
