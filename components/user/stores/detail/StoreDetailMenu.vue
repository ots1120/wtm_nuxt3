<template>
  <div class="flex-col text-center">
    <h2 class="">오늘의 메뉴</h2>
    <div class="m-auto w-1/2 rounded-2xl border-0 bg-slate-200">
      <p v-for="(menuItem, index) in menu" :key="index">{{ menuItem }}</p>
    </div>
  </div>
</template>
<script setup>
const { menu = ['김치찌개', '된장찌개', '불고기'] } = defineProps({
  menu: {
    type: Array,
    required: true,
  },
});
</script>
<style></style>
