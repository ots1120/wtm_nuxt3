<template>
  <div class="mt-4">
    <!-- 주소 정보 -->
    <div class="flex items-center gap-3 py-4 border-gray-200">
      <svg
        class="w-6 h-6 text-gray-600 flex-shrink-0"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <circle cx="12" cy="9" r="3" />
        <path
          d="M12 2C8.134 2 5 5.134 5 9c0 4.902 6 11.902 7 13 1-1.098 7-8.098 7-13 0-3.866-3.134-7-7-7z"
        />
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
        class="w-6 h-6 text-gray-600 flex-shrink-0"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path
          d="M6.62 10.79a15.34 15.34 0 006.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.27 1.12.27 2.33.42 3.57.42.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-10.5 0-19-8.5-19-19 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.24.15 2.45.42 3.57.09.35 0 .74-.27 1.02l-2.2 2.2z"
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
        class="w-6 h-6 text-gray-600 flex-shrink-0"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path
          d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 13h-6V7h2v6h4v2z"
        />
      </svg>
      <span class="text-gray-800">{{
        store.operatingHours || '운영 시간 정보 없음'
      }}</span>
    </div>

    <!-- 가격 정보 -->
    <div class="flex items-center gap-3 py-4">
      <svg
        class="w-6 h-6 text-gray-600 flex-shrink-0"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
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
