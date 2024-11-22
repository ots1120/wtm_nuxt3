<template>
  <div class="max-w-lg mx-auto bg-white min-h-screen">
    <!-- Bookmark List -->
    <div class="px-4">
      <div v-if="bookmarks.length > 0">
        <BookmarkList
          v-for="(bookmark, index) in bookmarks"
          :key="bookmark.storeId"
          :bookmark="bookmark"
          class="first:pt-4"
          @toggle-bookmark="openModal(bookmark.storeId)"
        />
      </div>
      <p v-else class="text-center py-12 text-gray-500">북마크된 가게가 없습니다.</p>
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
import BookmarkList from '~/components/user/my/BookmarkList.vue';
import BookmarkModal from '~/components/user/modal/BookmarkModal.vue';

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

const authstore = useAuthStore();
const username = authstore.user?.username;

// bookmarks를 ref로 정의
const bookmarks = ref<Bookmark[]>([]);

// 모달 상태 관리
const visible = ref(false);
const selectedStoreId = ref<number | null>(null);

const config = useRuntimeConfig();
const baseUrl = config.public.baseApiUrl;

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
    // 백엔드에 DELETE 요청을 보내 북마크를 삭제
    const { data, error } = await useFetch(
      `/api/v1/user/my/bookmarks/stores/${storeId}/users/${username}`,
      {
        baseURL: baseUrl,
        method: "DELETE"
      }
    );

    if (error.value) {
      throw new Error('Failed to delete the bookmark');
    }

    console.log('북마크가 삭제되었습니다.');

    // 최신 북마크 데이터를 다시 가져오기
    const { data: updatedData, error: fetchError } = await useFetch<Bookmark[]>(
      `/api/v1/user/my/bookmarks?username=${username}`,
      {
        baseURL: baseUrl,
      }
    );

    if (fetchError.value) {
      throw new Error('Failed to fetch updated bookmarks');
    }

    if (updatedData.value) {
      bookmarks.value = updatedData.value;
    }
  } catch (error) {
    console.error('북마크 삭제에 실패했습니다:', error);
  } finally {
    closeModal();
  }
};

const route = useRoute();
onBeforeMount(async () => {
  route.meta.title = "내 북마크";
  // 북마크 데이터를 불러오는 함수
  const { data, error } = await useFetch<Bookmark[]>(
    `/api/v1/user/my/bookmarks?username=${username}`,
    {
      baseURL: baseUrl,
    }
  );

  if (data.value) {
    bookmarks.value = data.value.map((bookmark) => ({
      ...bookmark,
      reviewAverage: bookmark.reviewAverage
      ? bookmark.reviewAverage
      :null,
      storeImgUrl: bookmark.storeImgUrl
      ? `${baseUrl}${bookmark.storeImgUrl}`
      : null,
    }));
  } else if (error.value) {
    console.error("북마크 정보를 불러오는 데 실패했습니다", error.value);
  }
});
</script>
