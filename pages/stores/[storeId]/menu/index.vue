<template>
  <div>
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
            class="flex items-center justify-between bg-slate-100 rounded-lg p-3 transition duration-300 hover:bg-slate-200"
          >
            <!-- 메뉴 이름 -->
            <span class="text-lg text-gray-700 font-semibold">
              {{ menuItem.name }}
            </span>

            <!-- 카테고리 라벨 -->
            <span
              class="ml-4 px-2 py-1 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
            >
              {{ menuItem.categoryName }}
            </span>
          </li>
        </ul>
      </div>
    </div>

    <div v-else class="flex flex-col items-center justify-center">
      <h3 class="text-lg font-bold mb-4">오늘의 메뉴</h3>
      <div
        class="w-2/3 max-w-lg flex flex-col items-center bg-gray-100 rounded-lg p-4"
      >
        <p class="text-gray-500 mb-4">아직 메뉴 정보가 없어요 😢</p>
        <form action="#" method="post" class="w-full">
          <button
            class="bg-gradient-to-r from-rose-400 to-rose-600 text-white font-semibold py-2 px-4 rounded-lg w-full transition hover:bg-[#c22420]"
            @click.prevent="RegAction"
          >
            메뉴 등록하기
          </button>
        </form>
      </div>
    </div>

    <!-- 로그인 요청 모달 -->
    <LoginPromptModal
      v-if="loginModalVisible"
      @cancel="closeLoginModal"
      @confirm="redirectToLogin"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useFetch } from '#app'; // 필요에 따라 경로를 조정하세요.
import LoginPromptModal from '~/components/user/modal/LoginPromptModal.vue';
import { useAuthStore } from '~/stores/auth'; // Pinia 스토어 임포트

const config = useRuntimeConfig();
const baseUrl = config.public.baseApiUrl;

const authStore = useAuthStore();
const isAuthenticated = computed(() => authStore.isAuthenticated);

// 메뉴 항목의 인터페이스 정의
interface MenuItem {
  name: string;
  categoryName: string; // 카테고리 이름 추가
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

// 로그인 요청 모달 상태
const loginModalVisible = ref(false);

// 로그인 요청 모달 열기 함수
const openLoginModal = () => {
  loginModalVisible.value = true;
};

// 로그인 요청 모달 닫기 함수
const closeLoginModal = () => {
  loginModalVisible.value = false;
};

// 로그인 페이지로 리디렉션 함수
const redirectToLogin = () => {
  router.push(`/signIn`); // 라우터 설정에 따라 경로 또는 이름 변경
};

// 저장 버튼 클릭 시 동작
const RegAction = () => {
  if (isAuthenticated.value) {
    // 인증된 사용자라면 북마크 토글 처리
    goToMenuRegPage();
  } else {
    // 인증되지 않은 사용자라면 로그인 요청 모달 열기
    openLoginModal();
  }
};

// useFetch를 setup 함수의 최상위 레벨에서 사용합니다.
const { data: menuData, error: menuError } = useFetch<MenuResponse>(
  `${baseUrl}/api/v1/stores/${storeId}/menus/today`,
  {
    credentials: 'include',
  },
);

// menuItems를 computed로 정의하여 반응형으로 만듭니다.
const menuItems = computed(() => {
  if (menuError.value) {
    // console.error('Menu data fetching error:', menuError.value.message);
    return [];
  }

  const menus = menuData.value?.menus || [];
  if (!menus.length) {
    console.warn('Menu data is empty:', menuData.value);
  }

  return menus.map((item) => ({
    name: item.name || '메뉴 이름 없음',
    categoryName: item.categoryName || '카테고리 없음',
  }));
});

// 레이아웃 설정
definePageMeta({
  layout: 'storedetail',
});
</script>

<style scoped>
/* 필요한 경우 추가적인 스타일을 정의할 수 있습니다 */
</style>
