<template>
  <div>
    <!-- 공지사항 리스트 -->
    <div v-if="noticeDatas && noticeDatas.length > 0">
      <StoreDetailNoticeList
        v-for="(noticeData, index) in noticeDatas"
        :key="index"
        class="p-4"
        :store-name="noticeData.storeName"
        :notice-name="noticeData.title"
        :notice-content="noticeData.content"
        :store-image="noticeData.profilePicture"
        :days-ago="noticeData.timeAgo ? noticeData.timeAgo : '등록일 없음'"
      />
    </div>

    <!-- 감시 대상 요소 -->
    <div ref="infiniteScrollTrigger"></div>

    <!-- 로딩 중 표시 -->
    <div v-if="loading" class="text-center p-4">Loading more notices...</div>
    <!-- 더 이상 공지사항이 없을 때 표시 -->
    <div v-else-if="!hasNext" class="text-center p-4">
      모든 공지사항을 불러왔습니다.
    </div>
  </div>
</template>

<script setup>
import { ref, inject, onMounted, onUnmounted } from 'vue';
import StoreDetailNoticeList from '~/components/user/stores/detail/StoreDetailNoticeList.vue';

const config = useRuntimeConfig();
const baseUrl = config.public.baseApiUrl;

// 레이아웃에서 제공된 데이터를 inject로 받아옵니다.
const storeId = inject('storeId');

// 공지사항 데이터를 위한 상태 정의
const noticeDatas = ref([]);
const page = ref(0); // 페이지 번호
const size = 10; // 한 번에 가져올 항목 수
const hasNext = ref(true); // 다음 페이지가 있는지 여부
const loading = ref(false); // 로딩 상태 관리

// Intersection Observer를 위한 ref
const infiniteScrollTrigger = ref(null);

// 공지사항 데이터 가져오기 함수
const fetchNotices = async () => {
  if (loading.value || !hasNext.value) {
    return;
  } // 로딩 중이거나 다음 페이지가 없을 때 중단

  loading.value = true;

  try {
    const data = await $fetch(`${baseUrl}/api/v1/stores/${storeId}/notices`, {
      params: { page: page.value, size },
      credentials: 'include',
    });

    if (data && data.content) {
      // 서버에서 응답한 데이터가 있으면 notices 배열에 추가
      noticeDatas.value.push(
        ...data.content.map((notice) => ({
          ...notice,
          profilePicture: notice.profilePicture
            ? `${baseUrl}${notice.profilePicture}`
            : null,
        })),
      );

      hasNext.value = data.content.length === size; // 응답 크기로 hasNext 결정
      page.value++; // 다음 페이지로 증가
    } else {
      hasNext.value = false;
    }
  } catch (err) {
    console.error('Failed to fetch notices:', err);
    hasNext.value = false;
  } finally {
    loading.value = false;
  }
};

// Intersection Observer 설정
let observer = null;

onMounted(() => {
  fetchNotices(); // 페이지가 로드될 때 초기 데이터를 가져오기 위해 호출

  observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        fetchNotices();
      }
    },
    {
      root: null,
      threshold: 0.1,
    },
  );

  if (infiniteScrollTrigger.value) {
    observer.observe(infiniteScrollTrigger.value);
  }
});

onUnmounted(() => {
  if (observer && infiniteScrollTrigger.value) {
    observer.unobserve(infiniteScrollTrigger.value);
    observer.disconnect();
  }
});

// 레이아웃 설정
definePageMeta({
  layout: 'storedetail',
});
</script>

<style scoped>
/* 페이지 개별 스타일 */
</style>
