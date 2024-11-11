<template>
  <div class="mt-3 space-y-4">
    <div class="flex items-center gap-4">
      <svg class="w-5 h-5 text-gray-700" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C8.13401 2 5 5.13401 5 9C5 13.902 11 21 12 22C13 21 19 13.902 19 9C19 5.13401 15.866 2 12 2ZM12 11C10.8954 11 10 10.1046 10 9C10 7.89543 10.8954 7 12 7C13.1046 7 14 7.89543 14 9C14 10.1046 13.1046 11 12 11Z" />
      </svg>
      <span>{{ store?.address || '주소 정보 없음' }}</span>
    </div>

    <div v-if="store?.storeSns?.url" class="flex items-center gap-4">
      <span class="font-semibold text-gray-700">SNS</span>
      <a :href="store.storeSns.url" target="_blank" class="text-blue-500">
        {{ store.storeSns.url }}
      </a>
    </div>

    <div class="flex items-center gap-4">
      <svg class="w-5 h-5 text-gray-700" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M6.62 10.79a15.34 15.34 0 006.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.27 1.12.27 2.33.42 3.57.42.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-10.5 0-19-8.5-19-19 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.24.15 2.45.42 3.57.09.35 0 .74-.27 1.02l-2.2 2.2z" />
      </svg>
      <span>{{ store?.contact || '연락처 정보 없음' }}</span>
    </div>

    <div class="flex items-center gap-4">
      <svg class="w-5 h-5 text-gray-700" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 13h-6V7h2v6h4v2z" />
      </svg>
      <span>{{ store?.operatingHours || '운영 시간 정보 없음' }}</span>
    </div>

    <div class="flex items-center gap-4">
      <svg class="w-5 h-5 text-gray-700" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 1C5.93 1 1 5.93 1 12s4.93 11 11 11 11-4.93 11-11S18.07 1 12 1zm0 18.93c-4.42 0-8.08-3.45-8.08-7.93S7.58 5.07 12 5.07s8.08 3.45 8.08 7.93-3.66 7.93-8.08 7.93z" />
      </svg>
      <span>{{ store?.ticket?.price ? `${store.ticket.price}원` : '가격 정보 없음' }}</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  store: {
    type: Object,
    required: true,
  },
});
</script>

<style scoped>
/* Tailwind CSS만 사용하므로 별도의 CSS 스타일은 없습니다 */
</style>
