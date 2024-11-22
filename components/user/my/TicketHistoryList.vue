<template>
  <div ref="containerRef" class="h-[70vh] overflow-hidden">
    <!-- 히스토리 목록 -->
    <div ref="scrollContainer" class="h-full overflow-y-auto pr-4 space-y-4">
      <div
        v-for="(history, index) in myHistory"
        :key="history.id"
        class="bg-white shadow-sm rounded-lg p-4"
      >
        <!-- 날짜 -->
        <div class="mb-2 text-sm text-gray-500">{{ history.formattedRegDate }}</div>

        <!-- 상세 정보 -->
        <div class="flex items-center">
          <!-- 아이콘 -->
          <div class="flex items-center space-x-2">
            <img src="@/assets/icons/fork_knife.svg" alt="icon" class="h-4 w-4" />
          </div>

          <!-- 가격 및 상점명 -->
          <div class="ml-2 flex-grow">
            <div class="text-lg font-semibold" :class="formattedPriceClass(history)">
              {{ formattedPrice(history) }}원
            </div>
            <div class="text-sm text-gray-500">{{ history.storeName }}</div>
          </div>

          <!-- 시간 및 리뷰 쓰기 버튼 -->
          <div class="text-end">
            <div class="text-sm text-gray-400">{{ history.formattedTime }}</div>
            <div v-if="!history.hasReview && history.type === 'usage'">
              <a
                class="cursor-pointer"
                @click.prevent="navigateToWithState(history.id, history.storeId)"
              >
                <span class="text-sm text-blue-800">리뷰쓰기</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- 무한 스크롤 트리거 -->
      <div ref="observerTarget" class="h-10"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount, nextTick } from "vue";

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

// Props 및 Emits
const props = defineProps<{
  myHistory: TicketHistory[];
  selectedMonth: number;
  selectedYear: number;
  hasMoreItems: boolean;
  selectedType: string; // 부모의 selectedType 전달받음
}>();

const emit = defineEmits(["loadMoreItems", "resetLoadItems"]);

// 가격 표시 및 클래스 설정
const formattedPrice = (history: TicketHistory) => {
  return history.type === "purchase" ? `+${history.price}` : `-${history.price}`;
};

const formattedPriceClass = (history: TicketHistory) => {
  return history.type === "purchase" ? "text-blue-500" : "text-red-500";
};

// 네비게이션 상태 설정
const { setState } = useNavigationState();
const router = useRouter();
const navigateToWithState = (ticketHistoryUsageId: number, storeId: number) => {
  setState("ticketHistoryUsageId", ticketHistoryUsageId);
  setState("storeId", storeId);
  router.push({ path: `/stores/${storeId}/reviews/new` });
};

// 무한 스크롤 관찰자 설정
const containerRef = ref<HTMLElement | null>(null);
const observerTarget = ref<HTMLElement | null>(null);
let intersectionObserver: IntersectionObserver | null = null;

const setupObserver = () => {
  if (intersectionObserver) {
    intersectionObserver.disconnect();
  }

  intersectionObserver = new IntersectionObserver(
    ([entry]) => {
      if (entry?.isIntersecting && props.hasMoreItems) {
        emit("loadMoreItems");
      }
    },
    { root: containerRef.value, rootMargin: "0px", threshold: 0.1 }
  );

  if (observerTarget.value) {
    intersectionObserver.observe(observerTarget.value);
  }
};

onMounted(() => {
  setupObserver();
});

onBeforeUnmount(() => {
  if (intersectionObserver) {
    intersectionObserver.disconnect();
  }
});

// Props 변경에 따라 새 데이터 로드
watch(
  () => props.myHistory,
  () => {
    nextTick(() => setupObserver());
  },
  { deep: true }
);
</script>

<style scoped>
/* 스크롤바 스타일 */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  @apply bg-gray-100;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  @apply bg-gray-400 rounded-full;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  @apply bg-gray-500;
}
</style>
