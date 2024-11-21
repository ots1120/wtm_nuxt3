<template>
  <Transition name="modal">
    <div
      v-if="visible"
      class="fixed inset-0 z-50 flex items-center justify-center"
    >
      <div
        class="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm"
      ></div>
      <div
        class="w-full max-w-sm rounded-2xl bg-white shadow-lg overflow-hidden relative z-10"
      >
        <div class="p-6">
          <!-- Title -->
          <h2 class="mb-4 text-center text-xl font-semibold text-gray-800">
            리뷰를 삭제하시겠습니까?
          </h2>
          <!-- Message -->
          <p class="mb-6 text-center text-base text-gray-600 break-words">
            삭제하시면 더 이상 해당 리뷰가 노출 되지 않습니다.
          </p>
        </div>
        <!-- Button area -->
        <div class="flex border-t border-gray-200">
          <button
            class="w-full py-3 text-base font-medium text-blue-500 transition duration-200 ease-in-out hover:bg-blue-50 active:bg-blue-100"
            @click="cancel"
          >
            취소
          </button>
          <div class="w-px bg-gray-200"></div>
          <button
            class="w-full py-3 text-base font-medium text-red-500 transition duration-200 ease-in-out hover:bg-red-50 active:bg-red-100"
            @click="confirm"
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

const props = defineProps<{ visible: boolean; reviewId: number | null }>();
const emit = defineEmits<{
  (event: 'cancel'): void;
  (event: 'confirm', reviewId: number): void;
}>();

const cancel = (): void => {
  emit('cancel');
  console.log('북마크 삭제가 취소되었습니다.');
};

const confirm = (): void => {
  if (props.reviewId !== null) {
    emit('confirm', props.reviewId);
  }
};
</script>
