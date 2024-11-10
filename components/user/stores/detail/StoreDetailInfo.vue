<template>
  <div>
    <section>
      <h1 class="hidden">Store Detail</h1>
      <div class="h-30 border-b-2 p-2">
        <h2 class="text-xl font-medium">{{ reviewStats.storeName }}</h2>
        <div class="flex items-center">
          <!-- 별 아이콘 -->
          <svg
            class="inline w-5"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <!-- 별 모양 경로 -->
            <path
              d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
              fill="#ffd500"
            />
          </svg>
          <span class="text-sm">{{ reviewStats.averageReviewScore }}</span>
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
