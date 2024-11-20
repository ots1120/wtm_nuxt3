<template>
  <div
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
  >
    <div class="bg-white rounded-lg p-6 w-80">
      <h2 class="text-lg font-semibold mb-4">로그인이 필요합니다</h2>
      <p class="mb-6">
        북마크를 저장하려면 로그인이 필요합니다. 로그인하시겠습니까?
      </p>
      <div class="flex justify-end space-x-4">
        <button
          class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          @click="$emit('cancel')"
        >
          취소
        </button>
        <button
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          @click="$emit('confirm')"
        >
          로그인
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 별도의 스크립트가 필요하지 않습니다. 단순히 이벤트를 방출합니다.
</script>

<style scoped>
/* 추가적인 스타일이 필요하면 여기에 작성하세요 */
</style>
