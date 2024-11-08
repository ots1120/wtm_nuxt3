<template>
  <div>ADMIN storeId : {{ $route.params.storeId }}</div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  title: '식당 정보', // title 변경되는 페이지 마다 변경해줄 것
});
</script>

<style scoped></style>
