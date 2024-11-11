<template>
  <div class="flex items-center space-x-3 py-4 border-b">
    <div class="mb-4">
          <figure class="mb-4 mt-2">
            <img
              v-if="props.bookmark.storeImgUrl"
              :src="props.bookmark.storeImgUrl"
              alt="프로필 사진"
              class="w-20 h-20 object-cover rounded-full"
            /> 
            <!-- 프로필 사진이 없는 경우 SVG 아이콘을 보여줌 -->
            <svg
              v-else
              width="20px"
              height="20px"
              viewBox="0 0 64 64"
              xmlns="http://www.w3.org/2000/svg"
              stroke-width="3"
              stroke="#000000"
              fill="none"
              class="block stroke-white rounded-full"
            >
              <g id="SVGRepo_bgCarrier" stroke-width="0" />
              <g
                id="SVGRepo_tracerCarrier"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <g id="SVGRepo_iconCarrier">
                <circle cx="32" cy="18.14" r="11.14" />
                <path
                  d="M54.55,56.85A22.55,22.55,0,0,0,32,34.3h0A22.55,22.55,0,0,0,9.45,56.85Z"
                />
              </g>
            </svg>
          </figure>
        </div>
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
  storeImgUrl: string;
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
