<template>
  <div class="flex items-start space-x-4 py-4 px-4 border-b border-gray-200">
    <div class="flex space-x-4 flex-1">
      <div class="bg-gray-200 w-16 h-16 rounded-full overflow-hidden border border-gray-300 flex items-center justify-center"
      >
        <img
          v-if="bookmark.storeImgUrl"
          :src="bookmark.storeImgUrl"
          :alt="bookmark.storeName"
          class="w-full h-full object-cover"
        />
        <!-- 기본 SVG 이미지를 표시 -->
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          class="h-16 w-16 text-gray-400"
          viewBox="0 0 16 16"
        >
          <path
            fill="#BDBDBD"
            d="M8 16A8 8 0 1 1 8 0a8 8 0 0 1 0 16m.847-8.145a2.502 2.502 0 1 0-1.694 0C5.471 8.261 4 9.775 4 11c0 .395.145.995 1 .995h6c.855 0 1-.6 1-.995c0-1.224-1.47-2.74-3.153-3.145"
          />
        </svg>
      </div>

      <div class="flex-1 min-w-0 flex flex-col justify-between h-16">
        <div class="flex items-center space-x-1">
          <h2 class="text-base font-bold text-gray-900 truncate">
            {{ bookmark.storeName }}
          </h2>
          <div class="flex items-center space-x-1 text-yellow-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="flex-shrink-0"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <span v-if="bookmark.reviewAverage" class="text-sm text-gray-900">
              {{ bookmark.reviewAverage }}
            </span>
            <span v-else class="text-sm text-gray-900">--.--</span>
          </div>
        </div>
        <p class="text-sm text-gray-500">
          운영시간:
          <span v-if="bookmark.storeOpenTime && bookmark.storeCloseTime">
            {{ bookmark.storeOpenTime }} ~ {{ bookmark.storeCloseTime }}
          </span>
          <span v-else>운영시간 정보 없음</span>
        </p>
        <!-- 가격 -->
        <p class="text-sm text-gray-500">
          가격:
          <span v-if="bookmark.ticketPrice">
            {{ bookmark.ticketPrice.toLocaleString() }}원
          </span>
          <span v-else>가격 정보 없음</span>
        </p>
      </div>
    </div>
    <div class="flex-shrink-0 pt-1">
      <BookmarkButton
        :isBookmarked="bookmark.isBookmarked"
        @toggle-bookmark="toggleBookmark"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import BookmarkButton from '~/components/user/ui/BookmarkButton.vue';

interface Bookmark {
  storeId: number;
  storeName: string;
  storeOpenTime: string | null;
  storeCloseTime: string | null;
  reviewAverage: number | null;
  ticketPrice: number | null;
  isBookmarked: boolean;
  storeImgUrl: string | null;
}

const props = defineProps<{
  bookmark: Bookmark;
}>();

const emit = defineEmits<{
  (event: 'toggle-bookmark', storeId: number): void;
}>();

const toggleBookmark = () => {
  emit('toggle-bookmark', props.bookmark.storeId);
};
</script>