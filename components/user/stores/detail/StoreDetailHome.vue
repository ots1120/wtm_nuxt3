<template>
  <div class="mt-4">
    <!-- 주소 정보 -->
    <div class="flex items-center gap-3 py-4 border-gray-200">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="lucide lucide-map-pin"
      >
        <path
          d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"
        />
        <circle cx="12" cy="10" r="3" />
      </svg>
      <span class="text-gray-800">
        {{ store.address.address || '주소 정보 없음' }}
        {{ store.address.detailAddress }}
        {{ store.address.extraAddress }}
      </span>
    </div>

    <!-- SNS 링크 -->
    <div
      v-if="store.storeSns?.url"
      class="flex items-center gap-3 py-4 border-gray-200"
    >
      <svg
        class="w-6 h-6 text-gray-600 flex-shrink-0"
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
      <a :href="store.storeSns.url" target="_blank" class="text-blue-600">
        {{ store.storeSns.url }}
      </a>
    </div>

    <!-- 연락처 정보 (복사 버튼 포함) -->
    <div class="flex items-center gap-3 py-4 border-gray-200">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="lucide lucide-phone"
      >
        <path
          d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
        />
      </svg>
      <span class="text-gray-800">{{
        store.contact || '연락처 정보 없음'
      }}</span>
      <button
        class="ml-2 text-blue-600 font-medium focus:outline-none"
        @click="copyPhoneNumber"
      >
        복사
      </button>
    </div>

    <!-- 운영 시간 정보 -->
    <div class="flex items-center gap-3 py-4 border-gray-200">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="lucide lucide-clock"
      >
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
      <span class="text-gray-800">{{
        store.operatingHours || '운영 시간 정보 없음'
      }}</span>
    </div>

    <!-- 가격 정보 -->
    <div class="flex items-center gap-3 py-4">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="lucide lucide-banknote"
      >
        <rect width="20" height="12" x="2" y="6" rx="2" />
        <circle cx="12" cy="12" r="2" />
        <path d="M6 12h.01M18 12h.01" />
      </svg>
      <span class="text-gray-800">{{
        store.ticket?.price ? `${store.ticket.price}원` : '가격 정보 없음'
      }}</span>
    </div>

    <!-- 모달 알림 (전화번호 복사) -->
    <transition name="fade">
      <div
        v-if="showModal"
        class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50"
      >
        <div class="bg-white px-6 py-4 rounded-lg shadow-lg text-center">
          <p class="text-gray-800">전화번호가 복사되었습니다.</p>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// Props로 store 데이터를 전달받음
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
  if (store.contact) {
    navigator.clipboard
      .writeText(store.contact)
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

// store를 직접 사용할 수 있도록 설정
const { store } = props;
</script>

<style scoped>
/* 애플 스타일을 위한 추가 스타일 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
