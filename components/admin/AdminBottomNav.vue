<template>
  <div
    class="w-full bg-white pt-2 pb-4 flex justify-evenly shadow-md fixed bottom-0 left-0 right-0"
  >
    <NuxtLink
      :to="`/admin/stores/${storeId}`"
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
          class="lucide lucide-layout-dashboard w-6 h-6"
        >
          <rect width="7" height="9" x="3" y="3" rx="1" />
          <rect width="7" height="5" x="14" y="3" rx="1" />
          <rect width="7" height="9" x="14" y="12" rx="1" />
          <rect width="7" height="5" x="3" y="16" rx="1" />
        </svg>
      </span>
      <span class="text-xs font-medium text-gray-600">대시보드</span>
    </NuxtLink>
    <NuxtLink
      :to="`/admin/stores/${storeId}/menus`"
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
          class="lucide lucide-utensils w-6 h-6"
        >
          <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
          <path d="M7 2v20" />
          <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
        </svg>
      </span>
      <span class="text-xs font-medium text-gray-600">메뉴 관리</span>
    </NuxtLink>
    <NuxtLink
      :to="`/admin/stores/${storeId}/storeInfo`"
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
      <span class="text-xs font-medium text-gray-600">식당 정보</span>
    </NuxtLink>
  </div>
</template>
<script setup lang="ts">
const route = useRoute();
const storeId = route.params.storeId;
</script>
<style></style>
