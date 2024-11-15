<!-- components/NavigationBar.vue -->
<template>
  <nav class="bg-gray-800 p-4">
    <ul class="flex space-x-4">
      <li>
        <router-link
          to="tickets/create"
          class="text-white hover:text-gray-300"
          active-class="underline"
        >
          식권 생성
        </router-link>
      </li>
      <li>
        <router-link
          to="tickets/usage"
          class="text-white hover:text-gray-300"
          active-class="underline"
        >
          식권 사용
        </router-link>
      </li>
      <li>
        <router-link
          to="tickets/charge"
          class="text-white hover:text-gray-300"
          active-class="underline"
        >
          식권 충전
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';

const route = useRoute();

onBeforeMount(() => {
  route.meta.title = '식권관리';
});

definePageMeta({
  layout: 'admin',
});
</script>

<style scoped>
/* 네비게이션 바 스타일 */
</style>
