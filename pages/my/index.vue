<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-lg mx-auto bg-white shadow-sm">
      <!-- Main Content -->
      <section class="pb-20">
        <h1 class="sr-only">내 정보</h1>
        <UserInfo v-if="user" :name="user.name" :email="user.email" />

        <ul class="divide-y divide-gray-200">
          <li>
            <a
              class="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors duration-200 group cursor-pointer"
              @click.prevent="navigateTo('/my/settings')"
            >
              <span class="text-gray-900 group-hover:text-gray-600">내 정보 수정</span>
              <span>&gt;</span>
            </a>
          </li>
          <li>
            <a
              class="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors duration-200 group cursor-pointer"
              @click.prevent="navigateTo('/my/history')"
            >
              <span class="text-gray-900 group-hover:text-gray-600">식권 구매 · 사용내역</span>
              <span>&gt;</span>
            </a>
          </li>
          <li>
            <a
              class="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors duration-200 group cursor-pointer"
              @click.prevent="navigateTo('/my/bookmarks')"
            >
              <span class="text-gray-900 group-hover:text-gray-600">내 북마크 관리</span>
              <span>&gt;</span>
            </a>
          </li>
          <li>
            <a
              class="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors duration-200 group cursor-pointer"
              @click.prevent="navigateTo('/my/reviews')"
            >
              <span class="text-gray-900 group-hover:text-gray-600">내 리뷰 관리</span>
              <span>&gt;</span>
            </a>
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect  } from 'vue';
import { useRouter, useFetch } from 'nuxt/app';
import UserInfo from '@/components/user/my/UserInfo.vue';

interface User {
  name: string;
  email: string;
}

const router = useRouter();
const userId = 1;

// useFetch에서 User 타입을 지정
const { data, error } = useFetch<User>(`http://localhost:8080/api/v1/user/my?userId=${userId}`, {
  // headers: {
  //   Authorization: `Bearer ${token}`
  // },
});

const user = ref<User | null>(null);

watchEffect(()=>{
  if(data.value){
    user.value = data.value;
  }
})


const navigateTo = (path: string) => {
  router.push(path);
};
</script>

<style scoped></style>
