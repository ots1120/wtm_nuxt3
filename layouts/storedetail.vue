<template>
  <div
    class="flex flex-col w-full max-w-md mx-auto min-h-screen bg-white font-sans"
  >
    <!-- Scrollable content -->
    <div class="flex-grow overflow-y-auto pb-16">
      <!-- 상단 이미지 섹션 -->
      <StoreDetailImages :images="images" :restaurant-name="restaurantName" />

      <!-- 식당 정보 섹션 -->
      <div class="mt-4 ml-4">
        <StoreDetailInfo
          v-if="reviewStats.storeName"
          :review-stats="reviewStats"
        />
      </div>

      <!-- 경로, 저장, 공유 버튼 -->
      <div class="flex justify-around mt-4">
        <StoreDetailActionButtons :actions="actionButtons" />
      </div>

      <!-- 탭 네비게이션 -->
      <div class="mt-2 sticky top-14 bg-white z-10 border-b border-gray-200">
        <StoreDetailTabs />
      </div>

      <!-- 페이지별 콘텐츠 -->
      <div class="px-4 mt-4 pb-20">
        <NuxtPage />
      </div>
    </div>

    <!-- UserBottomNav를 하단에 고정 -->
    <div
      class="fixed bottom-0 w-full bg-white border-t border-gray-200 rounded-t-2xl shadow-lg"
    >
      <UserBottomNav
        class="quick-bar fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md z-20"
      />
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
import WriteButton from '~/components/admin/ui/WriteButton.vue';
import { useAuthStore } from '~/stores/auth'; // authStore 불러오기

// Auth Store 사용
const authStore = useAuthStore();
const isAuthenticated = computed(() => authStore.isAuthenticated); // 인증 상태 확인

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

onMounted(() => {
  fetchData(storeId);
});
</script>

<style scoped>
.font-sans {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica,
    Arial, sans-serif;
}

.min-h-screen {
  min-height: 100vh;
}

.overflow-y-auto {
  -webkit-overflow-scrolling: touch;
}
</style>
