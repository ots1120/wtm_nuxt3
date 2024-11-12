<!-- pages/storeDetailPage.vue -->
<template>
  <div>
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
import { ref, inject } from 'vue';
import StoreDetailTicket from '~/components/user/stores/detail/StoreDetailTicket.vue';

// 레이아웃에서 제공된 storeId를 inject로 받아옵니다.
const storeId = inject('storeId');

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
