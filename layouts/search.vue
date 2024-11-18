<template>
  <div class="h-screen flex flex-col overflow-hidden">
    <!-- 상단 헤더 -->
    <header
      class="fixed top-0 left-0 right-0 mx-auto w-full max-w-lg h-16 flex items-center px-4 z-20 bg-white dark:bg-gray-900 shadow-md"
    >
      <UserSearchHeader />
    </header>

    <!-- 페이지 콘텐츠와 하단 네비게이션을 포함하는 영역 -->
    <div
      class="pb-24 z-50 flex-grow w-full max-w-lg mx-auto overflow-y-auto pt-16"
    >
      <!-- 페이지 콘텐츠 -->
      <NuxtPage />
    </div>

    <!-- 하단 네비게이션 -->
    <footer
      class="sticky bottom-0 left-0 w-full max-w-lg h-32 flex items-center bg-white dark:bg-gray-900 shadow-md z-10 mx-auto"
    >
      <UserBottomNav />
    </footer>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped></style>
