<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
    <div class="max-w-md mx-auto bg-white min-h-screen shadow-lg">
      <header class="bg-white p-4 flex items-center">
        <h1 class="text-3xl font-semibold text-center flex-1 text-gray-700">{{ storeInfo.storeName }}</h1>
      </header>
      
      <main class="p-6">
        <div class="bg-gradient-to-r from-emerald-400 to-teal-500 rounded-3xl p-6 mb-8 shadow-lg transform transition-transform duration-300 flex items-center justify-between">
          <h2 class="text-2xl font-medium text-emerald-50">잔여 쿠폰</h2>
          <p class="text-5xl font-bold text-white">{{ storeInfo.ticketAmount }}</p>
        </div>
        
        <div class="flex items-center justify-center mb-8">
          <button 
            class="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors duration-300"
            @click="decreaseQuantity"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
            </svg>
          </button>
          <span class="mx-8 text-3xl font-semibold text-gray-800">{{ ticketQuantity }}</span>
          <button 
            class="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors duration-300"
            @click="increaseQuantity"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
        </div>
        
        <div class="space-y-4">
          <button
            class="w-full py-4 bg-gradient-to-r from-blue-400 to-blue-500 text-white font-semibold rounded-2xl shadow-md hover:from-blue-500 hover:to-blue-600 transition duration-300 transform hover:scale-105"
            @click="openModal('usage')"
          >
            사용하기
          </button>
          <button
            class="w-full py-4 bg-gradient-to-r from-rose-400 to-rose-500 text-white font-semibold rounded-2xl shadow-md hover:from-rose-500 hover:to-rose-600 transition duration-300 transform hover:scale-105"
            @click="openModal('purchase')"
          >
            충전하기
          </button>
          <button
            class="w-full py-4 bg-white text-gray-800 font-semibold rounded-2xl shadow-md border border-gray-200 hover:bg-gray-50 transition duration-300 transform hover:scale-105"
            @click="goToMyTicketHistoryPage"
          >
            사용내역 확인
          </button>
        </div>
      </main>
    </div>
    
    <!-- 모달 창 -->
    <div
      v-if="isModalVisible"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="closeModal"
    >
      <div class="bg-white rounded-3xl p-6 w-11/12 max-w-md transform transition-all duration-300" :class="{'scale-100 opacity-100': isModalVisible, 'scale-95 opacity-0': !isModalVisible}">
        <h2 class="text-2xl font-semibold mb-4 text-gray-800 text-center">
          {{ modalType === 'usage' ? '식권 사용' : '식권 충전' }}
        </h2>
        <!-- 모달 내용 -->
        <MyTicketsDetailModal
          :store-info="storeInfo"
          :ticket-quantity="ticketQuantity"
          :type="modalType"
          @close-modal="closeModal"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import DeviceDetector from 'device-detector-js';
import MyTicketsDetailModal from '~/components/user/my/MyTicketsDetailModal.vue';

interface storeInfo {
  userId: number;
  storeName: string;
  storeId: number;
  ticketAmount: number;
  isBookmarked: boolean;
}
const storeInfo = ref<storeInfo>({
  userId: 0,
  storeName: '',
  storeId: 0,
  ticketAmount: 0,
  isBookmarked: false,
});

// 여기가 pinia 전역변수
// username 을 업데이트

const isModalVisible = ref(false);
const ticketQuantity = ref(1);
const router = useRouter();
const authstore = useAuthStore();
const username = authstore.user?.username;
const modalType = ref<string>(''); // 추가된 타입 상태 변수

const deviceDetector = new DeviceDetector();
const device = deviceDetector.parse(navigator.userAgent);

const isMobile = ref(
  device.device?.type === 'smartphone' || device.device?.type === 'tablet',
);
const isDesktop = ref(device.device?.type === 'desktop');

const route = useRoute();
const storeId = route.params.storeId;

const decreaseQuantity = () => {
  if (ticketQuantity.value > 1) {
    ticketQuantity.value--;
  }
};

const increaseQuantity = () => {
  if (ticketQuantity.value < storeInfo.value.ticketAmount)
    ticketQuantity.value++;
};

const openModal = (type: string) => {
  // if(isMobile.value){
  modalType.value = type;
  isModalVisible.value = true;
  // } else if(isDesktop){
  // alert("현재 컴퓨터로 접속이 확인됩니다. 모바일에서 진행해주세요")
  // }else{
  // alert("모바일에서 진행해주세요")
  // }
};

const closeModal = () => {
  isModalVisible.value = false;
};

const goToMyTicketHistoryPage = () => {
  router.push(`/my/tickets/stores/${storeId}/history`);
};

onBeforeMount( async () => {
  route.meta.title = '내 식권';
    const { data, error } = await useFetch<storeInfo>(
    `http://localhost:8080/api/v1/user/my/tickets/stores?username=${username}&storeId=${storeId}`,
  );

  if (data.value) {
    storeInfo.value = data.value;
  } else if (error.value) {
    console.error('자세한 티켓 정보를 불러오는 데 실패했습니다', error.value);
  }
});
</script>

<style scoped></style>
