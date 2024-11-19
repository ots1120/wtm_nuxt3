<template>
  <!-- 공지사항 리스트 -->
  <div>
    <div
      v-for="(notice, noticeIndex) in notices"
      :key="notice.noticeId"
      class="flex flex-col mb-10 w-full border-b last:border-b-0"
    >
      <div class="mb-2 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div
            class="w-16 h-16 rounded-full border overflow-hidden flex items-center justify-center"
          >
            <img
              v-if="isDataLoaded"
              :src="notice.userProfilePicture"
              alt="Profile Image"
              class="w-full h-full object-cover"
              width="120"
              height="120"
            />
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              class="w-2/3 h-2/3"
              viewBox="0 0 16 16"
            >
              <!-- Placeholder SVG content -->
              <circle cx="8" cy="8" r="8" fill="#ccc" />
            </svg>
          </div>
          <span class="text-xl font-medium">{{ notice.userName }}</span>
          <!-- store 이름을 notice 객체에서 직접 가져오기 -->
        </div>
        <div>
          <span class="text-xs text-gray-400">{{ notice.dayDifference }}</span>
        </div>
      </div>
      <div class="flex-col">
        <!-- 내용이 길면 더보기/접기 버튼을 표시 -->
        <span class="font-semibold">{{ notice.title }}</span>
        <p
          class="text-xs"
          :class="{
            'h-auto': isExpanded[noticeIndex],
            'h-18 overflow-hidden': !isExpanded[noticeIndex],
          }"
        >
          {{ notice.content }}
        </p>
        <button
          v-if="notice.content.length > 100"
          class="text-xs text-blue-500"
          @click="toggleExpanded(noticeIndex)"
        >
          {{ isExpanded[noticeIndex] ? '접기' : '더보기' }}
        </button>
      </div>
      <div class="flex justify-end gap-4 mt-2">
        <button
          class="text-xs text-blue-500"
          @click="goToEditForm(notice.noticeId)"
        >
          수정
        </button>
        <button
          class="text-xs text-red-500"
          @click="openDeleteModal(notice.noticeId)"
        >
          삭제
        </button>
      </div>
    </div>

    <!-- No More Data Indicator -->
    <div
      v-if="!hasMore && !isLoading"
      class="flex justify-center items-center mt-4"
    >
      <span class="text-gray-500">더 이상 공지사항이 없습니다.</span>
    </div>

    <!-- Write Button -->
    <div class="mt-4">
      <WriteButton :push-route="`/admin/stores/${storeId}/notices/regist`" />
    </div>
    <!-- Sentinel for IntersectionObserver -->
    <div ref="sentinel" class="h-1"></div>
    <!-- Loading Indicator -->
    <div v-if="isLoading" class="flex justify-center items-center mt-4">
      <span class="text-gray-500">로딩 중...</span>
    </div>
    <Modal
      v-if="isModalVisible"
      :visible="isModalVisible"
      message-title="공지사항 삭제"
      message-body="정말로 이 공지사항을 삭제하시겠습니까?"
      cancel-message="취소"
      confirm-message="삭제"
      @confirm="confirmDelete"
      @cancel="cancelDelete"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRuntimeConfig } from '#app';
import { useRouter, useRoute } from 'vue-router';
import { differenceInDays } from 'date-fns';
import WriteButton from '~/components/admin/ui/WriteButton.vue';
import Modal from '~/components/modal/BasicModal.vue';

const config = useRuntimeConfig();
const baseUrl = config.public.baseApiUrl;

onBeforeMount(() => {
  route.meta.title = '공지관리';
});

definePageMeta({
  layout: 'admin',
});

// 타입 정의
interface Notice {
  noticeId: number;
  userName: string;
  userProfilePicture: string;
  content: string;
  title: string;
  noticeRegDate: string;
  dayDifference: string;
}

interface NoticePageResponse {
  notices: Notice[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

// 상태 정의
const notices = ref<Notice[]>([]);
const isExpanded = ref<boolean[]>([]); // 각 notice의 확장 상태
const isDataLoaded = ref(false);
const isLoading = ref(false);
const hasMore = ref(true);

// 라우터 인스턴스 생성
const router = useRouter();
const route = useRoute();

// storeId 가져오기
const storeId = route.params.storeId as string;

// Pagination 상태
const page = ref(0);
const size = ref(5);
const totalPages = ref(1);

// Sentinel 참조
const sentinel = ref<HTMLElement | null>(null);

const isModalVisible = ref(false);
const noticeToDelete = ref<number | null>(null);

// 등록일자 계산
const formatDateDifference = (regDate: string) => {
  const date = new Date(regDate);
  if (isNaN(date.getTime())) {
    console.error('유효하지 않은 날짜 형식:', regDate);
    return '유효하지 않은 날짜';
  }
  const daysDifference = differenceInDays(new Date(), date);
  return `${daysDifference}일 전`;
};

// 데이터 가져오기 함수
const fetchNotices = async () => {
  if (isLoading.value || !hasMore.value) return;

  isLoading.value = true;
  try {
    const response: NoticePageResponse = await $fetch(
      `/api/v1/admin/stores/${storeId}/notices`,
      {
        baseURL: baseUrl,
        method: 'GET',
        params: {
          page: page.value,
          size: size.value,
        },
      },
    );

    console.log('Fetched data:', response); // 확인용 로그

    if (response.notices && response.notices.length > 0) {
      const newNotices = response.notices.map((fetchData) => ({
        ...fetchData,
        dayDifference: formatDateDifference(fetchData.noticeRegDate),
        userProfilePicture: `${baseUrl}${fetchData.userProfilePicture}`,
      }));
      notices.value.push(...newNotices);
      isExpanded.value.push(...new Array(newNotices.length).fill(false));
      totalPages.value = response.totalPages;
      hasMore.value = page.value + 1 < totalPages.value;
      page.value += 1;
    } else {
      hasMore.value = false;
    }
    isDataLoaded.value = true;
  } catch (error) {
    console.error('데이터 가져오기 실패:', error);
  } finally {
    isLoading.value = false;
  }
};

// IntersectionObserver 설정
const setupIntersectionObserver = () => {
  if (!sentinel.value) return;

  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && hasMore.value && !isLoading.value) {
        fetchNotices();
      }
    },
    {
      root: null, // 부모 요소의 뷰포트를 root로 설정
      rootMargin: '0px',
      threshold: 1.0,
    },
  );

  observer.observe(sentinel.value);
};

// 초기 데이터 로드
onMounted(async () => {
  await fetchNotices();
  setupIntersectionObserver();
});

// 더보기/접기 토글 함수
const toggleExpanded = (index: number) => {
  isExpanded.value[index] = !isExpanded.value[index];
};

// 수정 페이지로 이동
const goToEditForm = (noticeId: number) => {
  router.push(`/admin/stores/${storeId}/notices/${noticeId}/edit`);
};

// 삭제 기능
// 모달 확인 (삭제)
const confirmDelete = async () => {
  if (!noticeToDelete.value) return;

  try {
    await $fetch(
      `/api/v1/admin/stores/${storeId}/notices/${noticeToDelete.value}`,
      {
        baseURL: baseUrl,
        method: 'DELETE',
      },
    );

    notices.value = notices.value.filter(
      (notice) => notice.noticeId !== noticeToDelete.value,
    );
  } catch (error) {
    console.error('삭제 실패:', error);
  } finally {
    isModalVisible.value = false;
    noticeToDelete.value = null;
  }
};

// 모달 열기
const openDeleteModal = (noticeId: number) => {
  noticeToDelete.value = noticeId;
  isModalVisible.value = true;
};

// 모달 취소
const cancelDelete = () => {
  isModalVisible.value = false;
  noticeToDelete.value = null;
};
</script>

<style scoped>
/* 기존 스타일을 유지하면서 추가적인 스타일이 필요한 경우 여기에 작성 */
</style>
