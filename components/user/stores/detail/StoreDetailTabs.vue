<template>
  <div class="w-full flex justify-around border-b">
    <NuxtLink
      :to="`/stores/${storeId}/home`"
      :class="{ 'text-blue-500 border-blue-500': isActiveTab('home') }"
      class="px-4 py-2 border-b-2"
    >
      홈
    </NuxtLink>
    <NuxtLink
      :to="`/stores/${storeId}/menu`"
      :class="{ 'text-blue-500 border-blue-500': isActiveTab('menu') }"
      class="px-4 py-2 border-b-2"
    >
      메뉴
    </NuxtLink>
    <NuxtLink
      :to="`/stores/${storeId}/tickets`"
      :class="{ 'text-blue-500 border-blue-500': isActiveTab('tickets') }"
      class="px-4 py-2 border-b-2"
    >
      식권
    </NuxtLink>
    <NuxtLink
      :to="`/stores/${storeId}/reviews`"
      :class="{ 'text-blue-500 border-blue-500': isActiveTab('reviews') }"
      class="px-4 py-2 border-b-2"
    >
      리뷰
    </NuxtLink>
    <NuxtLink
      :to="`/stores/${storeId}/notices`"
      :class="{ 'text-blue-500 border-blue-500': isActiveTab('notices') }"
      class="px-4 py-2 border-b-2"
    >
      공지
    </NuxtLink>
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
/* 추가 스타일로 아래 내용을 적용하여 탭이 화면 전체를 차지하도록 함 */
.w-full {
  width: 100%;
}
</style>
