<template>
  <div
    class="w-full bg-white pt-2 pb-6 flex justify-evenly shadow-md fixed bottom-0 left-0 right-0"
  >
    <NuxtLink to="/" class="flex flex-col items-center">
      <span class="p-2 mb-1">
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
          class="lucide lucide-house w-6 h-6"
        >
          <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
          <path
            d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
          />
        </svg>
      </span>
      <span class="text-xs font-medium text-gray-600">홈</span>
    </NuxtLink>
    <NuxtLink
      v-if="authStore.user?.role == 'USER' || authStore.isUser == false"
      to="/my/tickets"
      class="flex flex-col items-center"
    >
      <span class="p-2 mb-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="lucide lucide-tickets w-6 h-6"
        >
          <path d="m4.5 8 10.58-5.06a1 1 0 0 1 1.342.488L18.5 8" />
          <path d="M6 10V8" />
          <path d="M6 14v1" />
          <path d="M6 19v2" />
          <rect x="2" y="8" width="20" height="13" rx="2" />
        </svg>
      </span>
      <span class="text-xs font-medium text-gray-600">식권</span>
    </NuxtLink>
    <NuxtLink
      v-if="authStore.user?.role == 'USER' || authStore.isUser == false"
      to="/my/bookmarks"
      class="flex flex-col items-center"
    >
      <span class="p-2 mb-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="lucide lucide-bookmark w-6 h-6"
        >
          <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
        </svg>
      </span>
      <span class="text-xs font-medium text-gray-600">북마크</span>
    </NuxtLink>
    <NuxtLink
      v-if="authStore.user?.role == 'USER'"
      to="/my"
      class="flex flex-col items-center"
    >
      <span class="p-2 mb-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="lucide lucide-user-round w-6 h-6"
        >
          <circle cx="12" cy="8" r="5" />
          <path d="M20 21a8 8 0 0 0-16 0" />
        </svg>
      </span>
      <span class="text-xs font-medium text-gray-600">내정보</span>
    </NuxtLink>
    <NuxtLink
      v-else-if="authStore.userId == null"
      to="/signIn"
      class="flex flex-col items-center"
    >
      <span class="p-2 mb-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="lucide lucide-log-in w-6 h-6"
        >
          <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
          <polyline points="10 17 15 12 10 7" />
          <line x1="15" x2="3" y1="12" y2="12" />
        </svg>
      </span>
      <span class="text-xs font-medium text-gray-600">로그인</span>
    </NuxtLink>
    <NuxtLink
      v-if="authStore.user?.role == 'ADMIN'"
      to="/admin/stores/${storeId}"
      class="flex flex-col items-center"
    >
      <span class="p-2 mb-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="lucide lucide-user-round-cog w-6 h-6"
        >
          <path d="M2 21a8 8 0 0 1 10.434-7.62" />
          <circle cx="10" cy="8" r="5" />
          <circle cx="18" cy="18" r="3" />
          <path d="m19.5 14.3-.4.9" />
          <path d="m16.9 20.8-.4.9" />
          <path d="m21.7 19.5-.9-.4" />
          <path d="m15.2 16.9-.9-.4" />
          <path d="m21.7 16.5-.9.4" />
          <path d="m15.2 19.1-.9.4" />
          <path d="m19.5 21.7-.4-.9" />
          <path d="m16.9 15.2-.4-.9" />
        </svg>
      </span>
      <span class="text-xs font-medium text-gray-600">관리자 전환</span>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore(); // Pinia 스토어 가져오기
</script>

<style scoped>
/* 필요한 스타일이 있으면 여기에 작성하세요 */
</style>
