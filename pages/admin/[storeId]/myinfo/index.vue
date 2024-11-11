<template>
  <div>ADMIN storeId : {{ $route.params.storeId }} myInfo</div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  title: '내 식당정보',
});
</script>
<style scoped></style>
