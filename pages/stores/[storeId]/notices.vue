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
        :days-ago="
          noticeData.regDate
            ? calculateDaysAgo(noticeData.regDate)
            : '등록일 없음'
        "
      />
    </div>
    <div v-else>
      <p>공지사항이 없습니다.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, inject, watchEffect } from 'vue';
import StoreDetailNoticeList from '~/components/user/stores/detail/StoreDetailNoticeList.vue';
import { useFetch } from '#app';

// 레이아웃에서 제공된 데이터를 inject로 받아옵니다.
const storeId = inject('storeId');

// 공지사항 데이터를 위한 상태 정의
const noticeDatas = ref([]);

// 공지사항 데이터 가져오기
const { data: noticeData, error: noticeError } = useFetch(
  () => `http://localhost:8080/api/v1/stores/${storeId}/notices`,
  { immediate: true }
);

// 데이터를 감시하여 storeImage URL을 설정
watchEffect(() => {
  if (noticeData.value) {
    noticeDatas.value = noticeData.value.map((notice) => ({
      ...notice,
      profilePicture: notice.profilePicture
        ? `http://localhost:8080${notice.profilePicture}`
        : null,
    }));
    console.log('공지사항 데이터:', noticeDatas.value);
  }
});

if (noticeError.value) {
  console.error('Notice data fetching error:', noticeError.value);
}

// 등록일로부터 경과한 날짜 계산
function calculateDaysAgo(regDate) {
  const now = new Date();
  const regDateTime = new Date(regDate);
  const timeDiff = now - regDateTime;
  return Math.floor(timeDiff / (1000 * 60 * 60 * 24)); // 일 단위 계산
}

// 레이아웃 설정
definePageMeta({
  layout: 'storedetail'
});
</script>

<style scoped>
/* 페이지 개별 스타일 */
</style>
