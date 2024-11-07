<template>
  <div class="flex flex-col m-5 items-center">
    <UserHeader :title="pageTitle" />
    <NuxtPage />
    <UserBottomNav />
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const pageTitle = computed(() => route.meta?.title as string);
</script>

<style scoped></style>
