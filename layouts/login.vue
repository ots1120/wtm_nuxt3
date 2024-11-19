<template>
  <div class="min-h-screen bg-gray-100 flex justify-center">
    <!-- Mobile container with fixed width -->
    <div class="w-full max-w-md relative bg-white min-h-screen shadow-lg">
      <NuxtPage />
    </div>
    <UserBottomNav
      class="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md z-20"
    />
  </div>
</template>

<script setup lang="ts"></script>

<style scoped></style>
