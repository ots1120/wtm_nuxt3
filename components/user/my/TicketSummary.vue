<template>
  <div class="w-full bg-white shadow-sm">
    <div class="flex px-4 py-6 justify-between">
      <div class="relative">
        <button
          @click="toggleDatePicker"
          class="flex items-center justify-start px-3 py-2 text-left border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {{ formattedDate }}
        </button>
        <div v-if="showDatePicker" class="absolute z-10 mt-1 bg-white shadow-lg rounded-md p-4">
          <div class="flex justify-between items-center mb-4">
            <button @click="changeYear(-1)" class="p-1">
              <span class="material-icons">chevron_left</span>
            </button>
            <span class="font-bold">{{ selectedYear }}년</span>
            <button @click="changeYear(1)" class="p-1">
              <span class="material-icons">chevron_right</span>
            </button>
          </div>
          <div class="grid grid-cols-3 gap-2">
            <button
              v-for="month in 12"
              :key="month"
              @click="selectMonth(month)"
              class="p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              :class="{ 'bg-blue-100': selectedMonth === month }"
            >
              {{ month }}월
            </button>
          </div>
        </div>
      </div>
      
      <div class="space-y-2 w-40 text-right">
        <div class="flex justify-between">
          <span class="text-gray-600">구매</span>
          <span>{{ props.purchasePrice }} 원</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-600">사용</span>
          <span class="text-blue-500">{{ props.usedPrice }} 원</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-600">잔여수량</span>
          <span class="text-red-500">{{ props.remainingCount }}개</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, watch } from 'vue';

interface TicketData {
  purchasePrice: Number;
  usedPrice: Number;
  remainingCount: Number;
  selectedMonth: number;
  selectedYear: number;
}

const props = defineProps<TicketData>();

const emit = defineEmits<{
  (e: 'dateChanged', payload: { month: number; year: number }): void;
}>();

const selectedYear = ref(props.selectedYear);
const selectedMonth = ref(props.selectedMonth);
const showDatePicker = ref(false);

const formattedDate = computed(() => {
  return `${selectedYear.value}년 ${selectedMonth.value}월`;
});

const toggleDatePicker = () => {
  showDatePicker.value = !showDatePicker.value;
};

const changeYear = (delta: number) => {
  selectedYear.value += delta;
};

const selectMonth = (month: number) => {
  selectedMonth.value = month;
  showDatePicker.value = false;
  emit('dateChanged', { month: selectedMonth.value, year: selectedYear.value });
};

// watch to emit changes to parent
watch([selectedMonth, selectedYear], () => {
  emit('dateChanged', { month: selectedMonth.value, year: selectedYear.value });
});
</script>

<style scoped></style>
