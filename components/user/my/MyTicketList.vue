<template>
  <div class="flex items-start space-x-4 py-4 px-4 border-b border-gray-200">
  <a class="flex space-x-4 flex-1 cursor-pointer"
    @click.prevent="navigateTo(`/my/tickets/stores/${ticket.storeId}`)"
  >
    <div class="w-16 h-16 bg-gray-200 rounded-md overflow-hidden flex-shrink-0 flex items-center justify-center">
        <img
          v-if="ticket.storeImgUrl"
          :src="ticket.storeImgUrl"
          :alt="ticket.storeName"
          class="w-full h-full object-cover"
        />
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="lucide lucide-utensils w-12 h-12 text-gray-400"
        >
          <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
          <path d="M7 2v20" />
          <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
        </svg>
    </div>
    <div class="flex-1 min-w-0 flex flex-col justify-between h-16">
      <div class="flex items-center space-x-1">
        <h2 class="text-base font-bold text-gray-900 truncate">
          {{ ticket.storeName }} 
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
          <span class="text-sm text-gray-900">{{ ticket.reviewAverage }}</span>
        </div>
      </div>
      <p class="text-sm text-gray-500">
        운영시간 : 
        <span v-if="ticket.storeOpentime && ticket.storeClosetime">
            {{ ticket.storeOpentime }} ~ {{ ticket.storeClosetime }}
          </span>
          <span v-else>운영시간 정보 없음</span>
      </p>
      <p class="text-sm text-gray-500">
      가격 : 
      <span v-if="ticket.ticketPrice">
            {{ ticket.ticketPrice.toLocaleString() }}원
          </span>
          <span v-else>가격 정보 없음</span>
      </p>
    </div>
  </a>
  <div
    :class="
    props.ticket.ticketAmount >= 3
        ? 'bg-green-100 text-green-600'
        : 'bg-red-100 text-red-600'
    "
    class="ml-2 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-600">
    {{ ticket.ticketAmount }} 개
  </div>
  <div class="flex-shrink-0 pt-1">
    <BookmarkButton
      :isBookmarked="ticket.isBookmarked"
      @toggle-bookmark="toggleBookmark"
    />
  </div>
  </div>
</template>

<script setup lang="ts">
import BookmarkButton from '@/components/user/ui/BookmarkButton.vue';

interface Ticket{
  ticketId: Number,
  storeId: number,
  storeName: string,
  reviewAverage: Number,
  storeOpentime: String,
  storeClosetime: String,
  ticketPrice: Number,
  isBookmarked: boolean,
  ticketAmount: number,
  storeImgUrl: string | null,
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
