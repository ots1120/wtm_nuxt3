<template>
  <div class="container px-4">
    <div class="max-w-lg mx-auto">
      <div>
        <!-- TicketSummary 컴포넌트 -->
        <TicketSummary
          :purchase-price="ticketData.purchasePrice"
          :used-price="ticketData.usedPrice"
          :remaining-count="ticketData.remainingCount"
          :selected-month="selectedMonth"
          :selected-year="selectedYear"
          @date-changed="handleDateChanged"
        />
        <!-- 타입 선택 버튼 그룹 -->
        <div class="flex justify-start p-4">
          <button
            v-for="option in typeOptions"
            :key="option.value"
            class="px-4 py-2 border rounded-md mx-1"
            :class="{
              'bg-blue-100 text-blue-500': selectedType === option.value,
              'bg-gray-100 text-gray-500': selectedType !== option.value,
            }"
            @click="handleTypeChanged(option.value)"
          >
            {{ option.label }}
          </button>
        </div>

        <!-- 로딩 스피너 -->
        <div
          v-if="isLoading"
          class="flex justify-center items-center mt-6 h-24"
        >
          <svg
            class="animate-spin h-8 w-8 text-blue-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            />
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8z"
            />
          </svg>
        </div>

        <!-- 목록 데이터 -->
        <div v-else-if="myHistory.length > 0" class="mt-2">
          <TicketHistoryList
            :my-history="myHistory"
            :selected-month="selectedMonth"
            :selected-year="selectedYear"
            :selected-type="selectedType"
            :has-more-items="hasMoreItems"
            @load-more-items="loadMoreItems"
            @reset-load-items="resetLoadItems"
          />
        </div>

        <!-- 데이터 없음 메시지 -->
        <div v-else ref="containerRef" class="h-[70vh] overflow-hidden">
          <div
            ref="scrollContainer"
            class="h-full overflow-y-auto pr-4 space-y-4"
          >
            <div class="flex flex-col items-center mt-6">
              <div class="text-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-12 w-12 mx-auto text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="1.5"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M9.75 9.75h4.5m-4.5 4.5h4.5M6.75 3h10.5c1.242 0 2.25 1.008 2.25 2.25v13.5c0 1.242-1.008 2.25-2.25 2.25H6.75C5.508 21 4.5 19.992 4.5 18.75V5.25C4.5 4.008 5.508 3 6.75 3z"
                  />
                </svg>
                <p class="mt-4 text-lg text-gray-600 font-semibold">
                  구매 및 사용 이력이 없습니다.
                </p>
                <p class="text-gray-500">
                  선택한 기간 내에 거래 기록이 표시되지 않습니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import TicketSummary from '~/components/user/my/TicketSummary.vue';
import TicketHistoryList from '~/components/user/my/TicketHistoryList.vue';

interface TicketData {
  purchasePrice: number;
  usedPrice: number;
  remainingCount: number;
}

interface TicketHistory {
  storeId: number;
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

const typeOptions = [
  { label: '전체', value: 'all' },
  { label: '구매', value: 'purchase' },
  { label: '사용', value: 'usage' },
];

const authstore = useAuthStore();
const username = authstore.user?.username;
const myHistory = ref<TicketHistory[]>([]);
const selectedMonth = ref<number>(new Date().getMonth() + 1);
const selectedYear = ref<number>(new Date().getFullYear());
const selectedType = ref('all'); // selectedType 상태 관리
const page = ref(0);
const hasMoreItems = ref(true);
const isLoading = ref(false); // 로딩 상태 추가
const config = useRuntimeConfig();
const baseUrl = config.public.baseApiUrl;

/**
 * 데이터 로드 함수
 */
const fetchItems = async () => {
  console.log('Fetching items...'); // 디버깅용 로그
  if (!hasMoreItems.value || isLoading.value) return; // 이미 로딩 중이면 중단
  isLoading.value = true; // 로딩 시작
  try {
    const response = await fetch(
      `${baseUrl}/api/v1/user/my/tickets/history?username=${username}&month=${selectedMonth.value}&year=${selectedYear.value}&type=${selectedType.value}&page=${page.value}&size=7`,
    );
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const fetchedData = await response.json();

    if (fetchedData?.combinedHistory?.length) {
      // 요약 정보 업데이트
      ticketData.value = {
        purchasePrice: fetchedData.totalPurchasedPrice,
        usedPrice: fetchedData.totalUsedPrice,
        remainingCount: fetchedData.totalAmount,
      };

      // 첫 페이지일 경우 데이터 교체, 아닐 경우 추가
      if (page.value === 0) {
        myHistory.value = fetchedData.combinedHistory;
      } else {
        myHistory.value = [...myHistory.value, ...fetchedData.combinedHistory];
      }

      // 다음 페이지 유무 판단
      page.value++;
      hasMoreItems.value = page.value <= fetchedData.totalPages;
    } else {
      hasMoreItems.value = false; // 더 이상 로드할 데이터 없음
    }
  } catch (error) {
    console.error('데이터 로드 오류:', error);
  } finally {
    isLoading.value = false; // 로딩 종료
  }
};

/**
 * "더보기" 버튼 클릭 시
 */
const loadMoreItems = () => {
  fetchItems();
};

/**
 * 날짜 변경 시 데이터 초기화 후 재로드
 */
const resetLoadItems = () => {
  console.log('Resetting items...'); // 디버깅용 로그
  page.value = 0;
  myHistory.value = [];
  hasMoreItems.value = true;
  fetchItems(); // 초기화 후 데이터 다시 로드
};

/**
 * 날짜 변경 이벤트 핸들러
 */
const handleDateChanged = ({
  month,
  year,
}: {
  month: number;
  year: number;
}) => {
  selectedMonth.value = month;
  selectedYear.value = year;
  resetLoadItems();
};

/**
 * 타입 변경 이벤트 핸들러
 */
const handleTypeChanged = (newType: string) => {
  console.log(`Type changed to: ${newType}`); // 디버깅용 로그
  selectedType.value = newType; // 선택한 타입 변경
  resetLoadItems(); // 타입 변경 시 데이터 리셋 후 새로 로드
};

/**
 * 페이지가 마운트될 때 데이터 로드
 */
const route = useRoute();
onMounted(() => {
  route.meta.title = '전체 식권 내역';
  fetchItems(); // 초기 데이터 로드
});
</script>
