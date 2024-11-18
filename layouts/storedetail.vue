<template>
  <div
    class="flex flex-col w-full max-w-lg mx-auto min-h-screen pb-16 relative bg-gray-50"
  >
    <!-- 왼쪽 상단에 고정된 버튼 -->
    <div class="absolute top-4 left-4 z-20">
      <button
        type="button"
        class="bg-white rounded-full shadow-md p-2 hover:bg-gray-100 focus:outline-none"
        @click="goBack"
      >
        <svg
          class="w-6 h-6 text-gray-700"
          viewBox="0 0 1024 1024"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
        >
          <path d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z" />
          <path
            d="M237.248 512 502.656 777.344a32 32 0 1 1-45.312 45.312L169.344 512 457.344 233.344a32 32 0 1 1 45.312 45.312L237.248 512z"
          />
        </svg>
      </button>
    </div>

    <!-- 상단 이미지 섹션 -->
    <StoreDetailImages :images="images" :restaurant-name="restaurantName" />

    <!-- 식당 정보 섹션 -->
    <div class="px-4 mt-4">
      <StoreDetailInfo
        v-if="reviewStats.storeName"
        :review-stats="reviewStats"
      />
    </div>

    <!-- 경로, 저장, 공유 버튼 -->
    <div class="flex justify-around px-4 my-4">
      <StoreDetailActionButtons :actions="actionButtons" />
    </div>

    <!-- 탭 네비게이션 -->
    <div class="sticky top-0 bg-white z-10 border-b border-gray-200">
      <StoreDetailTabs />
    </div>

    <!-- 페이지별 콘텐츠 -->
    <div class="flex-grow overflow-y-auto px-4 mt-4 pb-16">
      <!-- 추가된 pb-16으로 하단 네비게이션 가림 현상 방지 -->
      <NuxtPage />
    </div>

    <!-- UserBottomNav를 하단에 고정 -->
    <div class="fixed bottom-0 w-full bg-white border-t border-gray-200">
      <UserBottomNav />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, provide } from 'vue';
import { useRoute } from 'vue-router';
import StoreDetailImages from '~/components/user/stores/detail/StoreDetailImages.vue';
import StoreDetailInfo from '~/components/user/stores/detail/StoreDetailInfo.vue';
import StoreDetailActionButtons from '~/components/user/stores/detail/StoreDetailActionButtons.vue';
import StoreDetailTabs from '~/components/user/stores/detail/StoreDetailTabs.vue';

const router = useRouter();

const route = useRoute();
const storeId = route.params.storeId ? String(route.params.storeId) : '';

const images = ref([]);
const restaurantName = ref('');
const reviewStats = ref({
  storeName: '',
  reviewCount: 0,
  averageReviewScore: 0.0,
});
const actionButtons = ref(['경로', '저장', '공유']);

provide('storeId', storeId);
provide('images', images);
provide('restaurantName', restaurantName);
provide('reviewStats', reviewStats);
provide('actionButtons', actionButtons);

async function fetchData(storeId) {
  try {
    const reviewSummaryResponse = await fetch(
      `http://localhost:8080/api/v1/stores/${storeId}/review-summary`,
    );
    const reviewSummaryData = await reviewSummaryResponse.json();

    restaurantName.value = reviewSummaryData.name || '';
    reviewStats.value = {
      storeName: reviewSummaryData.storeName,
      reviewCount: reviewSummaryData.reviewCount,
      averageReviewScore: reviewSummaryData.averageReviewScore,
    };

    const imagesResponse = await fetch(
      `http://localhost:8080/api/v1/stores/${storeId}/menus/today-images`,
    );
    const imagesData = await imagesResponse.json();

    images.value = imagesData.map((img) => `http://localhost:8080${img.img}`);
  } catch (error) {
    console.error('데이터 가져오기 중 오류 발생:', error);
  }
}

const goBack = () => {
  router.go(-1);
};

onMounted(() => {
  fetchData(storeId);
});
</script>

<style scoped>
/* 추가 스타일이 필요하면 여기에 작성 */
</style>
