<template>
  <div class="border-b border-gray-200">
    <li
      class="max-w-md list-none p-4 bg-white rounded-lg shadow-sm transition duration-300 ease-in-out hover:shadow-md"
    >
      <!-- 이미지와 가게 이름, 작성일 -->
      <div class="flex items-center justify-between mb-3">
        <!-- 이미지와 가게 이름 -->
        <div class="flex items-center">
          <img
            :src="storeImage"
            alt="Store Image"
            class="w-12 h-12 rounded-full mr-3 object-cover shadow-sm"
          />
          <span class="font-semibold text-gray-900">{{ storeName }}</span>
        </div>

        <!-- 작성일 (일전) -->
        <span class="text-sm text-gray-500">{{ daysAgo }}</span>
      </div>

      <!-- 공지사항 -->
      <div class="text-left">
        <h3 class="mb-2 text-lg font-bold text-gray-900">{{ noticeName }}</h3>
        <p class="text-gray-700 leading-relaxed">{{ noticeContent }}</p>
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
    default: '/placeholder.svg?height=48&width=48',
  },
});
</script>

<style scoped>
/* Tailwind CSS를 사용하여 스타일 적용 */
</style>
