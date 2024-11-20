<template>
  <div class="min-h-screen bg-gray-100 flex justify-center">
    <!-- Mobile container with fixed width -->
    <div class="w-full max-w-md relative bg-white min-h-screen shadow-lg">
      <!-- Scrollable content -->
      <div class="flex-1 overflow-y-auto mb-20">
        <NuxtPage />
      </div>

      <!-- Fixed bottom navigation -->
      <UserBottomNav
        class="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md z-20"
      />
    </div>
  </div>
</template>

<script setup lang="ts"></script>

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
