<template>
  <div class="container px-4">
    <div class="max-w-lg mx-auto">
      <div v-if="myHistory.length > 0">
        <TicketSummary
          :purchase-price="ticketData.purchasePrice"
          :used-price="ticketData.usedPrice"
          :remaining-count="ticketData.remainingCount"
          :selected-month="selectedMonth"
          :selected-year="selectedYear"
          @date-changed="resetLoadItems"
        />
        <div class="mt-2">
          <TicketHistoryList
            :my-history="myHistory"
            :selected-month="selectedMonth"
            :selected-year="selectedYear"
            :has-more-items="hasMoreItems"
            @load-more-items="loadMoreItems"
            @reset-load-items="resetLoadItems"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import TicketSummary from '~/components/user/my/TicketSummary.vue';
import TicketHistoryList from '~/components/user/my/TicketHistoryList.vue';

interface TicketData {
  purchasePrice: number;
  usedPrice: number;
  remainingCount: number;
}

interface TicketHistory {
  id: number;
  formattedRegDate: string;
  price: number;
  storeName: string;
  formattedTime: string;
  type: string;
  hasReview: boolean;
}

const ticketData = ref<TicketData>({
  purchasePrice: 0,
  usedPrice: 0,
  remainingCount: 0,
});

const myHistory = ref<TicketHistory[]>([]);
const selectedMonth = ref<number>(new Date().getMonth() + 1);
const selectedYear = ref<number>(new Date().getFullYear());
const page = ref(1);
const hasMoreItems = ref(true);

const fetchItems = async () => {
  if (!hasMoreItems.value) return;
  try {
    const response = await fetch(
      `http://localhost:8080/api/v1/user/my/tickets/history?userId=1&month=${selectedMonth.value}&year=${selectedYear.value}&page=${page.value}&size=7`,
    );
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const fetchedData = await response.json();

    if (
      fetchedData &&
      fetchedData.combinedHistory &&
      Array.isArray(fetchedData.combinedHistory)
    ) {
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
    }
  } catch (error) {
    console.error('데이터 로드 오류:', error);
  }
};

const loadMoreItems = () => {
  fetchItems();
};

const resetLoadItems = () => {
  page.value = 1;
  myHistory.value = [];
  hasMoreItems.value = true;
  fetchItems();
};

onMounted(() => {
  fetchItems();
});

const route = useRoute();
onBeforeMount(() => {
  route.meta.title = '내 식권';
});
</script>
