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
                class="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"
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
    </div>

    <!-- 정렬 버튼 섹션 -->
    <div class="flex space-x-2 p-2">
      <!-- 최신순 정렬 버튼 -->
      <button
        class="text-sm px-2 py-1 rounded"
        :class="{
          'bg-gradient-to-r from-blue-500 to-blue-600 text-white':
            sortBy === 'date',
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
          'bg-gradient-to-r from-blue-500 to-blue-600 text-white':
            sortBy === 'rating',
          'bg-gray-200': sortBy !== 'rating',
        }"
        @click="sortReviews('rating')"
      >
        평점순
      </button>
    </div>

    <!-- Review list section -->
    <div class="space-y-8 py-6">
      <div
        v-for="(review, index) in reviews"
        :key="index"
        class="bg-white p-4 border-b-2"
      >
        <!-- Review images carousel -->
        <div
          v-if="review.reviewImages && review.reviewImages.length > 0"
          class="relative mb-6 rounded-xl overflow-hidden"
        >
          <div
            :ref="setImageContainerRef(index)"
            class="flex overflow-x-auto space-x-4 pb-4 snap-x snap-mandatory"
            @scroll="checkScroll(index)"
          >
            <div
              v-for="(image, imgIndex) in review.reviewImages"
              :key="imgIndex"
              class="flex-shrink-0 w-40 h-40 rounded-xl overflow-hidden snap-center"
            >
              <img
                :src="image.url"
                :alt="'리뷰 사진 ' + (imgIndex + 1)"
                class="w-full h-full object-cover"
              />
            </div>
          </div>
          <button
            v-if="showLeftButton[index]"
            class="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-md text-gray-800 opacity-0 transition-opacity duration-200 hover:bg-white focus:outline-none group-hover:opacity-100"
            @click="scrollLeft(index)"
          >
            <ChevronLeft class="w-6 h-6" />
            <span class="sr-only">Left</span>
          </button>
          <button
            v-if="showRightButton[index]"
            class="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-md text-gray-800 opacity-0 transition-opacity duration-200 hover:bg-white focus:outline-none group-hover:opacity-100"
            @click="scrollRight(index)"
          >
            <ChevronRight class="w-6 h-6" />
            <span class="sr-only">Right</span>
          </button>
        </div>

        <!-- Review info section -->
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-center space-x-4">
            <img
              v-if="review.userProfilePicture"
              :src="review.userProfilePicture"
              :alt="review.userName"
              class="w-12 h-12 rounded-full object-cover"
            />
            <!-- 기본 SVG 이미지를 표시 -->
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              class="h-10"
              viewBox="0 0 16 16"
            >
              <path
                fill="#BDBDBD"
                d="M8 16A8 8 0 1 1 8 0a8 8 0 0 1 0 16m.847-8.145a2.502 2.502 0 1 0-1.694 0C5.471 8.261 4 9.775 4 11c0 .395.145.995 1 .995h6c.855 0 1-.6 1-.995c0-1.224-1.47-2.74-3.153-3.145"
              />
            </svg>
            <div>
              <h3 class="font-semibold text-gray-900">{{ review.userName }}</h3>
              <div class="flex items-center mt-1">
                <div class="flex">
                  <span
                    v-for="n in 5"
                    :key="n"
                    class="text-gray-300"
                    :class="{
                      'text-yellow-400': n <= Math.round(review.reviewScore),
                    }"
                  >
                    ★
                  </span>
                </div>
                <span class="ml-2 text-sm font-medium text-gray-600">
                  {{ review.reviewScore.toFixed(1) }}
                </span>
              </div>
            </div>
          </div>
          <p class="text-sm text-gray-500">{{ review.relativeDate }}</p>
        </div>

        <!-- Review content -->
        <p class="text-gray-700 mb-4 leading-relaxed">
          {{ review.reviewContent }}
        </p>

        <!-- Review comments -->
        <div
          v-if="review.reviewComments && review.reviewComments.length"
          class="mt-4 bg-gray-50 rounded-xl p-4"
        >
          <h4 class="text-sm font-semibold text-gray-500 mb-2">사장님 답글</h4>
          <div
            v-for="(reply, replyIndex) in review.reviewComments"
            :key="replyIndex"
            class="bg-white rounded-lg p-3 mb-2 last:mb-0"
          >
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center space-x-2">
                <img
                  v-if="reply.adminProfilePicture"
                  :src="reply.adminProfilePicture"
                  :alt="reply.adminName"
                  class="w-8 h-8 rounded-full object-cover"
                />
                <!-- 기본 SVG 이미지를 표시 -->
                <svg
                  v-else
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-8 w-8 text-gray-400"
                  viewBox="0 0 16 16"
                >
                  <path
                    fill="#BDBDBD"
                    d="M8 16A8 8 0 1 1 8 0a8 8 0 0 1 0 16m.847-8.145a2.502 2.502 0 1 0-1.694 0C5.471 8.261 4 9.775 4 11c0 .395.145.995 1 .995h6c.855 0 1-.6 1-.995c0-1.224-1.47-2.74-3.153-3.145"
                  />
                </svg>
                <span class="font-medium text-gray-900">{{
                  reply.adminName
                }}</span>
              </div>
              <span class="text-xs text-gray-400">{{
                reply.relativeDate
              }}</span>
            </div>
            <p class="text-sm text-gray-700">{{ reply.commentContent }}</p>
          </div>
        </div>

        <!-- 도움돼요 버튼 -->
        <button
          class="flex items-center space-x-2 border border-gray-300 px-3 py-2 rounded-full"
          :class="{
            'bg-gradient-to-r from-rose-500 to-rose-600 text-white':
              review.liked,
            'text-gray-500': !review.liked,
          }"
          @click="toggleHelpful(index, review)"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-thumbs-up"
          >
            <path d="M7 10v12" />
            <path
              d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z"
            />
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

    <!-- 로그인 요청 모달 -->
    <LoginPromptModal
      v-if="loginModalVisible"
      @cancel="closeLoginModal"
      @confirm="redirectToLogin"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useFetch } from '#app';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '~/stores/auth';
import LoginPromptModal from '~/components/user/modal/LoginPromptModal.vue';

// 라우터 설정
const router = useRouter();
const route = useRoute();

// 라우트 파라미터에서 storeId를 가져옵니다.
const storeId = route.params.storeId;

// Auth Store 사용
const authStore = useAuthStore();
const username = computed(() => authStore.user?.username);
const isAuthenticated = computed(() => authStore.isAuthenticated);

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
const page = ref(0);
const size = ref(10);
const hasNext = ref(true);
const isLoading = ref(false);

// Intersection Observer를 위한 ref
const infiniteScrollTrigger = ref(null);

// 로그인 요청 모달 상태
const loginModalVisible = ref(false);

// 리뷰에 대한 모달 트리거를 저장할 상태
const selectedReviewIndexForHelpful = ref(null);

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

// 추가된 watch 블록
watch(reviewCountData, (newData) => {
  if (newData) {
    reviewCount.value = newData.reviewCount;
  }
});

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
        'Content-Type': 'application/json',
        'X-Username': username.value,
      },
    });

    if (response && response.content) {
      const newReviews = response.content.map((review) => ({
        ...review,
        reviewImages: review.reviewImageUrls.map((img) => ({
          url: constructImageUrl(img),
        })),
        userProfilePicture: review.userProfilePicture
          ? constructImageUrl(review.userProfilePicture)
          : null,
        reviewComments: review.reviewComments.map((comment) => ({
          ...comment,
          adminProfilePicture: comment.adminProfilePicture
            ? constructImageUrl(comment.adminProfilePicture)
            : null,
        })),
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

// "도움돼요" 버튼 상태를 토글하는 함수
const toggleHelpful = async (index, review) => {
  if (!isAuthenticated.value) {
    // 인증되지 않은 사용자는 모달을 표시하고, 선택된 리뷰 인덱스를 저장
    selectedReviewIndexForHelpful.value = index;
    loginModalVisible.value = true;
    return;
  }
  try {
    if (review.liked) {
      // liked가 true인 경우 DELETE API 호출
      await $fetch(
        `http://localhost:8080/api/v1/stores/${storeId}/reviews/${review.reviewId}/reviewLike`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'X-Username': username.value,
          },
        },
      );
      review.liked = false;
      review.helpfulCount--;
    } else {
      // liked가 false인 경우 POST API 호출
      await $fetch(
        `http://localhost:8080/api/v1/stores/${storeId}/reviews/${review.reviewId}/reviewLike`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Username': username.value,
          },
        },
      );
      review.liked = true;
      review.helpfulCount++;
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

// --- Login Prompt Modal Functions ---

// 로그인 요청 모달 닫기 함수
const closeLoginModal = () => {
  loginModalVisible.value = false;
  selectedReviewIndexForHelpful.value = null;
};

// 로그인 페이지로 리디렉션 함수
const redirectToLogin = () => {
  if (process.client) {
    const currentPath = route.fullPath;
    localStorage.setItem('redirectPath', currentPath);
  }
  router.push('/signIn');
};

// 레이아웃 설정
definePageMeta({
  layout: 'storedetail',
});
</script>

<style scoped>
.snap-x {
  scroll-snap-type: x mandatory;
}

.snap-center {
  scroll-snap-align: center;
}

/* 수평 스크롤바 안보이게 설정하려면 */
/* Hide scrollbar for Chrome, Safari and Opera */
.overflow-x-auto::-webkit-scrollbar {
}

/* Hide scrollbar for IE, Edge and Firefox */
.overflow-x-auto {
}
</style>
