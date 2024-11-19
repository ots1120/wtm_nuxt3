<template>
  <NuxtPage />
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['user-only'],
});

const authStore = useAuthStore();

// 현재 유저 정보 가져오기
const { user } = storeToRefs(authStore);
console.log(user.value); // 유저 정보 출력
</script>

<style scoped></style>
