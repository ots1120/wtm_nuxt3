<template>
<<<<<<< HEAD:pages/stores/[storeId]/home.vue
  <div>
    <!-- 상단 이미지 슬라이더 섹션 -->
    <StoreDetailImages
      :images="restaurantImages"
      :restaurant-name="restaurantName"
    />

    <!-- 식당 정보 섹션 -->
    <StoreDetailInfo v-if="reviewStats.storeName" :review-stats="reviewStats" />

    <!-- 경로, 저장, 공유 버튼 섹션 -->
    <StoreDetailActionButtons v-if="actionButtons" :actions="actionButtons" />

    <!-- 탭 네비게이션 -->
    <StoreDetailTabs />

    <!-- 식당정보 -->
    <div v-if="selectedStore && storeSns && Ticket">
      <StoreDetailHome
        :store="selectedStore"
        :store-sns="storeSns"
        :Ticket="Ticket"
        class="p-4"
      />
    </div>
    <div v-else>
      <p>데이터를 불러오는 중입니다...</p>
    </div>
  </div>
=======
  <div>my bookmarks</div>
>>>>>>> upstream/dev:pages/my/bookmarks/index.vue
</template>

<script setup>
import { ref, onMounted, watchEffect } from 'vue';
import { useFetch } from '#app';
import { useRoute } from 'vue-router';
import StoreDetailInfo from '~/components/user/stores/detail/StoreDetailInfo.vue';
import StoreDetailActionButtons from '~/components/user/stores/detail/StoreDetailActionButtons.vue';
import StoreDetailHome from '~/components/user/stores/detail/StoreDetailHome.vue';
import StoreDetailTabs from '~/components/user/stores/detail/StoreDetailTabs.vue';
import StoreDetailImages from '~/components/user/stores/detail/StoreDetailImages.vue';

// 라우트에서 storeId 가져오기
const route = useRoute();
const storeId = route.params.storeId;

// 반응형 데이터 정의
const reviewStats = ref({
  storeName: '',
  reviewCount: 0,
  averageReviewScore: 0.0,
});
const selectedStore = ref(null); // 초기 값 null로 변경
const storeSns = ref(null); // 초기 값 null로 변경
const Ticket = ref(null); // 초기 값 null로 변경
const actionButtons = ref(['경로', '저장', '공유']); // 필요에 맞게 설정
const restaurantImages = ref([]); // 이미지 배열 초기화
const restaurantName = ref(''); // 가게 이름 초기화

// 데이터 가져오기 함수
async function fetchData() {
  try {
    // Promise.all로 동시에 데이터 요청 및 모든 요청 완료 시까지 대기
    const [reviewSummaryResponse, storeResponse] = await Promise.all([
      useFetch(`http://localhost:8080/api/v1/stores/${storeId}/review-summary`),
      useFetch(`http://localhost:8080/api/v1/stores/${storeId}`),
    ]);

    const reviewSummaryData = reviewSummaryResponse.data;
    const storeData = storeResponse.data;

    // 에러 로그 출력
    if (reviewSummaryResponse.error.value) {
      console.error(
        '리뷰 요약 데이터를 가져오는 중 오류 발생:',
        reviewSummaryResponse.error.value,
      );
    } else if (reviewSummaryData.value) {
      reviewStats.value = {
        storeName: reviewSummaryData.value.storeName,
        reviewCount: reviewSummaryData.value.reviewCount,
        averageReviewScore: reviewSummaryData.value.averageReviewScore,
      };
    }

    if (storeResponse.error.value) {
      console.error(
        '가게 데이터를 가져오는 중 오류 발생:',
        storeResponse.error.value,
      );
    } else if (storeData.value) {
      selectedStore.value = storeData.value;
      storeSns.value = storeData.value.storeSnsList
        ? storeData.value.storeSnsList[0]
        : null;
      Ticket.value = storeData.value.ticketList
        ? storeData.value.ticketList[0]
        : null;
      restaurantImages.value = storeData.value.images || [];
      restaurantName.value = storeData.value.name || '';
    }
  } catch (error) {
    console.error('데이터 가져오기 중 오류 발생:', error);
  }
}

// watchEffect로 데이터가 업데이트될 때 로깅
watchEffect(() => {
  if (reviewStats.value.storeName) {
    console.log('Review Stats Updated:', reviewStats.value);
  }
  if (selectedStore.value) {
    console.log('Store Data Updated:', selectedStore.value);
  }
});

// 컴포넌트가 마운트될 때 데이터 가져오기
onMounted(() => {
  fetchData();
});
</script>

<style scoped>
/* 스타일 추가 */
</style>
