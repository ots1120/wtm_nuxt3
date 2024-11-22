<template>
  <div v-if="selectedStore">
    <!-- selectedStore가 로드된 후에만 StoreDetailHome 컴포넌트를 렌더링 -->
    <StoreDetailHome :store="selectedStore" class="p-4" />
  </div>
  <div v-else>
    <p>데이터를 불러오는 중입니다...</p>
  </div>
</template>

<script setup>
import { ref, inject, onMounted } from 'vue';
import StoreDetailHome from '~/components/user/stores/detail/StoreDetailHome.vue';

// 레이아웃에서 제공된 storeId를 inject로 받아옵니다.
const storeId = inject('storeId', '');

// 페이지에서 사용하는 selectedStore 데이터 정의
const selectedStore = ref(null);

// 페이지에 필요한 추가 데이터 가져오기
async function fetchAdditionalData() {
  if (!storeId) {
    console.error('storeId가 유효하지 않습니다.');
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:8080/api/v1/stores/${storeId}`,
      {
        credentials: 'include',
      },
    );

    if (!response.ok) {
      throw new Error(`서버 오류: ${response.status}`);
    }
    const data = await response.json();
    console.log('Fetched Data:', data); // 데이터 구조 확인용 로그

    // 모든 데이터를 selectedStore에 담기
    selectedStore.value = {
      ...data,
      storeSns: data.storeSnsList ? data.storeSnsList[0] : null,
      ticket: data.ticketList ? data.ticketList[0] : null,
    };
  } catch (error) {
    console.error('추가 데이터 가져오기 중 오류 발생:', error);
  }
}

// 컴포넌트가 마운트될 때 추가 데이터 가져오기
onMounted(() => {
  console.log('storeId:', storeId); // storeId가 올바르게 전달되었는지 확인
  fetchAdditionalData();
});

// 레이아웃 설정
definePageMeta({
  layout: 'storedetail',
});
</script>

<style scoped>
/* 페이지 개별 스타일 */
</style>
