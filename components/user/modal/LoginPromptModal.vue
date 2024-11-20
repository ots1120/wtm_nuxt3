<template>
  <Transition name="modal">
    <div
      v-if="isVisible"
      class="fixed inset-0 z-50 flex items-center justify-center"
    >
      <div
        class="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm"
      ></div>
      <div
        class="bg-white rounded-2xl shadow-lg w-80 overflow-hidden relative z-10"
      >
        <div class="p-6">
          <h2 class="text-xl font-semibold mb-4 text-center text-gray-800">
            로그인이 필요합니다
          </h2>
          <p class="mb-6 text-center text-base text-gray-600">
            북마크를 저장하려면 로그인이 필요합니다. 로그인하시겠습니까?
          </p>
        </div>
        <div class="flex border-t border-gray-200">
          <button
            class="w-full py-3 text-base font-medium text-blue-500 transition duration-200 ease-in-out hover:bg-blue-50 active:bg-blue-100"
            @click="$emit('cancel')"
          >
            취소
          </button>
          <div class="w-px bg-gray-200"></div>
          <button
            class="w-full py-3 text-base font-medium text-red-500 transition duration-200 ease-in-out hover:bg-blue-50 active:bg-blue-100"
            @click="$emit('confirm')"
          >
            로그인
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// 모달 가시성 상태
const isVisible = ref(true);

// 외부에서 모달을 닫는 경우를 처리
const closeModal = () => {
  isVisible.value = false;
};
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
