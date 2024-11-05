<template>
  <li>
    <div class="mt-5 mr-11 ml-11 block border-b-2 border-b-slate-300">
      <a href="#">
        <div class="mb-4">
          <figure class="mb-4 mt-2">
            <img
              :src="`/assets/${review.imgUrl}`"
              :alt="review.storeId"
              class="w-full h-auto object-cover rounded-md"
            />
          </figure>
        </div>
        <div class="ml-2">
          <div class="justify-between flex w-full">
            <span class="font-bold text-2xl">{{ review.storeId }}</span>
            <span class="font-light text-gray-300">{{
              calcTimeTmp(review.timetmp)
            }}</span>
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
                  v-if="index < Math.floor(review.rating)"
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
                  v-else-if="index === Math.floor(review.rating)"
                  class="absolute inset-0 text-yellow-400 fill-current overflow-hidden"
                  :style="{
                    width:
                      (review.rating - Math.floor(review.rating)) * 100 + '%',
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
            <p>{{ review.context }}</p>
          </div>
        </div>
      </a>
      <div class="block text-right mt-1 mb-6">
        <button @click="$emit('delete-review', index)" class="text-sky-400">
          삭제
        </button>
      </div>
    </div>
  </li>
</template>

<script>
export default {
  props: {
    review: Object,
    index: Number,
  },
  methods: {
    calcTimeTmp(tmp) {
      const regDate = new Date(tmp);
      const nowTime = new Date();
      const afterTime = nowTime - regDate;
      const minutes = Math.floor(afterTime / 60000);
      if (minutes < 60) return `${minutes}분 전`;
      else if (minutes < 1440) return `${Math.floor(minutes / 60)}시간 전`;
      else return `${Math.floor(minutes / 1440)}일 전`;
    },
  },
};
</script>

<style scoped></style>
