<!-- pages/storeDetailPage.vue -->
<template>
  <div>
    <!-- 티켓 정보 -->
    <div v-if="ticketInf && ticketInf.name">
      <StoreDetailTicket
        class="p-4"
        :store-name="ticketInf.name"
        :remaining-tickets="ticketInf.remainingTickets"
        :store-id="storeId"
      />
    </div>
    <div v-else>
      <p>데이터를 불러오는 중입니다...</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import StoreDetailTicket from '~/components/user/stores/detail/StoreDetailTicket.vue';

// storeId를 라우트 파라미터에서 가져오는 예시
const route = useRoute();
const storeId = route.params.storeId; // 라우트 설정에 따라 변경 필요

if (!storeId) {
  console.error('storeId가 존재하지 않습니다.');
}

// 티켓 데이터를 위한 상태 정의
const ticketInf = ref(null);

// 티켓 데이터 가져오기
const { data: ticketData, error: ticketError } = await useFetch(
  `http://localhost:8080/api/v1/stores/${storeId}/tickets`,
);

if (ticketError.value) {
  console.error('Ticket data fetching error:', ticketError.value);
} else {
  ticketInf.value = ticketData.value;
}

// storeId와 API 응답을 확인하는 로그 추가
console.log('storeId:', storeId);
console.log('ticketData:', ticketData.value);

// 레이아웃 설정
definePageMeta({
  layout: 'storedetail',
});
</script>

<style scoped>
/* 페이지 개별 스타일 */
</style>
