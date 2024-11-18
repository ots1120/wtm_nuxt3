<template>
  <div class="h-screen flex flex-col overflow-hidden">
    <!-- Header -->
    <header
      class="fixed top-0 left-1/2 transform -translate-x-1/2 w-full max-w-lg h-16 flex items-center px-4"
    >
      <UserHeader :title="pageTitle" />
    </header>

    <!-- Scrollable Content -->
    <main class="flex-grow mt-14 mb-16 overflow-y-auto w-full max-w-lg mx-auto">
      <!-- 컨텐츠 영역 -->
      <div class="p-4">
        <NuxtPage />
      </div>
    </main>

    <!-- Bottom Navigation -->
    <footer
      class="fixed bottom-5 left-1/2 transform -translate-x-1/2 w-full max-w-lg h-16 z-10 flex items-center"
    >
      <UserBottomNav />
    </footer>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const pageTitle = computed(() => route.meta?.title as string);
</script>

<style scoped></style>
