<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-lg mx-auto bg-white shadow-sm">
      <div v-if="myHistory.length > 0">
        <TicketSummary
          :purchasePrice="defaultTicketData.purchasePrice"
          :usedPrice="defaultTicketData.usedPrice"
          :remainingCount="defaultTicketData.remainingCount"
          :selectedMonth.sync="selectedMonth"
          :selectedYear.sync="selectedYear"
          @dateChanged="fetchUserTicketHistory"
        />
        <TicketHistoryList
          :my-history="myHistory"
          :selected-month="selectedMonth"
          :selected-year="selectedYear"
          :has-more-items="hasMoreItems"
          @load-more-items="loadMoreItems"
          @reset-load-items="resetLoadItems"
        />
      </div>
      <p v-else class="text-center mt-4">티켓 구입 및 사용 내역이 없습니다.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue';
import TicketSummary from '~/components/user/my/TicketSummary.vue';
import TicketHistoryList from '~/components/user/my/TicketHistoryList.vue';

interface TicketData {
  purchasePrice: Number;
  usedPrice: Number;
  remainingCount: Number;
}

interface TicketHistory {
  storeId: number;
  id: number;
  userId: number;
  price: number;
  ticketId: number;
  amount: number;
  type: string;
  regDate: string;
  formattedRegDate: string;
  formattedTime: string;
  storeName: string;
  hasReview: boolean;
}

interface TicketAllHistoryDto{
  storeId: number;
  id: number;
  userId: number;
  price: number;
  ticketId: number;
  amount: number;
  type: string;
  regDate: string;
  formattedRegDate: string;
  formattedTime: string;
  storeName: string;
  hasReview: boolean;
}

interface TicketHistoryResponseDto {
  combinedHistory: TicketAllHistoryDto[];
  totalPurchasedPrice: number;
  totalUsedPrice: number;
  totalAmount: number;
}

const ticketData = ref<TicketData>();
const myHistory = ref<TicketHistory[]>([]);
const selectedMonth = ref<number>(new Date().getMonth() + 1); // 현재 월로 초기화
const selectedYear = ref<number>(new Date().getFullYear()); // 현재 연도로 초기화
const page = ref(1);
const hasMoreItems = ref(true);

const fetchUserTicketHistory = async (): Promise<void> => {
  const userId = 1;
  const storeId = 1;

  const { data, error } = await useFetch<TicketHistoryResponseDto>(
    `http://localhost:8080/api/v1/user/my/tickets/stores/history?userId=${userId}&storeId=${storeId}&month=${selectedMonth.value}&year=${selectedYear.value}`);

  if (error.value) {
    console.error('사용자의 특정 가게 티켓 히스토리를 불러오는 중 오류가 발생했습니다:', error.value);
    return;
  }

  if (data.value) {
    const fetchedData = data.value;
    // fetchedData와 combinedHistory의 유효성 검사
  if (fetchedData && fetchedData.combinedHistory && Array.isArray(fetchedData.combinedHistory)) {
    ticketData.value = {
      purchasePrice: fetchedData.totalPurchasedPrice,
      usedPrice: fetchedData.totalUsedPrice,
      remainingCount: fetchedData.totalAmount,
    };
    
    if (page.value === 1) {
        myHistory.value = fetchedData.combinedHistory;
      } else {
        myHistory.value = [...myHistory.value, ...fetchedData.combinedHistory];
      }

      page.value++;

      if (fetchedData.combinedHistory.length < 7) {
        hasMoreItems.value = false;
      }
    
    // myHistory.value = fetchedData.combinedHistory.map((item: any) => ({
    //   formattedRegDate: item.formattedRegDate,
    //   price: item.price,
    //   storeName: item.storeName,
    //   formattedTime: item.formattedTime,
    //   type: item.type,
    // }));
  }
  }
};

const defaultTicketData = computed(() => ({
  purchasePrice: ticketData.value?.purchasePrice ?? 0,
  usedPrice: ticketData.value?.usedPrice ?? 0,
  remainingCount: ticketData.value?.remainingCount ?? 0,
}));

const loadMoreItems = () => {
  fetchUserTicketHistory();
};

const resetLoadItems = () => {
  page.value = 1;
  myHistory.value = [];
  hasMoreItems.value = true;
  fetchUserTicketHistory();
};
 
watchEffect(() => {
  fetchUserTicketHistory();
});
</script>

<style scoped></style>