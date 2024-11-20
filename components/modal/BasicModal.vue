<template>
  <Transition name="modal">
    <div
      v-if="visible"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm"
    >
      <div class="w-full max-w-sm rounded-2xl bg-white shadow-lg">
        <div class="p-6">
          <!-- Title -->
          <h2 class="mb-4 text-center text-xl font-semibold text-gray-800">
            {{ messageTitle }}
          </h2>
          <!-- Message -->
          <p class="mb-6 text-center text-base text-gray-600 break-words">
            {{ messageBody }}
          </p>
        </div>
        <!-- Button area -->
        <div class="flex border-t border-gray-200">
          <button
            class="w-full py-3 text-base font-medium text-blue-500 transition duration-200 ease-in-out hover:bg-gray-50 active:bg-gray-100"
            @click="handleCancel"
          >
            {{ cancelMessage }}
          </button>
          <div class="w-px bg-gray-200"></div>
          <button
            class="w-full py-3 text-base font-medium text-red-500 transition duration-200 ease-in-out hover:bg-gray-50 active:bg-gray-100"
            @click="handleConfirm"
          >
            {{ confirmMessage }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
// Props definition
const props = defineProps<{
  visible: boolean;
  messageTitle: string;
  messageBody: string;
  cancelMessage: string;
  confirmMessage: string;
}>();

// Emit definition
const emit = defineEmits<{
  (event: 'confirm'): void;
  (event: 'cancel'): void;
}>();

// Confirm button handler
const handleConfirm = () => {
  emit('confirm');
};

// Cancel button handler
const handleCancel = () => {
  emit('cancel');
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
