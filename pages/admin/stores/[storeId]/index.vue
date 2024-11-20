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
          class="w-12"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M6 22v-9.15q-1.35-.35-2.175-1.425T3 9V2h2v6h1V2h2v6h1V2h2v7q0 1.35-.825 2.425T8 12.85V22zm10 0v-9.525q-1.35-.45-2.175-1.887T13 7.325Q13 5.1 14.175 3.55T17 2t2.825 1.562T21 7.35q0 1.825-.825 3.25T18 12.475V22z"
          />
        </svg>
        <span>메뉴 관리</span>
      </button>
      <button
        class="flex h-32 w-32 flex-col items-center justify-center rounded-lg border-2 shadow-xl duration-500 ease-in-out hover:bg-slate-200"
        @click="goToTicketManagement"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-12"
          viewBox="0 0 56 56"
        >
          <path
            fill="currentColor"
            fill-rule="evenodd"
            d="M3 20.279V16a4 4 0 0 1 4-4h42a4 4 0 0 1 4 4v4.45a3.2 3.2 0 0 1-1.95 2.945a5.001 5.001 0 0 0 .046 9.23A3.08 3.08 0 0 1 53 35.469V40a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-4.263c0-1.37.803-2.613 2.053-3.176a5.001 5.001 0 0 0-.01-9.126A3.46 3.46 0 0 1 3 20.28M39 23a3 3 0 1 0 0-6a3 3 0 0 0 0 6m0 8a3 3 0 1 0 0-6a3 3 0 0 0 0 6m0 8a3 3 0 1 0 0-6a3 3 0 0 0 0 6"
          />
        </svg>
        <span>식권 관리</span>
      </button>
      <button
        class="flex h-32 w-32 flex-col items-center justify-center rounded-lg border-2 shadow-xl duration-500 ease-in-out hover:bg-slate-200"
        @click="goToReviewManagement"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-12"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M6 14h3.05l5-5q.225-.225.338-.513t.112-.562t-.125-.537t-.325-.488l-.9-.95q-.225-.225-.5-.337t-.575-.113q-.275 0-.562.113T11 5.95l-5 5zm7-6.075L12.075 7zM7.5 12.5v-.95l2.525-2.525l.5.45l.45.5L8.45 12.5zm3.025-3.025l.45.5l-.95-.95zm.65 4.525H18v-2h-4.825zM2 22V4q0-.825.588-1.412T4 2h16q.825 0 1.413.588T22 4v12q0 .825-.587 1.413T20 18H6zm3.15-6H20V4H4v13.125zM4 16V4z"
          />
        </svg>
        <span>리뷰 관리</span>
      </button>
      <button
        class="flex h-32 w-32 flex-col items-center justify-center rounded-lg border-2 shadow-xl duration-500 ease-in-out hover:bg-slate-200"
        @click="goToNoticeManagement"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-12"
          viewBox="0 0 20 20"
        >
          <g fill="currentColor" fill-rule="evenodd" clip-rule="evenodd">
            <path
              d="m7.4 10.054l5.6 1.527V5.62L7.4 7.146zm-2 .764a1 1 0 0 0 .737.965l7.6 2.073A1 1 0 0 0 15 12.89V4.309a1 1 0 0 0-1.263-.965l-7.6 2.073a1 1 0 0 0-.737.965z"
            />
            <path
              d="M5.016 9.8V7.4H3.969a2.43 2.43 0 0 0 .004 2.4zm1 2a1 1 0 0 0 1-1V6.4a1 1 0 0 0-1-1H3.253a.55.55 0 0 0-.4.172c-1.602 1.691-1.595 4.353-.002 6.052a.56.56 0 0 0 .405.176z"
            />
            <path
              d="M6.424 12H5.84l-.766 3h.583zm-.584-2a2 2 0 0 0-1.938 1.506l-1.084 4.247A1 1 0 0 0 3.788 17h1.87a2 2 0 0 0 1.937-1.505l.767-3A2 2 0 0 0 6.424 10zm13.192-5.555a1 1 0 0 1-.277 1.387l-1.5 1a1 1 0 0 1-1.11-1.664l1.5-1a1 1 0 0 1 1.387.277M15.7 8.6a1 1 0 0 1 1-1h1.5a1 1 0 0 1 0 2h-1.5a1 1 0 0 1-1-1m.234 1.909a1 1 0 0 1 1.409-.123l1.38 1.16a1 1 0 0 1-1.286 1.531l-1.38-1.16a1 1 0 0 1-.123-1.408"
            />
          </g>
        </svg>
        <span>공지 관리</span>
      </button>
      <button
        class="flex h-32 w-32 flex-col items-center justify-center rounded-lg border-2 shadow-xl duration-500 ease-in-out hover:bg-slate-200"
        @click="goToStoreManagement"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-12"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M20 6H4V4h16zm-1 6c-1.91 0-3.63.76-4.89 2H14v.11c-1.24 1.26-2 2.98-2 4.89c0 .34.03.67.08 1H4v-6H3v-2l1-5h16l1 5v.3c-.63-.19-1.3-.3-2-.3m-7 2H6v4h6zm11.8 6.4c.1 0 .1.1 0 .2l-1 1.7c-.1.1-.2.1-.3.1l-1.2-.4c-.3.2-.5.3-.8.5l-.2 1.3c0 .1-.1.2-.2.2h-2c-.1 0-.2-.1-.3-.2l-.2-1.3c-.3-.1-.6-.3-.8-.5l-1.2.5c-.1 0-.2 0-.3-.1l-1-1.7c-.1-.1 0-.2.1-.3l1.1-.8v-1l-1.1-.8c-.1-.1-.1-.2-.1-.3l1-1.7c.1-.1.2-.1.3-.1l1.2.5c.3-.2.5-.3.8-.5l.2-1.3c0-.1.1-.2.3-.2h2c.1 0 .2.1.2.2l.2 1.3c.3.1.6.3.9.5l1.2-.5c.1 0 .3 0 .3.1l1 1.7c.1.1 0 .2-.1.3l-1.1.8v1zM20.5 19c0-.8-.7-1.5-1.5-1.5s-1.5.7-1.5 1.5s.7 1.5 1.5 1.5s1.5-.7 1.5-1.5"
          />
        </svg>
        <span>식당 정보 관리</span>
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
  router.push(`/admin/stores/${storeId}/myInfo`);
};
</script>

<style scoped></style>
