<template>
  <div
    v-if="visible"
    class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50"
  >
    <div class="w-full max-w-sm rounded-lg bg-white shadow-lg">
      <div class="p-6">
        <!-- 타이틀 -->
        <h2 class="mb-4 text-center text-2xl font-semibold">
          {{ messageTitle }}
        </h2>
        <!-- 메시지 -->
        <p class="mb-6 text-gray-600 break-words">
          {{ messageBody }}
        </p>
      </div>
      <!-- 버튼 영역 -->
      <div class="flex">
        <button
          class="w-full rounded-bl-lg bg-gray-200 px-4 py-3 text-gray-800"
          @click="handleCancel"
        >
          {{ cancelMessage }}
        </button>
        <button
          class="w-full rounded-br-lg bg-red-500 px-4 py-3 text-white"
          @click="handleConfirm"
        >
          {{ confirmMessage }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Props 정의
const props = defineProps<{
  visible: boolean; // 모달 표시 여부
  messageTitle: string; // 모달 타이틀
  messageBody: string; // 모달 메시지 내용
  cancelMessage: string;
  confirmMessage: string;
}>();

// Emit 정의
const emit = defineEmits<{
  (event: 'confirm'): void; // 확인 버튼 클릭 시
  (event: 'cancel'): void; // 취소 버튼 클릭 시
}>();

// 확인 버튼 핸들러
const handleConfirm = () => {
  emit('confirm'); // 부모 컴포넌트로 'confirm' 이벤트 전송
};

// 취소 버튼 핸들러
const handleCancel = () => {
  emit('cancel'); // 부모 컴포넌트로 'cancel' 이벤트 전송
};
</script>
