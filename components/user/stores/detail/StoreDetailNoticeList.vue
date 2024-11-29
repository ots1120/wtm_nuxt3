<template>
  <div class="border-b border-gray-200">
    <li
      class="max-w-md list-none p-4 bg-white rounded-lg shadow-sm transition duration-300 ease-in-out hover:shadow-md"
    >
      <!-- 이미지와 가게 이름, 작성일 -->
      <div class="flex items-center justify-between mb-3">
        <!-- 이미지와 가게 이름 -->
        <div class="flex items-center">
          <!-- 사진이 있을 경우 -->
          <img
            v-if="storeImage"
            :src="storeImage"
            alt="Store Image"
            class="w-10 h-10 rounded-full mr-3 object-cover shadow-sm"
          />
          <!-- 기본 SVG 이미지를 표시 -->
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            class="h-10"
            viewBox="0 0 16 16"
          >
            <path
              fill="#BDBDBD"
              d="M8 16A8 8 0 1 1 8 0a8 8 0 0 1 0 16m.847-8.145a2.502 2.502 0 1 0-1.694 0C5.471 8.261 4 9.775 4 11c0 .395.145.995 1 .995h6c.855 0 1-.6 1-.995c0-1.224-1.47-2.74-3.153-3.145"
            />
          </svg>
          <span class="ml-2 font-semibold text-gray-900">{{ storeName }}</span>
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
