<!-- components/user/stores/detail/StoreDetailTicket.vue -->
<template>
  <div class="flex justify-center">
    <div
      class="flex w-2/3 max-w-lg flex-col items-center gap-4 rounded-lg bg-gray-100 p-7"
    >
      <h3 class="w-full text-lg font-bold text-black">{{ storeName }}</h3>
      <p class="flex justify-between w-full text-gray-600">
        식권 잔여 개수
        <span class="font-semibold text-black">{{ remainingTickets }}개</span>
      </p>

      <!-- Navigation Button -->
      <NuxtLink :to="`/my/tickets/stores/${storeId}`" class="w-full">
        <button
          type="button"
          class="w-full rounded-lg bg-[#db3d39] hover:bg-[#c22420] px-4 py-2 font-semibold text-white"
        >
          식권 충전하기
        </button>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  storeName: {
    type: String,
    required: true,
  },
  remainingTickets: {
    type: Number,
    required: true,
  },
  storeId: {
    // storeId prop 추가
    type: [String, Number],
    required: true,
  },
});

console.log('StoreDetailTicket - storeId:', props.storeId);
</script>

<style scoped>
/* 컴포넌트 개별 스타일 */
</style>
