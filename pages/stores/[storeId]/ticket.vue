<template>
  <div>
    <!-- 상단 이미지와 식당 정보 섹션 -->
    <StoreDetailInfo v-if="selectedStore" :store="selectedStore" />

    <!-- 경로, 저장, 공유 버튼 섹션 -->
    <StoreDetailActionButtons v-if="actionButtons" :actions="actionButtons" />

    <!-- 티켓 정보 -->
    <div v-if="ticketInf && ticketInf.name">
      <StoreDetailTicket
        class="p-4"
        :store-name="ticketInf.name"
        :remaining-tickets="ticketInf.remainingTickets"
      />
    </div>
    <div v-else>
      <p>데이터를 불러오는 중입니다...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useFetch } from '#app';
import StoreDetailInfo from '~/components/stores/detail/StoreDetailInfo.vue';
import StoreDetailActionButtons from '~/components/stores/detail/StoreDetailActionButtons.vue';
import StoreDetailTicket from '~/components/stores/detail/StoreDetailTicket.vue';

// 반응형 데이터 정의
const route = useRoute();
const storeId = route.params.storeId;

const selectedStore = ref(null);
const ticketInf = ref(null);
const actionButtons = ref(['경로', '저장', '공유']);

// 데이터 가져오기
onMounted(async () => {
  // 가게 정보 가져오기
  const { data: storeData, error: storeError } = await useFetch(
    `http://localhost:8080/api/v1/stores/${storeId}`,
  );
  if (storeError.value) {
    console.error('Store data fetching error:', storeError.value);
  } else {
    selectedStore.value = storeData.value;
  }

  // 티켓 데이터 가져오기
  const { data: ticketData, error: ticketError } = await useFetch(
    `http://localhost:8080/api/v1/stores/${storeId}/tickets`,
  );
  if (ticketError.value) {
    console.error('Ticket data fetching error:', ticketError.value);
  } else {
    ticketInf.value = ticketData.value;
  }
});
</script>

<style scoped>
/* 스타일 추가 */
</style>
