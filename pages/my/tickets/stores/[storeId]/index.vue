<template>
  <div>
    <div>
      <section class="mx-auto w-60 rounded-lg bg-white p-5 text-center">
        <h1 class="text-lg font-semibold">{{ storeInfo.storeName }}</h1>
        <div class="mt-5 rounded-lg bg-gray-100 p-5">
          <div class="mb-4">
            <span class="text-sm font-semibold">잔여개수</span><br />
            <span id="remainingCount" class="text-xl font-bold">
              {{ storeInfo.ticketAmount }}
            </span>
          </div>
          <div class="mb-4 flex items-center justify-center">
            <button
              class="flex h-5 w-5 items-center justify-center rounded-full bg-gray-200"
              @click="decreaseQuantity"
            >
              -
            </button>
            <div id="ticketQuantity" class="mx-4 text-lg font-semibold">
              {{ ticketQuantity }}
            </div>
            <button
              class="flex h-5 w-5 items-center justify-center rounded-full bg-gray-200"
              @click="increaseQuantity"
            >
              +
            </button>
          </div>
          <div class="h-14 flex justify-between">
            <form class="mr-1 w-1/2" @submit.prevent="openModal('usage')">
              <button
                type="submit"
                class="h-full w-full rounded-lg bg-blue-500 py-2 text-white"
              >
                사용하기
              </button>
            </form>
            <form class="ml-1 w-1/2" @submit.prevent="openModal('purchase')">
              <button
                type="submit"
                class="h-full w-full rounded-lg bg-red-500 py-2 text-white"
              >
                충전하기
              </button>
            </form>
          </div>
          <form class="mt-4 h-10" @submit.prevent="goToMyTicketHistoryPage">
            <button
              type="submit"
              class="h-full w-full rounded-lg border border-gray-300 bg-white py-2"
            >
              사용내역 확인
            </button>
          </form>
        </div>
      </section>
    </div>
    <!-- 모달 창 -->
    <div
      v-if="isModalVisible"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
    >
      <MyTicketsDetailModal
        :store-info="storeInfo"
        :ticket-quantity="ticketQuantity"
        :user-id="userId"
        :type="modalType"
        @close-modal="closeModal"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import DeviceDetector from 'device-detector-js';
import MyTicketsDetailModal from '~/components/user/my/MyTicketsDetailModal.vue';

interface storeInfo {
  storeName: string;
  storeId: number;
  ticketId: number;
  ticketAmount: number;
  isBookmarked: boolean;
}
const storeInfo = ref<storeInfo>({
  storeName: '',
  storeId: 0,
  ticketId: 0,
  ticketAmount: 0,
  isBookmarked: false,
});

const isModalVisible = ref(false);
const ticketQuantity = ref(1);
const router = useRouter();
const userId = 1;
const modalType = ref<string>(''); // 추가된 타입 상태 변수

const deviceDetector = new DeviceDetector();
const device = deviceDetector.parse(navigator.userAgent);

const isMobile = ref(
  device.device?.type === 'smartphone' || device.device?.type === 'tablet',
);
const isDesktop = ref(device.device?.type === 'desktop');

const route = useRoute();
const storeId = route.params.storeId;

const { data, error } = await useFetch<storeInfo>(
  `http://localhost:8080/api/v1/user/my/tickets/stores?storeId=${storeId}&userId=${userId}`,
);

if (data.value) {
  console.log(data.value);
  storeInfo.value = data.value;
} else if (error.value) {
  console.error('자세한 티켓 정보를 불러오는 데 실패했습니다', error.value);
}

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
  router.push('/my/tickets/history');
};

onBeforeMount(() => {
  route.meta.title = '내 식권';
});
</script>

<style scoped></style>
