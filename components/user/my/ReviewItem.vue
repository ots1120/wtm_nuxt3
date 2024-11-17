<template>
  <li>
    <div class="mt-5 mr-11 ml-11 mb-3 block border-b-2 border-b-slate-300">
      <a href="#">
        <div class="mb-4">
          <figure class="mb-4 mt-2">
            <img
              v-if="props.review.reviewImgUrl"
              :src="props.review.reviewImgUrl"
              alt="프로필 사진"
              class="w-20 h-20 object-cover rounded-full"
            />
            <!-- 프로필 사진이 없는 경우 SVG 아이콘을 보여줌 -->
            <svg
              v-else
              width="20px"
              height="20px"
              viewBox="0 0 64 64"
              xmlns="http://www.w3.org/2000/svg"
              stroke-width="3"
              stroke="#000000"
              fill="none"
              class="block stroke-white rounded-full"
            >
              <g id="SVGRepo_bgCarrier" stroke-width="0" />
              <g
                id="SVGRepo_tracerCarrier"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <g id="SVGRepo_iconCarrier">
                <circle cx="32" cy="18.14" r="11.14" />
                <path
                  d="M54.55,56.85A22.55,22.55,0,0,0,32,34.3h0A22.55,22.55,0,0,0,9.45,56.85Z"
                />
              </g>
            </svg>
          </figure>
        </div>
        <div class="ml-2">
          <div class="justify-between flex w-full">
            <span class="font-bold text-2xl">{{ props.review.storeName }}</span>
            <span class="font-light text-gray-300">
              {{ props.review.createdTime }}</span
            >
          </div>
          <div class="flex items-center mt-4">
            <div class="flex">
              <span
                v-for="(star, index) in 5"
                :key="index"
                class="relative mr-1"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 text-gray-300"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                  />
                </svg>
                <div
                  v-if="index < Math.floor(props.review.averageScore)"
                  class="absolute inset-0 text-yellow-400 fill-current"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M12 .587l3.668 7.431 8.332 1.209-6.042 5.873 1.427 8.318L12 18.896l-7.385 3.862L6.042 15.1.587 9.227l8.332-1.209z"
                    />
                  </svg>
                </div>
                <div
                  v-else-if="index === Math.floor(props.review.averageScore)"
                  class="absolute inset-0 text-yellow-400 fill-current overflow-hidden"
                  :style="{
                    width:
                      (props.review.averageScore -
                        Math.floor(props.review.averageScore)) *
                        100 +
                      '%',
                  }"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M12 .587l3.668 7.431 8.332 1.209-6.042 5.873 1.427 8.318L12 18.896l-7.385 3.862L6.042 15.1.587 9.227l8.332-1.209z"
                    />
                  </svg>
                </div>
              </span>
            </div>
          </div>
          <div class="mt-3">
            <p>{{ props.review.content }}</p>
          </div>
        </div>
      </a>
      <div class="block text-right mt-1 mb-6">
        <button class="text-sky-400" @click="toggleModal">삭제</button>
      </div>
    </div>
  </li>
</template>

<script setup lang="ts">
interface Review {
  storeName: string;
  createdTime: string;
  averageScore: number;
  content: string;
  reviewId: number;
  reviewImgUrl: string;
}
const props = defineProps<{ review: Review }>();

// 이벤트 정의
const emit = defineEmits<{
  (event: 'toggle-modal', reviewId: number): void;
}>();

// 이벤트 호출 메서드
const toggleModal = () => {
  emit('toggle-modal', props.review.reviewId); // 부모 컴포넌트로 storeId 전달
};
</script>

<style scoped></style>
