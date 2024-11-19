<!-- <template>
  <div
    v-if="isVisible"
    class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center"
  >
    <div class="bg-white p-6 rounded-lg shadow-md w-1/3">
      <h2 class="text-xl font-semibold mb-4">{{ title }}</h2>

      <div class="mb-4">
        <p class="text-gray-700 font-semibold">스캔된 정보:</p>
        <p class="text-gray-600">사용자 ID: {{ decodedData.userId }}</p>
        <p class="text-gray-600">
          식권 금액: {{ decodedData.ticketQuantity }}원
        </p>
      </div>

      <div
        v-if="approvalStatus === 'approved'"
        class="p-4 bg-green-100 border border-green-400 rounded-md"
      >
        <p class="text-green-700 font-semibold">승인 완료</p>
        <p class="text-green-600">식권 사용/충전이 승인되었습니다.</p>
      </div>
      <div
        v-else-if="approvalStatus === 'rejected'"
        class="p-4 bg-red-100 border border-red-400 rounded-md"
      >
        <p class="text-red-700 font-semibold">승인 거절</p>
        <p class="text-red-600">{{ errorMessage }}</p>
      </div>

      <div class="flex justify-end mt-6">
        <button
          class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 mr-2"
          @click="onConfirm"
        >
          확인
        </button>
        <button
          class="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
          @click="onClose"
        >
          닫기
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  isVisible: Boolean,
  title: String,
  decodedData: Object,
  approvalStatus: String,
  errorMessage: String,
});

const emit = defineEmits(['confirm', 'close']);

const onConfirm = () => {
  emit('confirm');
};

const onClose = () => {
  emit('close');
};
</script> -->
