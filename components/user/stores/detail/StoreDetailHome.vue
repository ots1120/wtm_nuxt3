<template>
  <div class="mt-3 space-y-4">
    <!-- 주소 정보 -->
    <div class="flex items-center gap-2">
      <svg
        class="w-5 h-5 text-gray-700 flex-shrink-0"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="12" cy="9" r="3" />
        <path
          d="M12 2C8.134 2 5 5.134 5 9c0 4.902 6 11.902 7 13 1-1.098 7-8.098 7-13 0-3.866-3.134-7-7-7z"
        />
      </svg>
      <span>
        {{ props.store.address.address || '주소 정보 없음' }}
        {{ props.store.address.detailAddress }}
        {{ props.store.address.extraAddress }}
      </span>
    </div>

    <!-- SNS 링크 -->
    <div v-if="props.store.storeSns?.url" class="flex items-center gap-2">
      <svg
        class="w-5 h-5 text-gray-700 flex-shrink-0"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        fill="currentColor"
      >
        <text
          x="50%"
          y="50%"
          dominant-baseline="middle"
          text-anchor="middle"
          font-family="Arial, sans-serif"
          font-size="50"
          font-weight="bold"
          fill="currentColor"
        >
          SNS
        </text>
      </svg>
      <a :href="props.store.storeSns.url" target="_blank" class="text-blue-500">
        {{ props.store.storeSns.url }}
      </a>
    </div>

    <!-- 연락처 정보 (복사 버튼 포함) -->
    <div class="flex items-center gap-2">
      <svg
        class="w-5 h-5 text-gray-700 flex-shrink-0"
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M6.62 10.79a15.34 15.34 0 006.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.27 1.12.27 2.33.42 3.57.42.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-10.5 0-19-8.5-19-19 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.24.15 2.45.42 3.57.09.35 0 .74-.27 1.02l-2.2 2.2z"
        />
      </svg>
      <span>{{ props.store.contact || '연락처 정보 없음' }}</span>
      <button class="text-blue-500 underline ml-2" @click="copyPhoneNumber">
        복사
      </button>
    </div>

    <!-- 운영 시간 정보 -->
    <div class="flex items-center gap-2">
      <svg
        class="w-5 h-5 text-gray-700 flex-shrink-0"
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 13h-6V7h2v6h4v2z"
        />
      </svg>
      <span>{{ props.store.operatingHours || '운영 시간 정보 없음' }}</span>
    </div>

    <!-- 가격 정보 -->
    <div class="flex items-center gap-2">
      <svg
        class="w-5 h-5 text-gray-700 flex-shrink-0"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
      </svg>
      <span>{{
        props.store.ticket?.price
          ? `${props.store.ticket.price}원`
          : '가격 정보 없음'
      }}</span>
    </div>

    <!-- 모달 알림 (전화번호 복사) -->
    <div
      v-if="showModal"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
    >
      <div class="bg-white p-6 rounded-lg shadow-lg text-center">
        <p class="text-gray-800">전화번호가 복사되었습니다.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// Props를 통해 부모 컴포넌트에서 store 데이터를 전달받음
const props = defineProps({
  store: {
    type: Object,
    required: true,
  },
});

// 모달 창 상태
const showModal = ref(false);

// 전화번호 복사 함수
function copyPhoneNumber() {
  if (props.store.contact) {
    navigator.clipboard
      .writeText(props.store.contact)
      .then(() => {
        showModal.value = true; // 모달 창 표시
        setTimeout(() => {
          showModal.value = false; // 1초 후 모달 창 숨기기
        }, 1000);
      })
      .catch((err) => {
        console.error('복사에 실패했습니다:', err);
      });
  }
}
</script>

<style scoped>
/* Tailwind CSS만 사용하므로 별도의 CSS 스타일은 없습니다 */
</style>
