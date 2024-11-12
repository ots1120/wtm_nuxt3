<template>
  <div class="border-b border-gray-300">
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
      <div class="mb-4 flex justify-start text-sm text-gray-500">
        <span class="block">{{ daysAgo }}</span>
      </div>

      <!-- 공지사항 -->
      <div class="mb-4 text-left">
        <h3 class="mb-1 text-lg font-bold">{{ noticeName }}</h3>
        <p class="text-gray-700">{{ noticeContent }}</p>
      </div>
    </li>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  storeName: {
    type: String,
    default: '가게 이름 없음',
  },
  daysAgo: {
    type: String,
    default: '등록일 없음',
  },
  noticeName: {
    type: String,
    default: '공지사항 제목 없음',
  },
  noticeContent: {
    type: String,
    default: '공지사항 내용 없음',
  },
  storeImage: {
    type: String,
    default: '/placeholder.svg?height=40&width=40',
  },
});
</script>

<style scoped>
/* Tailwind CSS를 사용하여 스타일 적용 */
</style>
