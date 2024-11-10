<template>
  <div>
    <!-- Bottom Sheet for Store List -->
    <div
      v-if="isSheetOpen"
      class="fixed bottom-0 left-0 right-0 bg-white rounded-t-lg shadow-lg overflow-hidden transition-transform duration-300"
      :style="{ height: sheetHeight }"
      @touchstart="startTouch"
      @touchmove="onTouchMove"
      @touchend="endTouch"
    >
      <!-- Drag Area -->
      <div
        class="h-8 bg-red-200 flex justify-center items-center cursor-pointer"
        @click="toggleSheet"
      >
        <span class="w-10 h-1 bg-gray-400 rounded"></span>
      </div>

      <!-- Store List -->
      <div
        class="overflow-y-auto"
        :style="{ maxHeight: 'calc(100vh - 100px)' }"
      >
        <div
          v-for="(store, index) in stores"
          :key="index"
          class="m-3 flex items-start space-x-4 border-b pb-4"
          @click="goToStoreDetail(store.storeId)"
        >
          <!-- Store Image Section -->
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
    </div>
  </div>
</template>

<script setup>
import { ref, watchEffect } from 'vue';
import { useRouter } from 'vue-router';
import { useFetch } from '#app';

const stores = ref([]);
const isSheetOpen = ref(true);
const sheetHeight = ref('40%');
const router = useRouter();

let startY = 0;
let currentY = 0;

// Start touch position
const startTouch = (event) => {
  startY = event.touches[0].clientY;
  currentY = startY;
};

// Adjust Sheet height during touch movement
const onTouchMove = (event) => {
  currentY = event.touches[0].clientY;
  const diffY = startY - currentY;

  // Adjust height proportionally to distance moved
  if (diffY > 0) {
    sheetHeight.value = Math.min(90, 40 + diffY / 5) + '%';
  } else {
    sheetHeight.value = Math.max(20, 40 + diffY / 5) + '%';
  }
};

// Set final height based on touch end position
const endTouch = () => {
  const diffY = startY - currentY;
  if (diffY > 50) {
    sheetHeight.value = '90%';
  } else if (diffY < -50) {
    sheetHeight.value = '20%';
  } else {
    sheetHeight.value = '40%';
  }
};

// Toggle Bottom Sheet open/close
const toggleSheet = () => {
  isSheetOpen.value = !isSheetOpen.value;
};

// Fetch store data
const { data: storeData, error } = useFetch(
  'http://localhost:8080/api/v1/stores',
);

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

// Toggle bookmark state
const toggleBookmark = async (store, index) => {
  try {
    const url = `http://localhost:8080/api/v1/stores/${store.storeId}/bookmark`;
    const method = store.isBookmarked ? 'DELETE' : 'POST';
    const { error: bookmarkError } = await useFetch(url, { method });

    if (bookmarkError.value) {
      throw new Error(bookmarkError.value);
    }

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

// Navigate to store detail page
const goToStoreDetail = (storeId) => {
  router.push(`/stores/${storeId}/home`);
};
</script>

<style scoped>
/* No additional custom CSS needed, all styling is handled by Tailwind CSS */
</style>
