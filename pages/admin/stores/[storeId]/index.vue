<template>
  <div class="flex flex-col items-center pt-10">
    <div
      class="w-32 h-32 rounded-full border overflow-hidden flex items-center justify-center"
    >
      <img
        v-if="userProfilePicture"
        :src="userProfilePicture"
        alt="Profile Picture"
        class="w-full h-full object-cover"
      />
      <svg
        v-else
        xmlns="http://www.w3.org/2000/svg"
        class="w-2/3 h-2/3"
        viewBox="0 0 16 16"
      >
        <path
          fill="#BDBDBD"
          d="M8 16A8 8 0 1 1 8 0a8 8 0 0 1 0 16m.847-8.145a2.502 2.502 0 1 0-1.694 0C5.471 8.261 4 9.775 4 11c0 .395.145.995 1 .995h6c.855 0 1-.6 1-.995c0-1.224-1.47-2.74-3.153-3.145"
        />
      </svg>
    </div>

    <div class="mt-3 mb-4 text-center">
      <p class="font-bold text-xl">{{ storeName || '' }} 사장님</p>
      <p>안녕하세요!</p>
    </div>
    <div class="grid grid-cols-2 gap-10 p-2">
      <button
        class="flex h-32 w-32 flex-col items-center justify-center rounded-lg border-2 shadow-xl duration-500 ease-in-out hover:bg-slate-200"
        @click="goToMenuManagement"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="lucide lucide-utensils w-12"
        >
          <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
          <path d="M7 2v20" />
          <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
        </svg>
        <span>메뉴 관리</span>
      </button>
      <button
        class="flex h-32 w-32 flex-col items-center justify-center rounded-lg border-2 shadow-xl duration-500 ease-in-out hover:bg-slate-200"
        @click="goToTicketManagement"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="lucide lucide-tickets w-12"
        >
          <path d="m4.5 8 10.58-5.06a1 1 0 0 1 1.342.488L18.5 8" />
          <path d="M6 10V8" />
          <path d="M6 14v1" />
          <path d="M6 19v2" />
          <rect x="2" y="8" width="20" height="13" rx="2" />
        </svg>
        <span>식권 관리</span>
      </button>
      <button
        class="flex h-32 w-32 flex-col items-center justify-center rounded-lg border-2 shadow-xl duration-500 ease-in-out hover:bg-slate-200"
        @click="goToReviewManagement"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="lucide lucide-pencil-line w-12"
        >
          <path d="M12 20h9" />
          <path
            d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z"
          />
          <path d="m15 5 3 3" />
        </svg>
        <span>리뷰 관리</span>
      </button>
      <button
        class="flex h-32 w-32 flex-col items-center justify-center rounded-lg border-2 shadow-xl duration-500 ease-in-out hover:bg-slate-200"
        @click="goToNoticeManagement"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="lucide lucide-megaphone w-12"
        >
          <path d="m3 11 18-5v12L3 14v-3z" />
          <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
        </svg>
        <span>공지 관리</span>
      </button>
      <button
        class="flex h-32 w-32 flex-col items-center justify-center rounded-lg border-2 shadow-xl duration-500 ease-in-out hover:bg-slate-200"
        @click="goToStoreManagement"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="lucide lucide-store w-12"
        >
          <path
            d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"
          />
          <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
          <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" />
          <path d="M2 7h20" />
          <path
            d="M22 7v3a2 2 0 0 1-2 2a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12a2 2 0 0 1-2-2V7"
          />
        </svg>
        <span>식당 정보 관리</span>
      </button>
      <button
        class="flex h-32 w-32 flex-col items-center justify-center rounded-lg border-2 shadow-xl duration-500 ease-in-out hover:bg-slate-200"
        @click="goToUserManagement"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="lucide lucide-user-round w-12"
        >
          <circle cx="12" cy="8" r="5" />
          <path d="M20 21a8 8 0 0 0-16 0" />
        </svg>
        <span>내 정보 관리</span>
      </button>
    </div>
    <div
      class="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md z-20"
    >
      <AdminBottomNav />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router';
import { ref, watchEffect } from 'vue';
import { useFetch, useRuntimeConfig } from '#app';
import AdminBottomNav from '~/components/admin/AdminBottomNav.vue';

const config = useRuntimeConfig();
const baseUrl = config.public.baseApiUrl;

definePageMeta({
  layout: false,
});

// 라우터 및 라우트 초기화
const router = useRouter();
const route = useRoute();

// storeId 가져오기
const storeId = route.params.storeId;
const storeName = ref('');
const userProfilePicture = ref('');

// 타입 정의
interface StoreData {
  storeName: string;
  userProfilePicture: string;
}

// useFetch로 API 호출
const { data, error } = useFetch<StoreData>(`/api/v1/admin/stores/${storeId}`, {
  baseURL: baseUrl,
});

watchEffect(() => {
  if (error.value) {
    console.error('API 요청 실패:', error.value);
  }
  if (data.value) {
    storeName.value = data.value.storeName;
    userProfilePicture.value = `${baseUrl}${data.value.userProfilePicture}`;
    console.log(data.value);
  }
});

// 페이지 이동 함수
const goToMenuManagement = () => {
  router.push(`/admin/stores/${storeId}/menus`);
};
const goToTicketManagement = () => {
  router.push(`/admin/stores/${storeId}/tickets`);
};
const goToReviewManagement = () => {
  router.push(`/admin/stores/${storeId}/reviews`);
};
const goToNoticeManagement = () => {
  router.push(`/admin/stores/${storeId}/notices`);
};
const goToStoreManagement = () => {
  router.push(`/admin/stores/${storeId}/storeInfo`);
};
const goToUserManagement = () => {
  router.push(`/admin/stores/${storeId}/myInfo`);
};
</script>

<style scoped></style>
