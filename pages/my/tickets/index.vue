<template>
  <div>
    <div>
      <MyTicketList
        v-for="(ticket, index) in tickets"
        :key="index"
        class="p-4"
        :ticket="ticket"
        @toggle-bookmark="handleBookmarkToggle(ticket)"
      />
    </div>
    <!-- Bookmark Modal -->
    <BookmarkModal
      v-if="visible"
      :visible="visible"
      :store-id="selectedStoreId"
      @cancel="closeModal"
      @confirm="confirmDelete"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import MyTicketList from '~/components/user/my/MyTicketList.vue';
import BookmarkModal from '~/components/user/modal/BookmarkModal.vue';

interface Ticket {
  ticketId: number;
  storeId: number;
  storeName: string;
  reviewAverage: number;
  storeOpentime: string;
  storeClosetime: string;
  ticketPrice: number;
  isBookmarked: boolean;
  ticketAmount: number;
  storeImgUrl: string;
}

const tickets = ref<Ticket[]>([]);

// 모달 상태 관리
const visible = ref(false);
const selectedStoreId = ref<number | null>(null);

// 북마크 토글 처리
const handleBookmarkToggle = async (ticket: Ticket) => {
  if (ticket.isBookmarked) {
    // 이미 북마크된 경우 모달 열기
    openModal(ticket.storeId);
  } else {
    // 북마크되지 않은 경우 바로 추가
    await addBookmark(ticket.storeId);
  }
};
// 북마크 추가
const addBookmark = async (storeId: number) => {
  try {
    const userId = 1; // 실제로는 적절한 userId를 사용해야 합니다
    const { data, error } = await useFetch(
      `http://localhost:8080/api/v1/user/my/bookmarks?storeId=${storeId}&userId=${userId}`,
      {
        method: 'POST',
        body: JSON.stringify({ storeId, userId }),
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    if (error.value) {
      throw new Error('Failed to add the bookmark');
    }

    console.log('북마크가 추가되었습니다.');

    // 최신 북마크 데이터를 다시 가져오기
    await fetchUpdatedTickets();
  } catch (error) {
    console.error('북마크 추가에 실패했습니다:', error);
  }
};

// 모달 열기
const openModal = (storeId: number) => {
  selectedStoreId.value = storeId;
  visible.value = true;
};

// 모달 닫기
const closeModal = () => {
  visible.value = false;
  selectedStoreId.value = null;
};

const userId = 1;
// 북마크 삭제 확인
const confirmDelete = async (storeId: number) => {
  try {
    console.log(storeId);
    // 백엔드에 DELETE 요청을 보내 북마크를 삭제
    const userId = 1; // 실제로는 적절한 userId를 사용해야 합니다
    const { data, error } = await useFetch(
      `http://localhost:8080/api/v1/user/my/bookmarks?storeId=${storeId}&userId=${userId}`,
      {
        method: 'DELETE',
      },
    );

    if (error.value) {
      throw new Error('Failed to delete the bookmark');
    }

    console.log('북마크가 삭제되었습니다.');

    // 최신 북마크 데이터를 다시 가져오기
    const { data: updatedData, error: fetchError } = await useFetch<Ticket[]>(
      `http://localhost:8080/api/v1/user/my/tickets?userId=${userId}`,
      {},
    );

    if (fetchError.value) {
      throw new Error('Failed to fetch updated tickets');
    }

    if (updatedData.value) {
      tickets.value = updatedData.value.map((ticket) => ({
        ...ticket,
        storeImgUrl: `http://localhost:8080${ticket.storeImgUrl}`,
      }));
    } else if (error.value) {
      console.error('식권 정보를 불러오는 데 실패했습니다', error.value);
    }
  } catch (error) {
    console.error('북마크 삭제 후 티켓 업데이트에 실패했습니다:', error);
  } finally {
    closeModal();
  }
};

// 티켓 데이터 업데이트 함수
const fetchUpdatedTickets = async () => {
  const { data: updatedData, error: fetchError } = await useFetch<Ticket[]>(
    `http://localhost:8080/api/v1/user/my/tickets?userId=${userId}`,
    {},
  );

  if (fetchError.value) {
    throw new Error('Failed to fetch updated tickets');
  }

  if (updatedData.value) {
    tickets.value = updatedData.value.map((ticket) => ({
      ...ticket,
      storeImgUrl: `http://localhost:8080${ticket.storeImgUrl}`,
    }));
  } else if (error.value) {
    console.error('식권 정보를 불러오는 데 실패했습니다', error.value);
  }
};

const { data, error } = useFetch<Ticket[]>(
  `http://localhost:8080/api/v1/user/my/tickets?userId=${userId}`,
  {},
);

if (data.value) {
  tickets.value = data.value.map((ticket) => ({
    ...ticket,
    storeImgUrl: `http://localhost:8080${ticket.storeImgUrl}`,
  }));
} else if (error.value) {
  console.error('식권 정보를 불러오는 데 실패했습니다', error.value);
}

const route = useRoute();
onBeforeMount(() => {
  route.meta.title = '내 식권';
});
</script>
