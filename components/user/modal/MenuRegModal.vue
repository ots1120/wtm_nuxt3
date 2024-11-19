<template>
  <div
    v-if="visible"
    class="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50 p-0"
  >
    <div class="w-full max-w-sm rounded-lg bg-white p-0 shadow-lg">
      <div class="-mb-6 p-6">
        <h2 class="mb-4 text-center text-2xl font-semibold">
          메뉴 등록을 하시겠습니까??
        </h2>
        <p class="mb-6 break-words text-gray-600">
          허위 정보 또는 부적절한 내용을 작성하지 말아주세요. 메뉴 등록 시 실제
          메뉴와 관련된 정확한 정보를 입력해 주세요. 허위 정보나 장난성 내용이
          발견될 경우, 해당 등록은 즉시 삭제되며, 추가적인 조치가 취해질 수
          있습니다
        </p>
      </div>
      <div class="flex w-full">
        <button
          class="w-full rounded-bl-lg bg-gray-200 px-4 py-3 text-gray-800"
          @click="cancel"
        >
          취소
        </button>
        <button
          class="w-full rounded-br-lg bg-red-500 px-4 py-3 text-white"
          @click="confirm"
        >
          등록
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
