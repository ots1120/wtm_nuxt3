<template>
  <div class="min-h-screen bg-white px-6">
    <div class="max-w-lg mx-auto shadow-sm">
      <!-- Main Content -->
      <section class="">
        <UserInfo
          v-if="user"
          :name="user.name"
          :email="user.email"
          :profile-picture="user.profilePicture"
        />

        <ul class="divide-y divide-gray-200">
          <li>
            <a
              class="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors duration-200 group cursor-pointer"
              @click.prevent="navigateTo('/my/settings')"
            >
              <span class="text-gray-900 group-hover:text-gray-600"
                >내 정보 수정</span
              >
              <span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                stroke-width="1.5" 
                stroke-linecap="round" 
                stroke-linejoin="round" 
                class="lucide lucide-chevron-right">
                <path d="m9 18 6-6-6-6"/>
              </svg>
              </span>
            </a>
          </li>
          <li>
            <a
              class="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors duration-200 group cursor-pointer"
              @click.prevent="navigateTo('/my/tickets')"
            >
              <span class="text-gray-900 group-hover:text-gray-600"
                >내 식권 관리</span
              >
              <span>
                <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                stroke-width="1.5" 
                stroke-linecap="round" 
                stroke-linejoin="round" 
                class="lucide lucide-chevron-right">
                <path d="m9 18 6-6-6-6"/>
              </svg>
              </span>
            </a>
          </li>
          <li>
            <a
              class="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors duration-200 group cursor-pointer"
              @click.prevent="navigateTo('/my/tickets/history')"
            >
              <span class="text-gray-900 group-hover:text-gray-600"
                >식권 구매 · 사용내역</span
              >
              <span>
                <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                stroke-width="1.5" 
                stroke-linecap="round" 
                stroke-linejoin="round" 
                class="lucide lucide-chevron-right">
                <path d="m9 18 6-6-6-6"/>
              </svg>
              </span>
            </a>
          </li>
          <li>
            <a
              class="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors duration-200 group cursor-pointer"
              @click.prevent="navigateTo('/my/bookmarks')"
            >
              <span class="text-gray-900 group-hover:text-gray-600"
                >내 북마크 관리</span
              >
              <span>
                <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                stroke-width="1.5" 
                stroke-linecap="round" 
                stroke-linejoin="round" 
                class="lucide lucide-chevron-right">
                <path d="m9 18 6-6-6-6"/>
              </svg>
              </span>
            </a>
          </li>
          <li>
            <a
              class="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors duration-200 group cursor-pointer"
              @click.prevent="navigateTo('/my/reviews')"
            >
              <span class="text-gray-900 group-hover:text-gray-600"
                >내 리뷰 관리</span
              >
              <span>
                <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                stroke-width="1.5" 
                stroke-linecap="round" 
                stroke-linejoin="round" 
                class="lucide lucide-chevron-right">
                <path d="m9 18 6-6-6-6"/>
              </svg>
              </span>
            </a>
          </li>
          <li v-if="isAuthenticated">
            <a
              class="flex justify-end text-[#db3d39] font-light rounded-lg text-sm px-6 py-4"
            >
              로그아웃
            </a>
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeMount } from 'vue';
import { useRouter, useFetch } from 'nuxt/app';
import UserInfo from '@/components/user/my/UserInfo.vue';

interface User {
  name: string;
  email: string;
  profilePicture: string | null;
}

const router = useRouter();
const route = useRoute();

const authstore = useAuthStore();
const username = authstore.user?.username;

const user = ref<User | null>(null);
const isAuthenticated = computed(() => authstore.isAuthenticated);

const navigateTo = (path: string) => {
  router.push(path);
};

onBeforeMount(async () => {
  route.meta.title = '내 정보';
  // useFetch에서 User 타입을 지정
  const { data, error } = await useFetch<User>(
    `http://localhost:8080/api/v1/user/my?username=${username}`,
  );

  if (data.value) {
    user.value = {
      email: data.value.email,
      name: data.value.name,
      profilePicture: data.value.profilePicture
      ? `http://localhost:8080${data.value.profilePicture}`
      : null, // null일 경우 null 유지
    };
  } else if (error.value) {
    console.error('유저 정보를 불러오는 데 실패했습니다1', error.value);
  }
});
</script>

<style scoped></style>
