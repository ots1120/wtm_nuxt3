<template>
  <div class="flex items-start space-x-4 border-b pb-4">
    <div class="bg-gray-200 w-16 h-16 rounded-lg"></div>
    <div class="flex-1">
      <h2 class="text-base font-bold">
        {{ storeName }} <span class="text-yellow-500">⭐ {{ rating }}</span
        ><span
          :class="
            remainingTickets >= 3
              ? 'bg-green-100 text-green-600'
              : 'bg-red-100 text-red-600'
          "
          class="ml-2 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-600"
          >{{ remainingTickets }}</span
        >
      </h2>
      <p class="text-sm text-gray-500">
        운영시간 : {{ openTime }} ~ {{ closeTime }}
      </p>
      <p class="text-sm text-gray-500">가격 : {{ price }}원</p>
    </div>
    <BookmarkButton
      :isBookmarked="isBookmarked"
      @toggle-bookmark="toggleBookmark"
    />
  </div>
</template>

<script>
import BookmarkButton from '@/components/user/ui/BookmarkButton.vue';

export default {
  props: {
    storeName: String,
    rating: Number,
    remainingTickets: Number,
    openTime: String,
    closeTime: String,
    price: Number,
    isBookmarked: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    BookmarkButton,
  },
  methods: {
    toggleBookmark() {
      this.$emit('toggle-bookmark'); // 부모 컴포넌트로 이벤트 전송
    },
  },
};
</script>
