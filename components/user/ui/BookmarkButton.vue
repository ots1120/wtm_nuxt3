<template>
  <button @click="toggleBookmark" aria-label="북마크">
    <svg
      class="w-6 h-6"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      :class="isBookmarked ? 'text-red-500' : 'text-gray-500'"
    >
      <path
        v-if="isBookmarked"
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
      />
      <path
        v-else
        d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3z"
      />
    </svg>
  </button>
</template>

<script>
export default {
  props: {
    isBookmarked: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    toggleBookmark() {
      this.$emit('toggle-bookmark'); // 북마크 상태 변경 이벤트를 부모로 전달
    },
  },
};
</script>

<style scoped>
/* 필요한 경우 스타일 추가 */
</style>
