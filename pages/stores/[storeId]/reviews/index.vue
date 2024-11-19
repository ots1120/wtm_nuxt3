<template>
  <div>
    <div class="p-4">
      <!-- 전체 평점 섹션 -->
      <div class="flex items-center justify-between">
        <!-- 전체 평균 평점을 표시하는 부분 -->
        <div class="text-center mr-6">
          <p class="text-lg font-bold">전체 평점</p>
          <div class="flex items-center justify-center">
            <!-- 별 아이콘 -->
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
            <!-- 전체 평균 평점 표시 -->
            <p class="text-4xl font-extrabold">
              {{ reviewStats.overallAverageScore || '0.0' }}
            </p>
          </div>
        </div>

        <!-- 상세 평점 섹션 (카테고리별 평균 점수) -->
        <div class="flex flex-col space-y-3">
          <!-- 각 평가 항목의 평균 점수를 표시 -->
          <div
            v-for="(scale, index) in reviewScaleAverages"
            :key="index"
            class="flex items-center space-x-2"
          >
            <!-- 평가 항목 이름 -->
            <span class="w-20 text-gray-600">{{ scale.scaleName }}</span>
            <!-- 프로그레스 바 배경 -->
            <div class="w-32 h-3 bg-gray-200 rounded-full">
              <!-- 프로그레스 바 채워진 부분 -->
              <div
                :style="{ width: scale.averageScore * 20 + '%' }"
                class="h-full bg-blue-500 rounded-full"
              ></div>
            </div>
            <!-- 평균 점수 표시 -->
            <span class="text-gray-600">
              {{ scale.averageScore.toFixed(1) }}점
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 리뷰 개수와 전체보기 버튼 -->
    <div class="flex justify-between border-b border-t p-2">
      <span class="text-sm font-bold">리뷰 {{ reviewCount }}건</span>
      <a href="#" class="text-sm">전체보기</a>
    </div>

    <!-- 정렬 버튼 섹션 -->
    <div class="flex space-x-2 p-2">
      <!-- 최신순 정렬 버튼 -->
      <button
        class="text-sm px-2 py-1 rounded"
        :class="{
          'bg-blue-500 text-white': sortBy === 'date',
          'bg-gray-200': sortBy !== 'date',
        }"
        @click="sortReviews('date')"
      >
        최신순
      </button>
      <!-- 평점순 정렬 버튼 -->
      <button
        class="text-sm px-2 py-1 rounded"
        :class="{
          'bg-blue-500 text-white': sortBy === 'rating',
          'bg-gray-200': sortBy !== 'rating',
        }"
        @click="sortReviews('rating')"
      >
        평점순
      </button>
    </div>

    <!-- 리뷰 리스트 섹션 -->
    <div>
      <div
        v-for="(review, index) in reviews"
        :key="index"
        class="border-b border-gray-300 p-4"
      >
        <!-- 리뷰 이미지 가로 스크롤 섹션 -->
        <div
          v-if="review.reviewImages && review.reviewImages.length > 0"
          class="relative mb-4"
        >
          <!-- 이미지 컨테이너 -->
          <div
            :ref="setImageContainerRef(index)"
            class="flex overflow-x-auto space-x-2"
            @scroll="checkScroll(index)"
          >
            <div
              v-for="(image, imgIndex) in review.reviewImages"
              :key="imgIndex"
              class="flex-shrink-0 w-40 h-40 rounded-lg overflow-hidden"
            >
              <img
                :src="image.url"
                :alt="'리뷰 사진 ' + (imgIndex + 1)"
                class="w-full h-full object-cover"
              />
            </div>
          </div>

          <!-- 좌우 스크롤 버튼 -->
          <!-- 왼쪽 버튼 -->
          <button
            v-if="showLeftButton[index]"
            class="absolute left-0 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-white bg-opacity-75 text-gray-800 hover:bg-opacity-100 focus:outline-none transition-colors duration-200"
            @click="scrollLeft(index)"
          >
            <ChevronLeft class="w-6 h-6" />
            <span class="sr-only">Left</span>
          </button>
          <!-- 오른쪽 버튼 -->
          <button
            v-if="showRightButton[index]"
            class="absolute right-0 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-white bg-opacity-75 text-gray-800 hover:bg-opacity-100 focus:outline-none transition-colors duration-200"
            @click="scrollRight(index)"
          >
            <ChevronRight class="w-6 h-6" />
            <span class="sr-only">Right</span>
          </button>
        </div>

        <!-- 리뷰 정보 섹션 -->
        <div class="flex justify-between mb-2">
          <div>
            <!-- 별점 표시 -->
            <div class="flex space-x-1 mb-2">
              <span
                v-for="n in 5"
                :key="n"
                class="text-gray-300 relative"
                style="width: 24px; height: 24px"
              >
                <!-- 빈 별 -->
                <span class="block absolute text-gray-300">★</span>
                <!-- 채워진 부분 -->
                <span
                  class="block absolute top-0 left-0 text-yellow-500"
                  :style="{
                    width: getStarFillPercentage(review.reviewScore, n) + '%',
                    overflow: 'hidden',
                  }"
                  >★</span
                >
              </span>
            </div>
            <!-- 사용자 정보와 작성 날짜 -->
            <div class="text-sm text-gray-500">
              <div class="flex items-center mb-2">
                <!-- 사용자 프로필 이미지 -->
                <img
                  :src="review.userProfilePicture"
                  alt="User Image"
                  class="w-10 h-10 rounded-full mr-2"
                />
                <!-- 사용자 이름 -->
                <span class="font-medium">{{ review.userName }}</span>
              </div>
              <!-- 작성일 -->
              {{ review.relativeDate }}
            </div>
          </div>
          <!-- 신고 링크 -->
          <a href="#" class="text-sm">신고</a>
        </div>

        <!-- 리뷰 내용 -->
        <p class="mb-4 text-gray-700">{{ review.reviewContent }}</p>

        <!-- 답글 섹션 -->
        <div v-if="review.reviewComments && review.reviewComments.length">
          <!-- 각 답글을 표시 -->
          <div
            v-for="(reply, replyIndex) in review.reviewComments"
            :key="replyIndex"
            class="ml-6 p-3 bg-gray-100 rounded-lg mb-2"
          >
            <div class="flex items-center justify-between mb-1">
              <div class="flex items-center mb-2">
                <!-- 관리자 프로필 이미지 -->
                <img
                  :src="reply.adminProfilePicture"
                  alt="Admin Image"
                  class="w-10 h-10 rounded-full mr-2"
                />
                <!-- 관리자 이름 -->
                <span class="font-medium">{{ reply.adminName }}</span>
              </div>
              <!-- 답글 작성일 -->
              <span class="text-xs text-gray-400">
                {{ reply.relativeDate }}
              </span>
            </div>
            <!-- 답글 내용 -->
            <p class="text-sm text-gray-700">{{ reply.commentContent }}</p>
          </div>
        </div>

        <!-- 도움돼요 버튼 -->
        <button
          class="flex items-center space-x-2 border border-gray-300 px-3 py-2 rounded-full"
          :class="{
            'bg-blue-500 text-white': review.liked, // liked가 true일 경우 색상 변경
            'text-gray-500': !review.liked, // liked가 false일 경우 기본 색상
          }"
          @click="toggleHelpful(index, review)"
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

      <!-- 감시 대상 요소 -->
      <div ref="infiniteScrollTrigger"></div>

      <!-- 로딩 중 표시 -->
      <div v-if="isLoading" class="text-center py-4">
        리뷰를 불러오는 중입니다...
      </div>
      <!-- 더 이상 리뷰가 없을 때 표시 -->
      <div v-if="!hasNext && reviews.length > 0" class="text-center py-4">
        모든 리뷰를 불러왔습니다.
      </div>
      <!-- 리뷰가 없을 때 표시 -->
      <div v-if="reviews.length === 0 && !isLoading" class="text-center py-4">
        리뷰가 없습니다.
      </div>
    </div>

    <!-- 리뷰 쓰기 버튼 -->
    <div v-if="isAuthenticated" class="fixed bottom-40 right-20 z-50">
      <WriteButton :push-route="`/stores/${storeId}/notices`" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useFetch } from '#app';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '~/stores/auth'; // authStore 불러오기
import WriteButton from '~/components/admin/ui/WriteButton.vue';

// 라우터 설정
const router = useRouter();
const route = useRoute();

// 라우트 파라미터에서 storeId를 가져옵니다.
const storeId = route.params.storeId;

// Auth Store 사용
const authStore = useAuthStore();
const username = computed(() => authStore.user?.username);
const isAuthenticated = computed(() => authStore.isAuthenticated); // 인증 상태 확인

// 정렬 기준 상태: 최신순('date') 또는 평점순('rating')
const sortBy = ref('date');

// 리뷰 통계와 개수를 저장하는 상태
const reviewStats = ref({
  overallAverageScore: 0,
  reviewScaleAverages: [],
});
const reviewCount = ref(0);
const reviews = ref([]);

// 데이터 로딩 상태
const isReviewStatsLoading = ref(true);

// 이미지 컨테이너 참조와 스크롤 버튼 표시 여부를 관리하는 상태
const imageContainers = ref([]);
const showLeftButton = ref([]);
const showRightButton = ref([]);

// 무한 스크롤을 위한 상태 변수
const page = ref(0); // 페이지 번호
const size = ref(10); // 한 번에 가져올 항목 수
const hasNext = ref(true); // 다음 페이지가 있는지 여부
const isLoading = ref(false); // 로딩 상태 관리

// Intersection Observer를 위한 ref
const infiniteScrollTrigger = ref(null);

// 정렬 기준을 변경하는 함수
const sortReviews = (criteria) => {
  if (sortBy.value !== criteria) {
    sortBy.value = criteria;
    // 정렬 기준이 변경되면 리뷰와 페이지를 초기화하고 다시 데이터를 가져옵니다.
    reviews.value = [];
    page.value = 0;
    hasNext.value = true;
    fetchReviews();
  }
};

// 리뷰 개수 가져오기
const { data: reviewCountData, error: reviewCountError } = useFetch(
  `http://localhost:8080/api/v1/stores/${storeId}/review-count`,
);
if (reviewCountData.value) {
  reviewCount.value = reviewCountData.value.reviewCount;
}

// 리뷰 통계 가져오기
const { data: reviewStatsData, error: reviewStatsError } = useFetch(
  `http://localhost:8080/api/v1/stores/${storeId}/review-stats`,
);

// 리뷰 통계 데이터가 변경될 때마다 상태 업데이트
watch(reviewStatsData, (newData) => {
  if (newData) {
    reviewStats.value.overallAverageScore = newData.overallAverageScore;
    reviewStats.value.reviewScaleAverages = newData.reviewScaleAverages.map(
      (scale) => ({
        scaleName: scale.scaleName,
        averageScore: scale.averageScore,
      }),
    );
    isReviewStatsLoading.value = false;
  }
});

// 계산된 속성 정의
const reviewScaleAverages = computed(
  () => reviewStats.value.reviewScaleAverages || [],
);

// 이미지 URL을 구성하는 헬퍼 함수
const constructImageUrl = (path) => `http://localhost:8080${path}`;

// 리뷰 데이터 가져오기 함수
const fetchReviews = async () => {
  if (isLoading.value || !hasNext.value) return;
  isLoading.value = true;

  try {
    const url = `http://localhost:8080/api/v1/stores/${storeId}/reviews?sortOption=${sortBy.value}&page=${page.value}&size=${size.value}`;
    const response = await $fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json', // JSON 데이터 요청 시 설정
        'X-Username': username.value, // Pinia에서 가져온 username을 헤더에 추가
      },
    });

    if (response && response.content) {
      const newReviews = response.content.map((review) => ({
        ...review,
        // 리뷰 이미지 URL 구성
        reviewImages: review.reviewImageUrls.map((img) => ({
          url: constructImageUrl(img),
        })),
        // 사용자 프로필 이미지 URL
        userProfilePicture: constructImageUrl(review.userProfilePicture),
        // 리뷰 댓글 처리
        reviewComments: review.reviewComments.map((comment) => ({
          ...comment,
          adminProfilePicture: comment.adminProfilePicture
            ? constructImageUrl(comment.adminProfilePicture)
            : null,
        })),
        // 도움돼요 카운트 초기화
        helpfulCount: review.helpfulCount || 0,
      }));

      // 기존 리뷰에 새로 가져온 리뷰 추가
      reviews.value.push(...newReviews);

      // 이미지 컨테이너 참조 배열 초기화
      imageContainers.value = reviews.value.map(() => null);

      // 스크롤 버튼 표시 여부 배열 초기화
      showLeftButton.value = reviews.value.map(() => false);
      showRightButton.value = reviews.value.map(() => true);

      // 다음 페이지 여부 업데이트
      hasNext.value = !response.last;
      if (hasNext.value) {
        page.value += 1;
      }
    } else {
      hasNext.value = false;
    }
  } catch (error) {
    console.error('리뷰 데이터를 로드하는 중 오류 발생:', error);
    hasNext.value = false;
  } finally {
    isLoading.value = false;
  }
};

// 이미지 컨테이너 ref 설정 함수
const setImageContainerRef = (index) => (el) => {
  imageContainers.value[index] = el;
  // 초기 스크롤 상태 확인
  checkScroll(index);
};

// 스크롤 상태를 확인하여 버튼 표시 여부를 결정하는 함수
const checkScroll = (index) => {
  const container = imageContainers.value[index];
  if (container) {
    showLeftButton.value[index] = container.scrollLeft > 0;
    showRightButton.value[index] =
      container.scrollLeft + container.clientWidth < container.scrollWidth;
  }
};

// 왼쪽으로 스크롤하는 함수
const scrollLeft = (index) => {
  const container = imageContainers.value[index];
  if (container) {
    container.scrollBy({
      left: -200,
      behavior: 'smooth',
    });
    setTimeout(() => checkScroll(index), 300);
  }
};

// 오른쪽으로 스크롤하는 함수
const scrollRight = (index) => {
  const container = imageContainers.value[index];
  if (container) {
    container.scrollBy({
      left: 200,
      behavior: 'smooth',
    });
    setTimeout(() => checkScroll(index), 300);
  }
};

// 별점의 채워진 정도를 계산하는 함수
const getStarFillPercentage = (reviewScore, starIndex) => {
  const fullStars = Math.floor(reviewScore);
  const decimal = reviewScore % 1;

  if (starIndex <= fullStars) return 100;
  else if (starIndex === fullStars + 1) return decimal * 100;
  return 0;
};

// "도움돼요" 버튼 상태를 토글하는 함수
const toggleHelpful = async (index, review) => {
  try {
    if (review.liked) {
      // liked가 true인 경우 DELETE API 호출
      await $fetch(
        `http://localhost:8080/api/v1/stores/${storeId}/reviews/${review.reviewId}/reviewLike`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'X-Username': username.value, // username 데이터를 헤더로 전달
          },
        },
      );
      review.liked = false;
      review.helpfulCount--; // 도움돼요 카운트 감소
    } else {
      // liked가 false인 경우 POST API 호출
      await $fetch(
        `http://localhost:8080/api/v1/stores/${storeId}/reviews/${review.reviewId}/reviewLike`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Username': username.value, // username 데이터를 헤더로 전달
          },
        },
      );
      review.liked = true;
      review.helpfulCount++; // 도움돼요 카운트 증가
    }
  } catch (error) {
    console.error('도움돼요 상태 변경 중 오류 발생:', error);
  }
};

// Intersection Observer 설정
let observer = null;
onMounted(() => {
  fetchReviews(); // 초기 데이터 로드

  observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        fetchReviews();
      }
    },
    {
      root: null,
      threshold: 0.1,
    },
  );

  if (infiniteScrollTrigger.value) {
    observer.observe(infiniteScrollTrigger.value);
  }
});

onUnmounted(() => {
  if (observer && infiniteScrollTrigger.value) {
    observer.unobserve(infiniteScrollTrigger.value);
  }
});

// 데이터 로딩 중 오류 발생 시 콘솔에 에러 출력
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

// 페이지 레이아웃 설정
definePageMeta({
  layout: 'storedetail',
});
</script>
