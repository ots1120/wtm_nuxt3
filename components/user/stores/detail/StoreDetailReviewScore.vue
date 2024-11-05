<template lang="">
  <div class="flex items-center justify-between space-x-8 p-4">
    <!-- 전체 평점 -->
    <div class="flex items-center space-x-2">
      <div>
        <p class="ml-2 text-lg font-bold">전체 평점</p>
        <div class="ju flex items-center justify-between">
          <!-- Star Icon -->
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 text-yellow-500"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
            />
          </svg>
          <p class="text-4xl font-extrabold">4.8</p>
        </div>
      </div>
    </div>

    <!-- 상세 평점 -->
    <div class="flex flex-col space-y-4">
      <RatingBar :title="'음식 맛'" :score="4.9" />
      <RatingBar :title="'음식 맛'" :score="4.9" />
      <RatingBar :title="'음식 맛'" :score="4.9" />
      <RatingBar :title="'음식 맛'" :score="4.9" />
    </div>
  </div>
</template>
<script>
import RatingBar from '@/components/user/ui/RatingBar.vue';

export default {
  components: {
    RatingBar,
  },
};
</script>
<style lang=""></style>
