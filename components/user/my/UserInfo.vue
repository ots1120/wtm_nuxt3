<template>
  <div class="max-w-[1080px] mx-auto">
    <div class="flex items-center p-6 border-b border-gray-200">
      <div class="w-20 h-20 bg-gray-200 rounded-full flex-shrink-0 mr-6">
        <!-- Placeholder for profile picture -->
        <div
          class="w-full h-full rounded-full bg-gray-300 flex items-center justify-center"
        ></div>
      </div>
      <div class="flex flex-col">
        <span class="text-2xl font-bold text-gray-900 mb-1">{{
          name || '사용자'
        }}</span>
        <span class="text-gray-600">{{ email || 'email@example.com' }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  name: String,
  email: String,
});
</script>
