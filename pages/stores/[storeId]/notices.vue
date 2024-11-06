<template>
  <div>
    <!-- 상단 이미지와 식당 정보 섹션 -->
    <StoreDetailInfo
      v-if="selectedStore"
      :store="selectedStore"
      :review-stats="reviewStats"
    />

    <!-- 경로, 저장, 공유 버튼 섹션 -->
    <StoreDetailActionButtons v-if="actionButtons" :actions="actionButtons" />

    <!-- 탭 네비게이션 -->
    <StoreDetailTabs />

    <!-- 공지사항 -->
    <div v-if="noticeDatas && noticeDatas.length > 0">
      <StoreDetailNoticeList
        v-for="(noticeData, index) in noticeDatas"
        :key="index"
        class="p-4"
        :store-name="noticeData.storeName"
        :notice-name="noticeData.title"
        :notice-content="noticeData.content"
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
import { ref, onMounted } from 'vue';
import { useRoute, useFetch } from '#app';
import StoreDetailInfo from '~/components/user/stores/detail/StoreDetailInfo.vue';
import StoreDetailActionButtons from '~/components/user/stores/detail/StoreDetailActionButtons.vue';
import StoreDetailTabs from '~/components/user/stores/detail/StoreDetailTabs.vue';
import StoreDetailNoticeList from '~/components/user/stores/detail/StoreDetailNoticeList.vue';

// 라우트에서 storeId 가져오기
const route = useRoute();
const storeId = route.params.storeId;

// 반응형 데이터 정의
const selectedStore = ref(null);
const noticeDatas = ref([]);
const actionButtons = ref(['경로', '저장', '공유']);

// 데이터 가져오기
onMounted(async () => {
  try {
    // 가게 정보 가져오기
    const { data: storeData, error: storeError } = await useFetch(
      `http://localhost:8080/api/v1/stores/${storeId}`,
    );
    if (storeError.value) {
      console.error('Store data fetching error:', storeError.value);
    } else {
      selectedStore.value = storeData.value;
    }

    // 공지사항 데이터 가져오기
    const { data: noticeData, error: noticeError } = await useFetch(
      `http://localhost:8080/api/v1/stores/${storeId}/notices`,
    );
    if (noticeError.value) {
      console.error('Notice data fetching error:', noticeError.value);
    } else {
      noticeDatas.value = noticeData.value;
    }
  } catch (err) {
    console.error('API 요청 중 오류 발생:', err);
  }
});

// 등록일로부터 경과한 날짜 계산
function calculateDaysAgo(regDate) {
  const now = new Date();
  const regDateTime = new Date(regDate);
  const timeDiff = now - regDateTime;
  return Math.floor(timeDiff / (1000 * 60 * 60 * 24)); // 일 단위 계산
}
</script>
