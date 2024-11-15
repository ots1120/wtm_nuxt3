<template>
  <div class="flex items-start space-x-4 border-b pb-1">
  <a class="flex items-start space-x-8 cursor-pointer"
    @click.prevent="navigateTo(`/my/tickets/stores/${props.ticket.storeId}`)"
  >
    <div class="mb-4">
      <figure class="mb-1 mt-2">
        <img
              v-if="props.ticket.storeImgUrl"
              :src="props.ticket.storeImgUrl"
              class="w-20 h-20 object-cover rounded-full"
        />
        <div
          v-else
          class="w-20 h-20 block bg-gray-50 rounded-full flex items-center justify-center text-gray-400"
        >
          가게 사진 없음
        </div>
      </figure>
    </div>
    <div class="flex-1">
      <h2 class="text-base font-bold">
        {{ props.ticket.storeName }} <span class="text-yellow-500">⭐ {{ props.ticket.reviewAverage }}</span
        ><span
          :class="
          props.ticket.ticketAmount >= 3
              ? 'bg-green-100 text-green-600'
              : 'bg-red-100 text-red-600'
          "
          class="ml-2 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-600"
          >{{ props.ticket.ticketAmount }} 개</span
        >
      </h2>
      <p class="text-sm text-gray-500">
        운영시간 : {{ props.ticket.storeOpentime }} ~ {{ props.ticket.storeClosetime }}
      </p>
      <p class="text-sm text-gray-500">가격 : {{ props.ticket.ticketPrice }}원</p>
    </div>
  </a>
    <BookmarkButton
      :isBookmarked="props.ticket.isBookmarked"
      @toggle-bookmark="toggleBookmark"
    />
  </div>
</template>

<script setup lang="ts">
import BookmarkButton from '@/components/user/ui/BookmarkButton.vue';

interface Ticket{
  ticketId: Number,
  storeId: number,
  storeName: String,
  reviewAverage: Number,
  storeOpentime: String,
  storeClosetime: String,
  ticketPrice: Number,
  isBookmarked: Boolean,
  ticketAmount: number,
  storeImgUrl: string,
}

const props = defineProps<{ticket: Ticket}>();

// 이벤트 정의
const emit = defineEmits<{
  (event: 'toggle-bookmark', storeId: number): void;
}>();

// 이벤트 호출 메서드
const toggleBookmark = () => {
  emit('toggle-bookmark', props.ticket.storeId); // 부모 컴포넌트로 storeId 전달
};

const router = useRouter();
const navigateTo = (path: string) => {
  router.push(path);
};
</script>
