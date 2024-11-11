<template>
  <div class="flex items-center space-x-3 py-4 border-b">
    <div class="bg-gray-200 w-16 h-16 rounded-lg flex-shrink-0"></div>
    <div class="flex-1 min-w-0">
      <div class="flex items-center space-x-1">
        <h2 class="text-base font-medium truncate">
          {{ props.bookmark.storeName }}
        </h2>
        <div class="flex items-center space-x-1 flex-shrink-0">
          <span class="text-yellow-400">⭐</span>
          <span class="text-sm">{{ props.bookmark.reviewAverage }}</span>
        </div>
      </div>
      <p class="text-sm text-gray-500 mt-1">
        운영시간: {{ props.bookmark.storeOpenTime }} ~ {{ props.bookmark.storeCloseTime }}
      </p>
      <p class="text-sm text-gray-500 mt-0.5">
        가격: {{ props.bookmark.ticketPrice.toLocaleString() }}원
      </p>
    </div>
    <BookmarkButton
      :isBookmarked="props.bookmark.isBookmarked"
      @toggle-bookmark="toggleBookmark"
    />
  </div>
</template>

<script setup lang="ts">
import BookmarkButton from '~/components/user/ui/BookmarkButton.vue';

interface Bookmark {
  storeId: number;
  storeName: string;
  storeOpenTime: string;
  storeCloseTime: string;
  reviewAverage: number;
  ticketPrice: number;
  isBookmarked: Boolean;
}

const props = defineProps<{ bookmark: Bookmark }>();

// 이벤트 정의
const emit = defineEmits<{
  (event: 'toggle-bookmark', storeId: number): void;
}>();

// 이벤트 호출 메서드
const toggleBookmark = () => {
  emit('toggle-bookmark', props.bookmark.storeId); // 부모 컴포넌트로 storeId 전달
};
</script>
