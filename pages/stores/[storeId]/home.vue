<template>
  <div>
    <!-- 상단 이미지와 식당 정보 섹션 -->
    <StoreDetailInfo v-if="selectedStore" :store="selectedStore" />

    <!-- 경로, 저장, 공유 버튼 섹션 -->
    <StoreDetailActionButtons v-if="actionButtons" :actions="actionButtons" />

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
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useFetch } from '#app';
import { useRoute } from 'vue-router';
import StoreDetailInfo from '~/components/user/stores/detail/StoreDetailInfo.vue';
import StoreDetailActionButtons from '~/components/user/stores/detail/StoreDetailActionButtons.vue';
import StoreDetailHome from '~/components/user/stores/detail/StoreDetailHome.vue';

// 라우트에서 storeId 가져오기
const route = useRoute();
const storeId = route.params.storeId;

// 반응형 데이터 정의
const reviewStats = ref({ name: '', overallAverageScore: 0, reviewCount: 0 });
const selectedStore = ref(null); // 초기 값 null로 변경
const storeSns = ref(null); // 초기 값 null로 변경
const Ticket = ref(null); // 초기 값 null로 변경
const actionButtons = ref(['경로', '저장', '공유']); // 필요에 맞게 설정

// 데이터 가져오기 함수
async function fetchData() {
  try {
    const { data: reviewSummaryData } = await useFetch(
      `http://localhost:8080/api/v1/stores/${storeId}/review-summary`,
    );
    const { data: storeData } = await useFetch(
      `http://localhost:8080/api/v1/stores/${storeId}`,
    );

    // 데이터 확인 후 할당
    if (reviewSummaryData.value) {
      reviewStats.value = {
        name: reviewSummaryData.value.name,
        overallAverageScore: reviewSummaryData.value.overallAverageScore,
        reviewCount: reviewSummaryData.value.reviewCount,
      };
    }
    if (storeData.value) {
      selectedStore.value = storeData.value; // 전체 객체 할당
      storeSns.value = storeData.value.storeSnsList
        ? storeData.value.storeSnsList[0]
        : null; // 첫 번째 SNS 정보 할당
      Ticket.value = storeData.value.ticketList
        ? storeData.value.ticketList[0]
        : null; // 첫 번째 티켓 정보 할당
    }
  } catch (error) {
    console.error('데이터 가져오기 중 오류 발생:', error);
  }
}

// 컴포넌트가 마운트될 때 데이터 가져오기
onMounted(() => {
  fetchData();
});
</script>

<style scoped>
/* 스타일 추가 */
</style>
