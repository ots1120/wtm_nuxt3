<template>
  <div class="max-w-lg mx-auto bg-white min-h-screen">
  <div class="px-4">
    <div v-if="tickets.length > 0">
      <MyTicketList
        v-for="(ticket, index) in tickets"
        :key="index"
        class="p-4"
        :ticket="ticket"
        @toggle-bookmark="handleBookmarkToggle(ticket)"
      />
    </div>
    <p v-else class="text-center py-12 text-gray-500">
      소유한 식권이 없습니다.
    </p>
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
  storeImgUrl: string | null;
}

const tickets = ref<Ticket[]>([]);

// 모달 상태 관리
const visible = ref(false);
const selectedStoreId = ref<number | null>(null);

const authstore = useAuthStore();
const username = authstore.user?.username;

const config = useRuntimeConfig();
const baseUrl = config.public.baseApiUrl;

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
    const { data, error } = await useFetch(
      `/api/v1/user/my/bookmarks`,
      {
        baseURL: baseUrl,
        method: 'POST',
        body: JSON.stringify({ storeId, username })
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

// 북마크 삭제 확인
const confirmDelete = async (storeId: number) => {
  try {
    console.log(storeId);
    // 백엔드에 DELETE 요청을 보내 북마크를 삭제
    const { data, error } = await useFetch(
      `/api/v1/user/my/bookmarks/stores/${storeId}/users/${username}`,
      {
        baseURL: baseUrl,
        method: 'DELETE',
      },
    );

    if (error.value) {
      throw new Error('Failed to delete the bookmark');
    }

    console.log('북마크가 삭제되었습니다.');

    // 최신 북마크 데이터를 다시 가져오기
    const { data: updatedData, error: fetchError } = await useFetch<Ticket[]>(
      `/api/v1/user/my/tickets?username=${username}`,
      {
        baseURL: baseUrl
      },
    );

    if (fetchError.value) {
      throw new Error('Failed to fetch updated tickets');
    }

    if (updatedData.value) {
      tickets.value = updatedData.value.map((ticket) => ({
        ...ticket,
        storeImgUrl: `${baseUrl}${ticket.storeImgUrl}`,
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
    `/api/v1/user/my/tickets?username=${username}`,
    {
      baseURL: baseUrl,
    }
  );

  if (fetchError.value) {
    throw new Error('Failed to fetch updated tickets');
  }

  if (updatedData.value) {
    tickets.value = updatedData.value.map((ticket) => ({
      ...ticket,
      storeImgUrl: `${baseUrl}${ticket.storeImgUrl}`,
    }));
  } else if (fetchError.value) {
    console.error('식권 정보를 불러오는 데 실패했습니다', fetchError.value);
  }
};

const route = useRoute();
onBeforeMount( async () => {
  route.meta.title = '내 식권';
    const { data, error } = await useFetch<Ticket[]>(
    `/api/v1/user/my/tickets?username=${username}`,
    {
      baseURL: baseUrl
    }
  );

  if (data.value) {
    tickets.value = data.value.map((ticket) => ({
      ...ticket,
      storeImgUrl: ticket.storeImgUrl
      ? `${baseUrl}${ticket.storeImgUrl}`
      : null,
    }));
  } else if (error.value) {
    console.error('식권 정보를 불러오는 데 실패했습니다', error.value);
  }
});
</script>
