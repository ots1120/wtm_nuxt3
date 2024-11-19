<template>
  <div class="flex flex-col">
    <!-- Main Navigation -->
    <nav class="p-6 flex items-center justify-center">
      <div class="grid grid-cols-3 gap-6 w-full max-w-sm">
        <router-link
          v-for="(link, index) in links"
          :key="index"
          :to="link.to"
          class="flex flex-col items-center justify-center p-4 rounded-xl transition duration-300 ease-in-out"
          :class="[
            route.path.includes(link.to)
              ? 'bg-orange-300 text-white'
              : 'bg-orange-300 text-gray-800 hover:bg-gray-600 hover:text-white',
          ]"
        >
          <svg
            v-if="link.to === 'tickets/create'"
            class="w-12 h-12 mb-3"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="16" />
            <line x1="8" y1="12" x2="16" y2="12" />
          </svg>
          <svg
            v-else-if="link.to === 'tickets/usage'"
            class="w-12 h-12 mb-3"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <line x1="6" y1="10" x2="18" y2="10" />
          </svg>
          <svg
            v-else-if="link.to === 'tickets/charge'"
            class="w-12 h-12 mb-3"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <rect x="2" y="6" width="20" height="12" rx="2" />
            <circle cx="12" cy="12" r="2" />
            <path d="M6 12h.01M18 12h.01" />
          </svg>
          <span class="text-sm font-medium">{{ link.text }}</span>
        </router-link>
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
const route = useRoute();

const links = [
  { to: 'tickets/create', text: '식권 생성' },
  { to: 'tickets/usage', text: '식권 사용' },
  { to: 'tickets/charge', text: '식권 충전' },
];

onBeforeMount(() => {
  route.meta.title = '식권관리';
});

definePageMeta({
  layout: 'admin',
});
</script>
