<template>
  <div>
    <div>
      <section class="mx-auto w-60 rounded-lg bg-white p-5 text-center">
        <h1 class="text-lg font-semibold">{{ storeInfos.storeName }}</h1>
        <div class="mt-5 rounded-lg bg-gray-100 p-5">
          <div class="mb-4">
            <span class="text-sm font-semibold">잔여개수</span><br />
            <span class="text-xl font-bold" id="remainingCount">
              {{ storeInfos.remainingTickets }}
            </span>개
          </div>
          <div class="mb-4 flex items-center justify-center">
            <button
              @click="decreaseQuantity"
              class="flex h-5 w-5 items-center justify-center rounded-full bg-gray-200"
            >
              -
            </button>
            <div class="mx-4 text-lg font-semibold" id="quantity">
              {{ quantity }}
            </div>
            <button
              @click="increaseQuantity"
              class="flex h-5 w-5 items-center justify-center rounded-full bg-gray-200"
            >
              +
            </button>
          </div>
          <div class="h-14 flex justify-between">
            <form @submit.prevent="openModal" class="mr-1 w-1/2">
              <button
                type="submit"
                class="h-full w-full rounded-lg bg-blue-500 py-2 text-white"
              >
                사용하기
              </button>
            </form>
            <form @submit.prevent class="ml-1 w-1/2">
              <button
                type="submit"
                class="h-full w-full rounded-lg bg-red-500 py-2 text-white"
              >
                충전하기
              </button>
            </form>
          </div>
          <form @submit.prevent="goToMyTicketHistoryPage" class="mt-4 h-10">
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
        :quantity="quantity"
        :selectedStore="storeInfos.storeName"
        @closeModal="closeModal"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import MyTicketsDetailModal from '~/components/user/my/MyTicketsDetailModal.vue';

interface storeInfo {
  storeName: string;
  storeId: number;
  remainingTickets: number;
}

const storeInfos = defineProps<storeInfo>();
const isModalVisible = ref(false);
const quantity = ref(1);
const router = useRouter();

const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--;
  }
};

const increaseQuantity = () => {
  quantity.value++;
};

const openModal = () => {
  isModalVisible.value = true;
};

const closeModal = () => {
  isModalVisible.value = false;
};

const goToMyTicketHistoryPage = () => {
  router.push('/my/tickets/history');
};

const route = useRoute();
onBeforeMount(() => {
  route.meta.title = '내 식권';
});
</script>

<style scoped></style>
