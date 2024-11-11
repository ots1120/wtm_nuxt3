<template>
  <div class="flex m-5 flex-col items-center">
    <AdminHeader :title="pageTitle" />
    <NuxtPage class="w-full" />
    <AdminBottomNav />
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const pageTitle = computed(() => route.meta?.title as string);
</script>

<style scoped></style>
