<!-- layouts/storeDetail.vue -->
<template>
  <div>
    <!-- 상단 이미지 슬라이더 섹션 -->
    <StoreDetailImages :images="images" :restaurant-name="restaurantName" />

    <!-- 식당 정보 섹션 -->
    <StoreDetailInfo v-if="reviewStats.storeName" :review-stats="reviewStats" />

    <!-- 경로, 저장, 공유 버튼 섹션 -->
    <StoreDetailActionButtons :actions="actionButtons" />

    <!-- 탭 네비게이션 -->
    <StoreDetailTabs />

    <!-- 페이지마다 다른 콘텐츠를 렌더링 -->
    <NuxtPage />

    <UserBottomNav />
  </div>
</template>

<script setup>
import { ref, onMounted, provide } from 'vue';
import { useRoute } from 'vue-router';
import StoreDetailImages from '~/components/user/stores/detail/StoreDetailImages.vue';
import StoreDetailInfo from '~/components/user/stores/detail/StoreDetailInfo.vue';
import StoreDetailActionButtons from '~/components/user/stores/detail/StoreDetailActionButtons.vue';
import StoreDetailTabs from '~/components/user/stores/detail/StoreDetailTabs.vue';

// 라우트에서 storeId 가져오기
const route = useRoute();
const storeId = route.params.storeId ? String(route.params.storeId) : '';

// 데이터 정의
const images = ref([]);
const restaurantName = ref('');
const reviewStats = ref({
  storeName: '',
  reviewCount: 0,
  averageReviewScore: 0.0,
});
const actionButtons = ref(['경로', '저장', '공유']);

// provide로 데이터 공유
provide('storeId', storeId);
provide('images', images);
provide('restaurantName', restaurantName);
provide('reviewStats', reviewStats);
provide('actionButtons', actionButtons);

// 데이터 가져오기 함수
async function fetchData(storeId) {
  try {
    // 리뷰 요약 정보 가져오기
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

    // 오늘의 이미지 데이터 가져오기
    const imagesResponse = await fetch(
      `http://localhost:8080/api/v1/stores/${storeId}/menus/today-images`,
    );
    const imagesData = await imagesResponse.json();

    // 이미지 URL 배열을 images 변수에 설정
    images.value = imagesData.map((img) => `http://localhost:8080${img.img}`);
  } catch (error) {
    console.error('데이터 가져오기 중 오류 발생:', error);
  }
}

// 컴포넌트가 마운트될 때 데이터 가져오기
onMounted(() => {
  fetchData(storeId); // storeId를 인자로 전달
});
</script>

<style scoped>
/* 레이아웃 스타일 추가 */
</style>
