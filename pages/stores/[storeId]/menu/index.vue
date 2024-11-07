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

    <!-- 메뉴 탭 섹션 -->
    <div
      v-if="menuItems && menuItems.length > 0"
      class="w-full max-w-md mx-auto p-4"
    >
      <h2 class="text-2xl font-bold text-center mb-6 text-gray-800">
        오늘의 메뉴
      </h2>
      <div
        v-if="menuItems && menuItems.length > 0"
        class="bg-white shadow-lg rounded-2xl p-6"
      >
        <ul class="space-y-4">
          <li
            v-for="(menuItem, index) in menuItems"
            :key="index"
            class="flex items-center bg-slate-100 rounded-lg p-3 transition duration-300 hover:bg-slate-200"
          >
            <span class="w-5 h-5 text-slate-500 mr-3">🍴</span>
            <span class="text-lg text-gray-700">{{ menuItem }}</span>
          </li>
        </ul>
      </div>
    </div>
    <div v-else class="flex flex-col items-center justify-center">
      <h3 class="text-lg font-bold mb-4">오늘의 메뉴</h3>
      <div
        class="w-1/2 max-w-lg flex flex-col items-center bg-gray-100 rounded-lg p-4"
      >
        <p class="text-gray-500 mb-4">아직 메뉴 정보가 없어요 😢</p>
        <form action="#" method="post" class="w-full">
          <button
            class="bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg w-full transition"
            @click.prevent="goToMenuRegPage"
          >
            메뉴 제보하기
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useFetch } from '#app';
import { useRoute, useRouter } from 'vue-router';
import StoreDetailInfo from '~/components/user/stores/detail/StoreDetailInfo.vue';
import StoreDetailActionButtons from '~/components/user/stores/detail/StoreDetailActionButtons.vue';
import StoreDetailTabs from '~/components/user/stores/detail/StoreDetailTabs.vue';

// 라우트에서 storeId 가져오기
const route = useRoute();
const router = useRouter();
const storeId = route.params.storeId;

// 반응형 데이터 정의
const reviewStats = ref({
  name: '인쌩맥주',
  overallAverageScore: 0,
  reviewCount: 0,
});
const selectedStore = ref({ name: '', description: '', image: '' });
const menuItems = ref([]);
const actionButtons = ref(['경로', '저장', '공유']); // 필요에 맞게 설정

// 데이터 가져오기 함수
async function fetchData() {
  const { data: reviewSummaryData, error: reviewSummaryError } = await useFetch(
    `http://localhost:8080/api/v1/stores/${storeId}/review-Summary`,
  );

  const { data: storeData, error: storeError } = await useFetch(
    `http://localhost:8080/api/v1/stores/${storeId}`,
  );

  const { data: menuData, error: menuError } = await useFetch(
    `http://localhost:8080/api/v1/stores/${storeId}/menus/today`,
  );

  // 데이터 콘솔 출력
  console.log('Review Summary Data:', reviewSummaryData.value);
  console.log('Store Data:', storeData.value);
  console.log('Menu Data:', menuData.value);

  // 수정된 부분: reviewStatData -> reviewSummaryData
  if (reviewSummaryData.value) {
    reviewStats.value = {
      name: reviewSummaryData.value.name,
      overallAverageScore: reviewSummaryData.value.overallAverageScore,
      reviewCount: reviewSummaryData.value.reviewCount,
    };
  }

  if (storeData.value) {
    selectedStore.value = storeData.value.store;
  }

  if (menuData.value) {
    menuItems.value = menuData.value.menus.map((item) => item.name);
  }

  console.log('menuItems:', menuItems.value);

  if (storeError.value || menuError.value || reviewSummaryError.value) {
    console.error('데이터 가져오기 오류:', storeError.value || menuError.value);
  }
}

// 컴포넌트가 마운트될 때 데이터 가져오기
onMounted(fetchData);

// 메뉴 등록 페이지로 이동하는 함수
function goToMenuRegPage() {
  router.push(`/stores/${storeId}/menu/new`);
}
</script>

<style scoped>
/* 스타일 추가 */
h2 {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  padding: 5px 0;
}
button {
  cursor: pointer;
}
</style>
