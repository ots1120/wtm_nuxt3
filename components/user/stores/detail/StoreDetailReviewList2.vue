<template lang="">
  <div class="border-b border-gray-300 p-4">
    <!-- 이미지 섹션 (여러 이미지 가로로 정렬) -->
    <div class="mb-4 flex space-x-2 overflow-x-scroll p-1">
      <div
        v-for="(image, index) in reviewImages"
        :key="index"
        class="h-32 w-32 flex-shrink-0 rounded bg-gray-300"
      >
        <img
          :src="image"
          :alt="'리뷰 사진 ' + (index + 1)"
          class="h-full w-full rounded-md object-cover"
        />
      </div>
    </div>

    <!-- 리뷰 내용 섹션 -->
    <div class="mb-2 flex justify-between">
      <div>
        <!-- 별점 표시 -->
        <div class="mb-2 flex space-x-1">
          <div
            v-for="n in 5"
            :key="n"
            class="text-gray-300 relative"
            style="width: 24px; height: 24px"
          >
            <!-- 빈 별 -->
            <span class="block absolute text-gray-300">★</span>
            <!-- 채워진 부분 -->
            <span
              class="block absolute top-0 left-0 text-yellow-500 bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-transparent"
              :style="{ width: getStarFillPercentage(n) + '%' }"
            >
              ★
            </span>
          </div>
        </div>
        <div class="text-sm text-gray-500">
          {{ reviewerName }} {{ daysAgo }}일 전
        </div>
      </div>
      <div><a href="#">신고</a></div>
    </div>

    <!-- 리뷰 텍스트 -->
    <div class="mb-4">
      <p class="text-gray-700">{{ reviewContent }}</p>
    </div>

    <!-- 도움이 돼요 버튼 -->
    <div>
      <form action="#" method="post">
        <button
          type="submit"
          class="flex items-center space-x-2 rounded-full border border-gray-300 px-3 py-2 text-gray-500"
        >
          <!-- 아이콘 (SVG) -->
          <svg
            class="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M14 9l-6 6m0 0l6 6m-6-6h18" />
          </svg>
          <!-- 텍스트 -->
          <span>도움돼요</span>
          <!-- 숫자 -->
          <span>{{ helpfulCount }}</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    ratingStars: {
      type: Number,
    },
    reviewerName: {
      type: String,
      default: '익명',
    },
    daysAgo: {
      type: Number,
    },
    reviewContent: {
      type: String,
    },
    reviewImages: {
      type: Array,
    },
    helpfulCount: {
      type: Number,
      default: 0,
    },
  },
  methods: {
    // 별이 얼마나 채워질지 퍼센트 계산
    getStarFillPercentage(starIndex) {
      const fullStars = Math.floor(this.ratingStars); // 꽉 찬 별의 개수
      const decimal = this.ratingStars % 1; // 소수점 값

      if (starIndex <= fullStars) {
        return 100; // 꽉 찬 별
      } else if (starIndex === fullStars + 1) {
        return decimal * 100; // 소수점 비율만큼 채운 별
      } else {
        return 0; // 빈 별
      }
    },
  },
};
</script>

<style lang=""></style>
