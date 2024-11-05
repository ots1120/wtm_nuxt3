<template>
  <div class="mt-3 flex-col">
    <div class="mb-5 flex items-center gap-5">
      <svg
        class="w-8"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <!-- SVG contents -->
      </svg>
      <span>{{ store.address }}</span>
    </div>

    <div class="mb-5 flex items-center gap-5">
      <svg
        class="w-8"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <!-- SVG contents -->
      </svg>
      <a>{{ storeSns?.url || 'SNS 정보 없음' }}</a>
    </div>

    <div class="mb-5 flex items-center gap-5">
      <svg
        class="w-8"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <!-- SVG contents -->
      </svg>
      <span>{{ store.contact }}</span>
    </div>

    <div class="mb-5 flex items-center gap-5">
      <svg
        class="w-8"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <!-- SVG contents -->
      </svg>
      <span>{{ store.operatingHours }}</span>
    </div>

    <div class="mb-5 flex items-center gap-5">
      <svg
        class="w-8"
        viewBox="-0.5 0 25 25"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <!-- SVG contents -->
      </svg>
      <span>{{ Ticket.price ? `${Ticket.price}원` : '가격 정보 없음' }}</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  store: {
    type: Object,
    required: true,
  },
  Ticket: {
    type: Object,
    required: true,
  },
  storeSns: {
    type: Object,
    required: true,
  },
});
</script>

<style scoped>
/* 스타일 추가 */
</style>
