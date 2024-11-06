<template>
  <div>
    <!-- 상단 이미지와 식당 정보 섹션 -->
    <StoreDetailInfo
      v-if="selectedStore"
      :store="selectedStore"
      :review-stats="reviewStats"
    />

    <!-- 경로, 저장, 공유 버튼 섹션 -->
    <StoreDetailActionButtons v-if="actionButtons" :actions="actionButtons" />

    <!-- 탭 네비게이션 -->
    <StoreDetailTabs />

    <!-- 리뷰 -->
    <div
      v-if="
        reviewDatas && reviewDatas.reviews && reviewDatas.reviews.length > 0
      "
    >
      <StoreDetailReviewList
        v-for="(reviewData, index) in reviewDatas.reviews"
        :key="index"
        class="p-4"
        :reviewer-name="reviewData.user.name"
        :days-ago="calculateDaysAgo(reviewData.createdAt)"
        :review-content="reviewData.content"
        :review-images="reviewData.images.map((img) => img.url)"
        :rating-stars="reviewData.avgScore"
      />
    </div>
    <div v-else>
      <p>리뷰가 없습니다.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useFetch } from '#app';
import StoreDetailInfo from '~/components/user/stores/detail/StoreDetailInfo.vue';
import StoreDetailActionButtons from '~/components/user/stores/detail/StoreDetailActionButtons.vue';
import StoreDetailTabs from '~/components/user/stores/detail/StoreDetailTabs.vue';
import StoreDetailReviewList from '~/components/user/stores/detail/StoreDetailReviewList.vue';

// 라우트에서 storeId 가져오기
const route = useRoute();
const storeId = route.params.storeId;

// 반응형 데이터 정의
const selectedStore = ref(null);
const reviewStats = ref({});
const reviewDatas = ref({});
const actionButtons = ref(['경로', '저장', '공유']);

// 데이터 가져오기
onMounted(async () => {
  try {
    // 가게 정보 가져오기
    const { data: reviewSummaryData, error: reviewSummaryError } =
      await useFetch(
        `http://localhost:8080/api/v1/stores/${storeId}/review-summary`,
      );
    if (reviewSummaryError.value) {
      console.error('Store data fetching error:', reviewSummaryError.value);
    } else {
      reviewStats.value = reviewSummaryData.value;
    }

    // 리뷰 데이터 가져오기
    const { data: reviewData, error: reviewError } = await useFetch(
      `http://localhost:8080/api/v1/stores/${storeId}/reviews`,
    );
    if (reviewError.value) {
      console.error('Review data fetching error:', reviewError.value);
    } else {
      reviewDatas.value = reviewData.value;
      console.log('리뷰 데이터:', reviewDatas.value); // API에서 받아온 리뷰 데이터 확인용
    }
  } catch (err) {
    console.error('API 요청 중 오류 발생:', err);
  }
});

// 작성일로부터 경과한 날짜 계산
function calculateDaysAgo(reviewDate) {
  const now = new Date();
  const reviewDateTime = new Date(reviewDate);
  const timeDiff = now - reviewDateTime;
  return Math.floor(timeDiff / (1000 * 60 * 60 * 24)); // 일 단위 계산
}
</script>

<style scoped>
/* 필요한 경우 스타일 추가 */
</style>
