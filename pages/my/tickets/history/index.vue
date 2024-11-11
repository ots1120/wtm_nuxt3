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
          class="p-4"
          v-for="(history, index) in myHistory"
          :key="index"
          :history="history"
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
  formattedRegDate: String;
  price: Number;
  storeName: String;
  formattedTime: String; 
}

interface TicketAllHistoryDto{
  id: number;
  userId: number;
  ticketId: number;
  amount: number;
  type: string;
  regDate: string;
  formattedRegDate: string;
  formattedTime: string;
  storeName: string;
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

const fetchUserTicketHistory = async (): Promise<void> => {
  const userId = '1';

  const { data, error } = await useFetch<TicketHistoryResponseDto>(
    `http://localhost:8080/api/v1/user/my/tickets/history?userId=${userId}&month=${selectedMonth.value}&year=${selectedYear.value}`);

  if (error.value) {
    console.error('사용자 티켓 전체 히스토리를 불러오는 중 오류가 발생했습니다:', error.value);
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

    myHistory.value = fetchedData.combinedHistory.map((item: any) => ({
      formattedRegDate: item.formattedRegDate,
      price: item.price,
      storeName: item.storeName,
      formattedTime: item.formattedTime,
      type: item.type,
    }));
  }
  }
};

const defaultTicketData = computed(() => ({
  purchasePrice: ticketData.value?.purchasePrice ?? 0,
  usedPrice: ticketData.value?.usedPrice ?? 0,
  remainingCount: ticketData.value?.remainingCount ?? 0,
}));

watchEffect(() => {
  fetchUserTicketHistory();
});
</script>

<style scoped></style>