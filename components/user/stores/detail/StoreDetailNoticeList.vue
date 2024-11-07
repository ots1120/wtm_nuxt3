<template>
  <div class="flex justify-center border-b border-gray-300">
    <li class="max-w-md list-none p-2">
      <!-- 이미지와 가게 이름 -->
      <div class="flex items-center mb-2">
        <img
          :src="storeImage"
          alt="Store Image"
          class="w-10 h-10 rounded-full mr-2"
        />
        <span class="font-medium">{{ storeName }}</span>
      </div>

      <!-- 작성일 (일전) -->
      <div class="mb-4 flex justify-between text-sm text-gray-500">
        <span class="block">{{ daysAgo }}일 전</span>
      </div>

      <!-- 공지사항 -->
      <div class="mb-4">
        <h3 class="mb-1 text-lg font-bold">{{ noticeName }}</h3>
        <p class="text-gray-700">{{ noticeContent }}</p>
      </div>
    </li>
  </div>
</template>

<script setup>
const {
  // storeId,
  storeName = '인생맥주',
  daysAgo = 1,
  noticeName = '임시휴무',
  noticeContent = '여름휴가로 15일~17일(목~토) 입시 휴업입니다. 감사합니다!',
  storeImage = '/placeholder.svg?height=40&width=40',
} = defineProps({
  storeId: String,
  storeName: String,
  daysAgo: Number,
  noticeName: String,
  noticeContent: String,
  storeImage: String,
});
</script>

<style scoped>
/* Tailwind CSS만 사용하므로 별도의 CSS 스타일은 없습니다 */
</style>
