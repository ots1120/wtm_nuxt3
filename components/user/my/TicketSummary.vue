<template>
  <div class="w-full bg-white shadow-sm">
    <div class="flex px-4 py-6 justify-between">
      <!-- 날짜 선택기 -->
      <div class="relative">
        <button
          class="flex items-center justify-start px-3 py-2 text-left border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          @click="toggleDatePicker"
        >
          {{ formattedDate }}
        </button>
        <div
          v-if="showDatePicker"
          class="w-96 absolute z-10 mt-1 bg-white shadow-lg rounded-md p-4"
        >
          <div class="flex justify-between items-center mb-4">
            <button class="p-1" @click="changeYear(-1)">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-6 h-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>
            </button>
            <span class="font-bold">{{ selectedYearRef }}년</span>
            <button class="p-1" @click="changeYear(1)">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-6 h-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                />
              </svg>
            </button>
          </div>
          <div class="grid grid-cols-3 gap-2">
            <button
              v-for="month in 12"
              :key="month"
              class="p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              :class="{ 'bg-blue-100': selectedMonthRef === month }"
              @click="selectMonth(month)"
            >
              {{ month }}월
            </button>
          </div>
        </div>
      </div>

      <!-- 요약 정보 -->
      <div class="space-y-2 w-40 text-right">
        <div class="flex justify-between">
          <span class="text-gray-600">구매</span>
          <span class="text-blue-500"
            >{{ formattedPriceComma(props.purchasePrice) }} 원</span
          >
        </div>
        <div class="flex justify-between">
          <span class="text-gray-600">사용</span>
          <span class="text-red-500"
            >{{ formattedPriceComma(props.usedPrice) }} 원</span
          >
        </div>
        <div class="flex justify-between">
          <span class="text-gray-600">잔여수량</span>
          <span>{{ formattedPriceComma(props.remainingCount) }} 개</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface TicketData {
  purchasePrice: number;
  usedPrice: number;
  remainingCount: number;
  selectedMonth: number;
  selectedYear: number;
}

const props = defineProps<TicketData>();

const emit = defineEmits<{
  (e: 'dateChanged', payload: { month: number; year: number }): void;
}>();

// 1000 단위로 쉼표 추가
const formattedPriceComma = (price: number) => {
  return price.toLocaleString();
};

const selectedYearRef = ref(props.selectedYear);
const selectedMonthRef = ref(props.selectedMonth);
const showDatePicker = ref(false);

const formattedDate = computed(() => {
  return `${selectedYearRef.value}년 ${selectedMonthRef.value}월`;
});

const toggleDatePicker = () => {
  showDatePicker.value = !showDatePicker.value;
};

const changeYear = (delta: number) => {
  selectedYearRef.value += delta;
  emit('dateChanged', {
    month: selectedMonthRef.value,
    year: selectedYearRef.value,
  });
};

const selectMonth = (month: number) => {
  selectedMonthRef.value = month;
  showDatePicker.value = false;
  emit('dateChanged', {
    month: selectedMonthRef.value,
    year: selectedYearRef.value,
  });
};
</script>
