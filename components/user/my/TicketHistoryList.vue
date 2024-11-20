<template>
  <div class="h-[70vh] overflow-hidden" ref="containerRef">
    <div class="h-full overflow-y-auto pr-4 space-y-4" ref="scrollContainer">
      <div v-for="(history, index) in myHistory" 
        :key="history.id"
        class="bg-white shadow-sm rounded-lg p-4"
      >
        <div class="mb-2 text-sm text-gray-500">{{ history.formattedRegDate }}</div>
        <div class="flex items-center">
          <div class="flex items-center space-x-2">
            <img src="@/assets/icons/fork_knife.svg" alt="icon" class="h-4 w-4" />
          </div>
          <div class="ml-2 flex-grow">
            <div class="text-lg font-semibold text-gray-700">{{ formattedPrice(history) }}원</div>
            <div class="text-sm text-gray-500">{{ history.storeName }}</div>
          </div>
          <div>
            <div class="text-sm text-gray-400">{{ history.formattedTime }}</div>
            <div v-if="!history.hasReview && history.type === 'usage'">
              <a
              class="cursor-pointer"
              @click.prevent="navigateToWithState(history.id, history.storeId)"
              >
              <span class="text-sm text-blue-800">글쓰기</span>
            </a>
            </div>
          </div>
        </div>
      </div>
      <div ref="observerTarget" class="h-10"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onBeforeUnmount, nextTick } from 'vue';

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

const props = defineProps<{ 
  myHistory: TicketHistory[], 
  selectedMonth: number, 
  selectedYear: number,
  hasMoreItems: boolean
}>();

const router = useRouter();

const containerRef = ref<HTMLElement | null>(null);
const observerTarget = ref<HTMLElement | null>(null);
const scrollContainer = ref<HTMLElement | null>(null);

let intersectionObserver: IntersectionObserver | null = null;

const emit = defineEmits(['loadMoreItems', 'resetLoadItems']);

const formattedPrice = (history: TicketHistory) => {
  return history.type === 'purchase' ? `+${history.price}` : `-${history.price}`;
};


const setupObserver = () => {
  if (intersectionObserver) {
    intersectionObserver.disconnect();
  }

  intersectionObserver = new IntersectionObserver(([entry]) => {
    if (entry && entry.isIntersecting && props.hasMoreItems) {
      emit('loadMoreItems');
    }
  }, {
    root: containerRef.value,
    rootMargin: '0px',
    threshold: 0.1,
  });
  
  if (observerTarget.value) {
    intersectionObserver.observe(observerTarget.value);
  }
};

const navigateToWithState = (ticketHistoryUsageId: number, storeId: number) => {
  router.push({
    path: `/stores/${storeId}/reviews/new`,
    state: { ticketHistoryUsageId, storeId }
  });
};

onMounted(() => {
  setupObserver();
});

onBeforeUnmount(() => {
  if (intersectionObserver) {
    intersectionObserver.disconnect();
  }
});

watch(
  () => [props.selectedMonth, props.selectedYear],
  () => {
    emit('resetLoadItems');
  },
  { deep: true }
);

watch(
  () => props.myHistory,
  () => {
    nextTick(() => {
      setupObserver();
    });
  },
  { deep: true }
);
</script>

<style scoped>
/* Webkit 스크롤바 스타일링 */
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