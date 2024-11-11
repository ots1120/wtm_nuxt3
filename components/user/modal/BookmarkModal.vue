<template>
  <div
    v-if="visible"
    class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 p-0"
  >
    <div class="w-full max-w-sm rounded-lg bg-white p-0 shadow-lg">
      <div class="-mb-6 p-6">
        <h2 class="mb-4 text-center text-2xl font-semibold">
          북마크를 삭제하시겠습니까?
        </h2>
        <p class="mb-6 break-words text-gray-600">
          북마크를 삭제하시려면 확인을 눌러주세요.
        </p>
      </div>
      <div class="flex w-full">
        <button
          @click="cancel"
          class="w-full rounded-bl-lg bg-gray-200 px-4 py-3 text-gray-800"
        >
          취소
        </button>
        <button
          @click="confirm"
          class="w-full rounded-br-lg bg-red-500 px-4 py-3 text-white"
        >
          삭제
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

const props = defineProps<{ visible: boolean; storeId: number | null }>();
const emit = defineEmits<{
  (event: 'cancel'): void;
  (event: 'confirm', storeId: number): void;
}>();

const cancel = (): void => {
  emit('cancel');
  console.log('북마크 삭제가 취소되었습니다.');
};

const confirm = (): void => {
  if (props.storeId !== null) {
    emit('confirm', props.storeId);
  }
};
</script>

