<template>
  <div class="min-h-screen bg-gray-100 flex justify-center">
    <!-- Mobile container with fixed width -->
    <div class="w-full max-w-md bg-white min-h-screen shadow-lg">
      <!-- Header -->
      <AdminHeader
        :title="pageTitle"
        class="fixed top-0 left-1/2 transform -translate-x-1/2 w-full max-w-md z-20"
      />
      <!-- Scrollable content -->
      <div class="flex-1 overflow-y-auto mt-16 mb-20">
        <NuxtPage />
      </div>

      <!-- Fixed bottom navigation -->
      <AdminBottomNav
        class="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md z-20"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const pageTitle = computed(() => route.meta?.title as string);
</script>
<style scoped>
.mt-16 {
  margin-top: 4rem; /* Adjust based on your header height */
}
.mb-20 {
  margin-bottom: 5rem; /* Adjust based on your footer height */
}

/* Ensure the layout takes up at least the full viewport height */
.min-h-screen {
  min-height: 100vh;
}
</style>
