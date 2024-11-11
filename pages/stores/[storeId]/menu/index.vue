<!-- pages/storeDetailPage.vue -->
<template>
  <div>
    <!-- 메뉴 탭 섹션 -->
    <div
      v-if="menuItems && menuItems.length > 0"
      class="w-full max-w-md mx-auto p-4"
    >
      <h2 class="text-2xl font-bold text-center mb-6 text-gray-800">
        오늘의 메뉴
      </h2>
      <div class="bg-white shadow-lg rounded-2xl p-6">
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
import { ref, inject, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import StoreDetailTicket from '~/components/user/stores/detail/StoreDetailTicket.vue';

// 레이아웃에서 제공된 데이터를 inject로 받아옵니다.
const storeId = inject('storeId');

// 메뉴 데이터를 위한 상태 정의
const menuItems = ref([]);

// 메뉴 데이터 가져오기 함수
async function fetchMenuData() {
  const { data: menuData, error: menuError } = await useFetch(
    `http://localhost:8080/api/v1/stores/${storeId}/menus/today`
  );

  if (menuError.value) {
    console.error('Menu data fetching error:', menuError.value);
  } else if (menuData.value && menuData.value.menus) {
    menuItems.value = menuData.value.menus.map((item) => item.name);
  } else {
    console.warn('Menu data is empty or has unexpected format:', menuData.value);
    menuItems.value = []; // 빈 배열로 초기화하여 안전하게 처리
  }
}

// 메뉴 등록 페이지로 이동하는 함수
const router = useRouter();
function goToMenuRegPage() {
  router.push(`/stores/${storeId}/menu/new`);
}

// 컴포넌트가 마운트될 때 메뉴 데이터 가져오기
onMounted(fetchMenuData);

// 레이아웃 설정
definePageMeta({
  layout: 'storedetail'
});
</script>

<style scoped>
/* 페이지 개별 스타일 */
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
