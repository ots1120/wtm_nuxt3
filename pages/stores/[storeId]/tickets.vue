<!-- pages/storeDetailPage.vue -->
<template>
  <div class="container mx-auto">
    <!-- 인증된 사용자에게만 티켓 정보 표시 -->
    <div v-if="isAuthenticated" class="w-full h-full">
      <div v-if="ticketInf && ticketInf.name">
        <StoreDetailTicket
          class="p-4 bg-white shadow rounded"
          :store-name="ticketInf.name"
          :remaining-tickets="ticketInf.remainingTickets"
          :store-id="storeId"
        />
      </div>
      <div v-else class="text-center text-gray-500">
        <p>데이터를 불러오는 중입니다...</p>
      </div>
    </div>

    <!-- 비인증 사용자에게 로그인 버튼 표시 -->
    <div v-else class="flex flex-col items-center justify-center h-full">
      <p class="mb-4 text-lg text-gray-700">
        이 페이지를 보려면 로그인이 필요합니다.
      </p>
      <button
        class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        @click="goToLogin"
      >
        로그인하기
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import StoreDetailTicket from '~/components/user/stores/detail/StoreDetailTicket.vue';
import { useAuthStore } from '~/stores/auth'; // Pinia 스토어 임포트

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

// storeId를 라우트 파라미터에서 가져오기
const storeId = route.params.storeId;

// Pinia에서 username과 인증 상태 가져오기
const username = computed(() => authStore.user?.username);
const isAuthenticated = computed(() => authStore.isAuthenticated);

if (!storeId) {
  console.error('storeId가 존재하지 않습니다.');
}

// 티켓 데이터를 위한 상태 정의
const ticketInf = ref(null);

// 티켓 데이터 가져오기 (인증된 사용자에게만 시도)
const fetchTicketData = async () => {
  if (isAuthenticated.value) {
    try {
      console.log(username.value);
      const { data: ticketData, error: ticketError } = await useFetch(
        `http://localhost:8080/api/v1/stores/${storeId}/tickets`,
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Username': username.value, // Pinia에서 가져온 username을 헤더에 추가
          },
        },
      );

      if (ticketError.value) {
        console.error('Ticket data fetching error:', ticketError.value);
      } else {
        ticketInf.value = ticketData.value;
      }

      // storeId와 API 응답을 확인하는 로그 추가
      console.log('storeId:', storeId);
      console.log('ticketData:', ticketData.value);
    } catch (error) {
      console.error('An unexpected error occurred:', error);
    }
  }
};

onMounted(() => {
  fetchTicketData();
});

// 로그인 페이지로 이동하는 함수
function goToLogin() {
  if (process.client) {
    const currentPath = route.fullPath; // 현재 경로 가져오기
    console.log('Current Path:', currentPath); // 디버깅 로그
    localStorage.setItem('redirectPath', currentPath); // 경로 저장
  }
  router.push(`/signIn`); // 로그인 페이지로 이동
}

// 레이아웃 설정
definePageMeta({
  layout: 'storedetail',
});
</script>
