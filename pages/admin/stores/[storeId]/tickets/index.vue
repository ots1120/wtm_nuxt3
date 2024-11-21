<template>
  <div class="flex flex-col">
    <!-- Main Navigation -->
    <nav class="p-4 flex items-center justify-center">
      <div class="grid grid-cols-3 gap-4 w-full max-w-md">
        <router-link
          v-for="(link, index) in links"
          :key="index"
          :to="link.to"
          class="flex flex-col items-center justify-center p-4 border-[0.5px] rounded-lg shadow-sm transition duration-300 ease-in-out"
          :class="[
            route.path.includes(link.to)
              ? 'bg-gray-100 text-blue-600 shadow-md'
              : 'bg-white text-gray-800 hover:bg-gray-100 hover:shadow-md',
          ]"
        >
          <!-- SVG 아이콘 -->
          <template v-if="link.to === 'tickets/create'">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="w-8 h-8 mb-2 text-gray-600"
            >
              <path d="m4.5 8 10.58-5.06a1 1 0 0 1 1.342.488L18.5 8" />
              <path d="M6 10V8" />
              <path d="M6 14v1" />
              <path d="M6 19v2" />
              <rect x="2" y="8" width="20" height="13" rx="2" />
            </svg>
          </template>
          <template v-else-if="link.to === 'tickets/usage'">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="w-8 h-8 mb-2 text-gray-600"
            >
              <path
                d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"
              />
              <path d="M9 12h6" />
            </svg>
          </template>
          <template v-else-if="link.to === 'tickets/charge'">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="w-8 h-8 mb-2 text-gray-600"
            >
              <path
                d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"
              />
              <path d="M9 12h6" />
              <path d="M12 9v6" />
            </svg>
          </template>
          <!-- 메뉴 텍스트 -->
          <span class="text-xs font-medium text-gray-700">{{ link.text }}</span>
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
