<template>
  <div>
    <div class="p-4">
      <!-- Overall Rating Section -->
      <div class="flex items-center justify-between">
        <div class="text-center mr-6">
          <p class="text-lg font-bold">전체 평점</p>
          <div class="flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6 text-yellow-500 mr-1"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
              />
            </svg>
            <p class="text-4xl font-extrabold">
              {{ reviewStats.overallAverageScore || '0.0' }}
            </p>
          </div>
        </div>

        <!-- Detailed Scores Section -->
        <div class="flex flex-col space-y-3">
          <div
            v-for="(scale, index) in reviewScaleAverages"
            :key="index"
            class="flex items-center space-x-2"
          >
            <span class="w-20 text-gray-600">{{ scale.scaleName }}</span>
            <div class="w-32 h-3 bg-gray-200 rounded-full">
              <div
                :style="{ width: scale.averageScore * 20 + '%' }"
                class="h-full bg-blue-500 rounded-full"
              ></div>
            </div>
            <span class="text-gray-600"
              >{{ scale.averageScore.toFixed(1) }}점</span
            >
          </div>
        </div>
      </div>
    </div>

    <!-- Review Count and View All Button -->
    <div class="flex justify-between border-b border-t p-2">
      <span class="text-sm font-bold">리뷰 {{ reviewCount }}건</span>
      <a href="#" class="text-sm">전체보기</a>
    </div>

    <!-- Reviews List Section -->
    <div
      v-for="(review, index) in reviews"
      :key="index"
      class="border-b border-gray-300 p-4"
    >
      <!-- Review Images Section -->
      <div class="mb-4 flex space-x-2 overflow-x-scroll p-1">
        <div
          v-for="(image, imgIndex) in review.reviewImages"
          :key="imgIndex"
          class="h-24 w-24 flex-shrink-0 rounded bg-gray-300"
        >
          <img
            :src="image"
            :alt="'리뷰 사진 ' + (imgIndex + 1)"
            class="h-full w-full rounded-md object-cover"
          />
        </div>
      </div>

      <!-- Review Info Section -->
      <div class="flex justify-between mb-2">
        <div>
          <div class="flex space-x-1 mb-2">
            <span
              v-for="n in 5"
              :key="n"
              class="text-gray-300 relative"
              style="width: 24px; height: 24px"
            >
              <!-- Empty Star -->
              <span class="block absolute text-gray-300">★</span>
              <!-- Filled Part -->
              <span
                class="block absolute top-0 left-0 text-yellow-500 bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-transparent"
                :style="{
                  width: getStarFillPercentage(review.reviewScore, n) + '%',
                }"
              >
                ★
              </span>
            </span>
          </div>
          <div class="text-sm text-gray-500">
            {{ review.userName }} ·
            {{ calculateDaysAgo(review.reviewRegDate) }}일 전
          </div>
        </div>
        <a href="#" class="text-sm">신고</a>
      </div>

      <!-- Review Content -->
      <p class="mb-4 text-gray-700">{{ review.reviewContent }}</p>

      <!-- Helpful Button -->
      <button
        class="flex items-center space-x-2 border border-gray-300 px-3 py-2 text-gray-500 rounded-full"
        @click="incrementHelpfulCount(index)"
      >
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
        <span>도움돼요</span>
        <span>{{ review.helpfulCount }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useFetch } from '#app';

const storeId = 1; // Replace with dynamic store ID if needed

// Initialize states
const reviewStats = ref({ overallAverageScore: 0, reviewScaleAverages: [] });
const reviewCount = ref(0);
const reviews = ref([]);

// Fetch review count
const { data: reviewCountData, error: reviewCountError } = useFetch(
  `http://localhost:8080/api/v1/stores/${storeId}/review-count`,
);
watch(
  reviewCountData,
  (newValue) => {
    if (newValue) {
      reviewCount.value = newValue.reviewCount;
    }
  },
  { immediate: true },
);

// Fetch review statistics
const { data: reviewStatsData, error: reviewStatsError } = useFetch(
  `http://localhost:8080/api/v1/stores/${storeId}/review-stats`,
);
watch(
  reviewStatsData,
  (newValue) => {
    if (newValue) {
      reviewStats.value.overallAverageScore = newValue.overallAverageScore;
      reviewStats.value.reviewScaleAverages = [
        {
          scaleName: '음식 맛',
          averageScore:
            newValue.reviewScaleAverages.find(
              (scale) => scale.scaleName === 'Taste',
            )?.averageScore || 0,
        },
        {
          scaleName: '분위기',
          averageScore:
            newValue.reviewScaleAverages.find(
              (scale) => scale.scaleName === 'Mood',
            )?.averageScore || 0,
        },
        {
          scaleName: '친절도',
          averageScore:
            newValue.reviewScaleAverages.find(
              (scale) => scale.scaleName === 'Kindness',
            )?.averageScore || 0,
        },
        {
          scaleName: '청결상태',
          averageScore:
            newValue.reviewScaleAverages.find(
              (scale) => scale.scaleName === 'Cleanliness',
            )?.averageScore || 0,
        },
      ];
    }
  },
  { immediate: true },
);

// Fetch reviews
const { data: reviewsData, error: reviewsError } = useFetch(
  `http://localhost:8080/api/v1/stores/${storeId}/reviews`,
);
watch(
  reviewsData,
  (newValue) => {
    if (newValue) {
      reviews.value = newValue.map((review) => ({
        ...review,
        helpfulCount: review.helpfulCount || 0, // Default value
      }));
    }
  },
  { immediate: true },
);

// Computed property for review scale averages
const reviewScaleAverages = computed(
  () => reviewStats.value.reviewScaleAverages || [],
);

// Calculate days ago for reviews
const calculateDaysAgo = (createdAt) => {
  const now = new Date();
  const createdDate = new Date(createdAt);
  const diff = Math.floor((now - createdDate) / (1000 * 60 * 60 * 24));
  return diff;
};

// Calculate star fill percentage
const getStarFillPercentage = (avgScore, starIndex) => {
  const fullStars = Math.floor(avgScore);
  const decimal = avgScore % 1;
  if (starIndex <= fullStars) return 100;
  else if (starIndex === fullStars + 1) return decimal * 100;
  return 0;
};

// Increment helpful count
const incrementHelpfulCount = (index) => {
  reviews.value[index].helpfulCount++;
};

// Log errors if any
if (reviewCountError.value)
  console.error(
    '리뷰 개수 데이터를 로드하는 중 오류 발생:',
    reviewCountError.value,
  );
if (reviewStatsError.value)
  console.error(
    '리뷰 통계 데이터를 로드하는 중 오류 발생:',
    reviewStatsError.value,
  );
if (reviewsError.value)
  console.error('리뷰 데이터를 로드하는 중 오류 발생:', reviewsError.value);
</script>

<style scoped>
/* Additional styling if needed */
</style>
