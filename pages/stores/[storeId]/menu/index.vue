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
            class="bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg w-full transition hover:bg-gray-400"
            @click.prevent="goToMenuRegPage"
          >
            메뉴 등록하기
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useFetch } from '#app'; // 필요에 따라 경로를 조정하세요.

// 메뉴 항목의 인터페이스 정의
interface MenuItem {
  name: string;
}

// API 응답 형식 인터페이스 정의
interface MenuResponse {
  menus: MenuItem[];
}

// 라우트에서 storeId를 가져옵니다.
const route = useRoute();
const storeId = route.params.storeId as string;

if (!storeId) {
  throw new Error('storeId를 가져올 수 없습니다.');
}

// 메뉴 등록 페이지로 이동하는 함수
const router = useRouter();
function goToMenuRegPage() {
  router.push(`/stores/${storeId}/menu/new`);
}

// useFetch를 setup 함수의 최상위 레벨에서 사용합니다.
const { data: menuData, error: menuError } = useFetch<MenuResponse>(
  `http://localhost:8080/api/v1/stores/${storeId}/menus/today`,
);

// menuItems를 computed로 정의하여 반응형으로 만듭니다.
const menuItems = computed(() => {
  if (menuError.value) {
    console.error('Menu data fetching error:', menuError.value.message);
    return [];
  }

  const menus = menuData.value?.menus || [];
  if (!menus.length) {
    console.warn('Menu data is empty:', menuData.value);
  }

  return menus.length ? menus.map((item) => item.name || '메뉴 이름 없음') : [];
});

// 레이아웃 설정
definePageMeta({
  layout: 'storedetail',
});
</script>

<style scoped>
/* 필요한 경우 추가적인 스타일을 정의할 수 있습니다 */
</style>
