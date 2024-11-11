<template>
  <div>
    <div class="p-4">
      <!-- Overall Rating Section -->
      <div class="flex items-center justify-between">
        <div class="text-center mr-6">
          <p class="text-lg font-bold">전체 평점</p>
          <div class="flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-yellow-500 mr-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
            <p class="text-4xl font-extrabold">
              {{ reviewStats.overallAverageScore || '0.0' }}
            </p>
          </div>
        </div>

        <!-- Detailed Scores Section -->
        <div class="flex flex-col space-y-3">
          <div v-for="(scale, index) in reviewScaleAverages" :key="index" class="flex items-center space-x-2">
            <span class="w-20 text-gray-600">{{ scale.scaleName }}</span>
            <div class="w-32 h-3 bg-gray-200 rounded-full">
              <div :style="{ width: scale.averageScore * 20 + '%' }" class="h-full bg-blue-500 rounded-full"></div>
            </div>
            <span class="text-gray-600">{{ scale.averageScore.toFixed(1) }}점</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Review Count and View All Button -->
    <div class="flex justify-between border-b border-t p-2">
      <span class="text-sm font-bold">리뷰 {{ reviewCount }}건</span>
      <a href="#" class="text-sm">전체보기</a>
    </div>

    <div>
      <button @click="sortReviews('newest')" class="text-sm px-2 py-1 rounded" :class="{ 'bg-blue-500 text-white': sortBy === 'newest', 'bg-gray-200': sortBy !== 'newest' }">최신순</button>
      <button @click="sortReviews('rating')" class="text-sm px-2 py-1 rounded" :class="{ 'bg-blue-500 text-white': sortBy === 'rating', 'bg-gray-200': sortBy !== 'rating' }">평점순</button>
    </div>
 

    <!-- Reviews List Section -->
    <div v-for="(review, index) in reviews" :key="index" class="border-b border-gray-300 p-4">
      <!-- Review Images Slider Section -->
      <div v-if="review.reviewImages && review.reviewImages.length > 0" class="relative overflow-hidden rounded-lg shadow-lg mb-4 w-64 h-64">
        <div class="flex transition-transform duration-300 ease-in-out" :style="{ transform: `translateX(-${currentImageIndex[index] * 100}%)` }">
          <div v-for="(image, imgIndex) in review.reviewImages" :key="imgIndex" class="w-full flex-shrink-0">
            <img :src="image.url" :alt="'리뷰 사진 ' + (imgIndex + 1)" class="w-full h-full object-cover rounded-md" />
          </div>
        </div>
        <!-- Navigation Buttons -->
        <div class="absolute inset-0 flex items-center justify-between p-4">
          <button class="p-2 rounded-full bg-white bg-opacity-50 text-gray-800 hover:bg-opacity-75 focus:outline-none transition-colors duration-200" @click="prevImage(index)">
            <ChevronLeft class="w-6 h-6" />
            <span class="sr-only">Previous slide</span>
          </button>
          <button class="p-2 rounded-full bg-white bg-opacity-50 text-gray-800 hover:bg-opacity-75 focus:outline-none transition-colors duration-200" @click="nextImage(index, review.reviewImages.length)">
            <ChevronRight class="w-6 h-6" />
            <span class="sr-only">Next slide</span>
          </button>
        </div>
      </div>

      <!-- Review Info Section -->
      <div class="flex justify-between mb-2">
        <div>
          <div class="flex space-x-1 mb-2">
            <span v-for="n in 5" :key="n" class="text-gray-300 relative" style="width: 24px; height: 24px">
              <!-- Empty Star -->
              <span class="block absolute text-gray-300">★</span>
              <!-- Filled Part -->
              <span class="block absolute top-0 left-0 text-yellow-500" :style="{ width: getStarFillPercentage(review.reviewScore, n) + '%', overflow: 'hidden' }">★</span>
            </span>
          </div>
          <div class="text-sm text-gray-500">
            <!-- 이미지와 가게 이름 -->
            <div class="flex items-center mb-2">
              <img :src="review.userProfilePicture" alt="User Image" class="w-10 h-10 rounded-full mr-2" />
              <span class="font-medium">{{ review.userName }}</span>
            </div>
            {{ calculateDaysAgo(review.reviewRegDate) }}일 전
          </div>
        </div>
        <a href="#" class="text-sm">신고</a>
      </div>

      <!-- Review Content -->
      <p class="mb-4 text-gray-700">{{ review.reviewContent }}</p>

      <!-- Replies Section -->
      <div v-if="review.reviewComments && review.reviewComments.length">
        <div v-for="(reply, replyIndex) in review.reviewComments" :key="replyIndex" class="ml-6 p-3 bg-gray-100 rounded-lg mb-2">
          <div class="flex items-center justify-between mb-1">
            <span class="text-sm font-semibold">{{ reply.adminName }}</span>
            <span class="text-xs text-gray-400">{{ calculateDaysAgo(reply.commentDate) }}일 전</span>
          </div>
          <p class="text-sm text-gray-700">{{ reply.commentContent }}</p>
        </div>
      </div>

      <!-- Helpful Button -->
      <button class="flex items-center space-x-2 border border-gray-300 px-3 py-2 text-gray-500 rounded-full" @click="incrementHelpfulCount(index)">
        <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M14 9l-6 6m0 0l6 6m-6-6h18" />
        </svg>
        <span>도움돼요</span>
        <span>{{ review.helpfulCount }}</span>
      </button>
    </div>

    <!-- 리뷰 쓰기 버튼 -->
    <div class="fixed bottom-10 w-full flex justify-center z-10">
      <button class="flex items-center space-x-2 bg-orange-500 text-white px-6 py-3 rounded-full font-semibold" @click="goToReviewPage">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14M12 5l7 7-7 7" />
        </svg>
        <span>리뷰 쓰기</span>
      </button>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, watch } from 'vue';
import { useFetch } from '#app';
import { useRouter, useRoute } from 'vue-router';
import { ChevronLeft, ChevronRight } from 'lucide-vue-next';

const router = useRouter();
const route = useRoute();

const storeId = route.params.storeId;
const sortBy = ref('newest'); // 정렬 기준 상태: 최신순('newest') 또는 평점순('rating')

const reviewStats = ref({ overallAverageScore: 0, reviewScaleAverages: [] });
const reviewCount = ref(0);
const reviews = ref([]);

// 슬라이더를 위한 이미지 인덱스 배열
const currentImageIndex = ref([]); // 각 리뷰의 이미지 슬라이드 인덱스 초기화

const goToReviewPage = () => {
  router.push(`/stores/${storeId}/reviews/new`);
};

// 슬라이드 내비게이션 함수들
const nextImage = (reviewIndex, imageLength) => {
  currentImageIndex.value[reviewIndex] = (currentImageIndex.value[reviewIndex] + 1) % imageLength;
};

const prevImage = (reviewIndex) => {
  currentImageIndex.value[reviewIndex] = (currentImageIndex.value[reviewIndex] - 1 + reviews.value[reviewIndex].reviewImages.length) % reviews.value[reviewIndex].reviewImages.length;
};

// 리뷰 정렬 함수
const sortReviews = (criteria) => {
  sortBy.value = criteria;
  if (criteria === 'newest') {
    reviews.value.sort((a, b) => new Date(b.reviewRegDate) - new Date(a.reviewRegDate));
  } else if (criteria === 'rating') {
    reviews.value.sort((a, b) => b.reviewScore - a.reviewScore);
  }
};

// Fetch review count
const { data: reviewCountData, error: reviewCountError } = useFetch(`http://localhost:8080/api/v1/stores/${storeId}/review-count`);
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
const { data: reviewStatsData, error: reviewStatsError } = useFetch(`http://localhost:8080/api/v1/stores/${storeId}/review-stats`);
watch(
  reviewStatsData,
  (newValue) => {
    if (newValue) {
      reviewStats.value.overallAverageScore = newValue.overallAverageScore;
      reviewStats.value.reviewScaleAverages = newValue.reviewScaleAverages.map((scale) => ({
        scaleName: scale.scaleName,
        averageScore: scale.averageScore,
      }));
    }
  },
  { immediate: true },
);

// Fetch reviews
const { data: reviewsData, error: reviewsError } = useFetch(`http://localhost:8080/api/v1/stores/${storeId}/reviews`);
watch(
  reviewsData,
  (newValue) => {
    if (newValue) {
      reviews.value = newValue.map((review) => ({
        ...review,
        reviewImages: review.reviewImageUrls.map((img) => ({
          url: `http://localhost:8080${img}`,
        })),
        userProfilePicture: `http://localhost:8080${review.userProfilePicture}`,
        helpfulCount: review.helpfulCount || 0,
      }));
      currentImageIndex.value = reviews.value.map(() => 0);
      sortReviews(sortBy.value); // 데이터를 초기 정렬
    }
  },
  { immediate: true },
);

// Computed property for review scale averages
const reviewScaleAverages = computed(() => reviewStats.value.reviewScaleAverages || []);

// Calculate days ago for reviews
const calculateDaysAgo = (createdAt) => {
  const now = new Date();
  const createdDate = new Date(createdAt);
  const diff = Math.floor((now - createdDate) / (1000 * 60 * 60 * 24));
  return diff;
};

// Calculate star fill percentage
const getStarFillPercentage = (reviewScore, starIndex) => {
  const fullStars = Math.floor(reviewScore);
  const decimal = reviewScore % 1;

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
  console.error('리뷰 개수 데이터를 로드하는 중 오류 발생:', reviewCountError.value);
if (reviewStatsError.value)
  console.error('리뷰 통계 데이터를 로드하는 중 오류 발생:', reviewStatsError.value);
if (reviewsError.value)
  console.error('리뷰 데이터를 로드하는 중 오류 발생:', reviewsError.value);

// 레이아웃 설정
definePageMeta({
  layout: 'storedetail'
});
</script>

<style scoped>
/* Additional styling if needed */
</style>
