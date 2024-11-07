<template>
  <div>
    <section>
      <h1 class="hidden">Store Detail</h1>
      <div class="h-30 border-b-2 p-2">
        <h2 class="text-xl font-medium">{{ reviewStats.name }}</h2>
        <div class="flex items-center">
          <svg
            class="inline w-5"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <!-- SVG 아이콘 경로 -->
            <path d="..." fill="#ffd500" />
          </svg>
          <span class="text-sm">{{ reviewStats.rating }}</span>
          <span class="ml-2 text-sm text-blue-300"
            >리뷰 {{ reviewStats.reviewCount }}개</span
          >
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
defineProps({
  reviewStats: {
    type: Object,
    required: true,
  },
});
</script>

<style scoped>
/* Tailwind CSS만 사용하므로 별도의 CSS 스타일은 없습니다 */
</style>
