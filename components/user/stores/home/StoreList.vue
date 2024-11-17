<template>
  <div class="flex items-start space-x-4 border-b pb-4">
    <div class="bg-gray-200 w-16 h-16 rounded-lg"></div>
    <div class="flex-1">
      <h2 class="text-base font-bold">
        {{ storeName }} <span class="text-yellow-500">⭐ {{ rating }}</span>
      </h2>
      <p class="text-sm text-gray-500">운영시간 : {{ operatingHours }}</p>
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
    operatingHours: String,
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
