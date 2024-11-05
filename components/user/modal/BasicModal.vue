<template>
  <div
    v-if="visible"
    class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 p-0"
  >
    <div class="w-full max-w-sm rounded-lg bg-white p-0 shadow-lg">
      <div class="-mb-6 p-6">
        <h2 class="mb-4 text-center text-2xl font-semibold">
          {{ messageTitle }}
        </h2>
        <p class="mb-6 break-words text-gray-600">
          {{ messageBody }}
        </p>
      </div>
      <div class="flex w-full">
        <button
          @click="cancel"
          class="w-full rounded-bl-lg bg-gray-200 px-4 py-3 text-gray-800"
        >
          {{ cancelMessage }}
        </button>
        <button
          @click="confirm"
          class="w-full rounded-br-lg bg-red-500 px-4 py-3 text-white"
        >
          {{ confirmMessage }}
        </button>
        <BaseButton>확인</BaseButton>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    messageTitle: {
      type: String,
      default: '북마크를 삭제하시겠습니까?',
    },
    messageBody: {
      type: String,
      default: '북마크를 삭제하시려면 확인을 눌러주세요.',
    },
    cancelMessage: {
      type: String,
      default: '취소',
    },
    confirmMessage: {
      type: String,
      default: '확인',
    },
  },
  methods: {
    confirm() {
      this.$emit('confirm');
    },
    cancel() {
      this.$emit('cancel');
    },
  },
};
</script>
<style></style>
