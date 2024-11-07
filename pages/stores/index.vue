<template>
  <div>
    <div
      v-for="(store, index) in stores"
      :key="index"
      class="m-3 flex items-start space-x-4 border-b pb-4"
      @click="goToStoreDetail(store.storeId)"
    >
      <!-- 가게 이미지 섹션 -->
      <div class="bg-gray-200 w-16 h-16 rounded-lg overflow-hidden">
        <img
          :src="store.profilePicture"
          alt="Store Image"
          class="w-full h-full object-cover"
        />
      </div>
      <div class="flex-1">
        <h2 class="text-base font-bold">
          {{ store.name }}
          <span class="text-yellow-500">⭐ {{ store.rating }}</span>
        </h2>
        <p class="text-sm text-gray-500">
          운영시간 : {{ store.operatingHours }}
        </p>
        <p class="text-sm text-gray-500">가격 : {{ store.price }}원</p>
      </div>
      <button
        class="p-2 text-gray-500"
        @click.stop="toggleBookmark(store, index)"
      >
        <svg
          v-if="store.isBookmarked"
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6 text-blue-500"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M5 3a2 2 0 00-2 2v12l7-5 7 5V5a2 2 0 00-2-2H5z" />
        </svg>
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 3a2 2 0 00-2 2v12l7-5 7 5V5a2 2-2"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watchEffect } from 'vue';
import { useRouter } from 'vue-router';
import { useFetch } from '#app';

const stores = ref([]);
const router = useRouter();

// 데이터 가져오기 함수
const { data: storeData, error } = useFetch(
  'http://localhost:8080/api/v1/stores',
);

// watchEffect로 데이터 변경 시 절대 경로로 변환
watchEffect(() => {
  if (storeData.value) {
    stores.value = storeData.value.map((store) => ({
      ...store,
      profilePicture: `http://localhost:8080${store.profilePicture}`,
    }));
  }
});

if (error.value) {
  console.error('Failed to fetch stores:', error.value);
}

// 북마크 상태 토글 함수
const toggleBookmark = async (store, index) => {
  try {
    const url = `http://localhost:8080/api/v1/stores/${store.storeId}/bookmark`;
    const method = store.isBookmarked ? 'DELETE' : 'POST';

    // useFetch를 이용한 API 호출
    const { error: bookmarkError } = await useFetch(url, { method });

    if (bookmarkError.value) {
      throw new Error(bookmarkError.value);
    }

    // 상태 업데이트
    stores.value[index].isBookmarked = !store.isBookmarked;
    console.log(
      store.isBookmarked
        ? '북마크가 삭제되었습니다.'
        : '북마크가 추가되었습니다.',
    );
  } catch (error) {
    console.error('북마크 요청 중 오류가 발생했습니다:', error);
  }
};

// 가게 상세 페이지로 이동하는 함수
const goToStoreDetail = (storeId) => {
  router.push(`/stores/${storeId}/home`);
};
</script>

<style scoped>
/* 스타일 정의 (필요에 따라 추가) */
</style>
