<template>
  <div class="w-full bg-white shadow-md">
    <nav class="flex justify-between border-b">
      <NuxtLink
        :to="`/stores/${storeId}/home`"
        :class="[
          'flex-1 text-center py-3',
          isActiveTab('home')
            ? 'text-blue-600 border-b-2 border-blue-600 font-semibold'
            : 'text-gray-600',
        ]"
      >
        홈
      </NuxtLink>
      <NuxtLink
        :to="`/stores/${storeId}/menu`"
        :class="[
          'flex-1 text-center py-3',
          isActiveTab('menu')
            ? 'text-blue-600 border-b-2 border-blue-600 font-semibold'
            : 'text-gray-600',
        ]"
      >
        메뉴
      </NuxtLink>
      <NuxtLink
        :to="`/stores/${storeId}/tickets`"
        :class="[
          'flex-1 text-center py-3',
          isActiveTab('tickets')
            ? 'text-blue-600 border-b-2 border-blue-600 font-semibold'
            : 'text-gray-600',
        ]"
      >
        식권
      </NuxtLink>
      <NuxtLink
        :to="`/stores/${storeId}/reviews`"
        :class="[
          'flex-1 text-center py-3',
          isActiveTab('reviews')
            ? 'text-blue-600 border-b-2 border-blue-600 font-semibold'
            : 'text-gray-600',
        ]"
      >
        리뷰
      </NuxtLink>
      <NuxtLink
        :to="`/stores/${storeId}/notices`"
        :class="[
          'flex-1 text-center py-3',
          isActiveTab('notices')
            ? 'text-blue-600 border-b-2 border-blue-600 font-semibold'
            : 'text-gray-600',
        ]"
      >
        공지
      </NuxtLink>
    </nav>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';

const route = useRoute();
const storeId = route.params.storeId;

function isActiveTab(tab) {
  return route.path.endsWith(`/${tab}`);
}
</script>

<style scoped>
/* 애플 스타일 탭 바를 위한 추가 스타일 */
nav {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}
</style>
