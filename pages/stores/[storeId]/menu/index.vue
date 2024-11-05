<template>
  <div>
    <!-- 상단 이미지와 식당 정보 섹션 -->
    <div>
      <!-- 상단 이미지와 식당 정보 섹션 -->
      <section class="">
        <h1 class="hidden">Store Detail</h1>

        <div class="h-30 border-b-2 p-2">
          <h2 class="text-xl font-medium">{{ reviewStats.name }}</h2>
          <div class="flex items-center">
            <svg
              class="inline w-5"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="SVGRepo_bgCarrier" stroke-width="0" />
              <g
                id="SVGRepo_tracerCarrier"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <g id="SVGRepo_iconCarrier">
                <path
                  d="M21.12 9.88005C21.0781 9.74719 20.9996 9.62884 20.8935 9.53862C20.7873 9.4484 20.6579 9.38997 20.52 9.37005L15.1 8.58005L12.67 3.67005C12.6008 3.55403 12.5027 3.45795 12.3853 3.39123C12.2678 3.32451 12.1351 3.28943 12 3.28943C11.8649 3.28943 11.7322 3.32451 11.6147 3.39123C11.4973 3.45795 11.3991 3.55403 11.33 3.67005L8.89999 8.58005L3.47999 9.37005C3.34211 9.38997 3.21266 9.4484 3.10652 9.53862C3.00038 9.62884 2.92186 9.74719 2.87999 9.88005C2.83529 10.0124 2.82846 10.1547 2.86027 10.2907C2.89207 10.4268 2.96124 10.5512 3.05999 10.6501L6.99999 14.4701L6.06999 19.8701C6.04642 20.0091 6.06199 20.1519 6.11497 20.2826C6.16796 20.4133 6.25625 20.5267 6.36999 20.6101C6.48391 20.6912 6.61825 20.7389 6.75785 20.7478C6.89746 20.7566 7.03675 20.7262 7.15999 20.6601L12 18.1101L16.85 20.6601C16.9573 20.7189 17.0776 20.7499 17.2 20.7501C17.3573 20.7482 17.5105 20.6995 17.64 20.6101C17.7537 20.5267 17.842 20.4133 17.895 20.2826C17.948 20.1519 17.9636 20.0091 17.94 19.8701L17 14.4701L20.93 10.6501C21.0305 10.5523 21.1015 10.4283 21.1351 10.2922C21.1687 10.1561 21.1634 10.0133 21.12 9.88005Z"
                  fill="#ffd500"
                />
              </g>
            </svg>
            <span class="text-sm">{{
              reviewStats.overallAverageScore.toFixed(1)
            }}</span>
            <span class="ml-2 text-sm text-blue-300"
              >리뷰 {{ reviewStats.reviewCount }}개</span
            >
          </div>
        </div>
      </section>
    </div>

    <!-- 경로, 저장, 공유 버튼 섹션 -->
    <div class="flex justify-evenly border-b-2 p-1 text-center text-xs">
      <div>
        <a href="#">
          <svg
            class="w-9"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="SVGRepo_bgCarrier" stroke-width="0" />

            <g
              id="SVGRepo_tracerCarrier"
              stroke-linecap="round"
              stroke-linejoin="round"
            />

            <g id="SVGRepo_iconCarrier">
              <path
                d="M6.14214 6.14214C8.90356 3.38071 10.2843 2 12 2C13.7157 2 15.0964 3.38071 17.8579 6.14214C20.6193 8.90356 22 10.2843 22 12C22 13.7157 20.6193 15.0964 17.8579 17.8579C15.0964 20.6193 13.7157 22 12 22C10.2843 22 8.90356 20.6193 6.14214 17.8579C3.38071 15.0964 2 13.7157 2 12C2 10.2843 3.38071 8.90356 6.14214 6.14214Z"
                stroke="#1C274C"
                stroke-width="1.5"
              />
              <path
                d="M16 11.5L13.3333 9M16 11.5L13.3333 14M16 11.5L10.6667 11.5C9.77778 11.5 8 12 8 14"
                stroke="#1C274C"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </g>
          </svg>
          경로
        </a>
      </div>

      <div>
        <a href="#">
          <svg
            class="w-9"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="SVGRepo_bgCarrier" stroke-width="0" />

            <g
              id="SVGRepo_tracerCarrier"
              stroke-linecap="round"
              stroke-linejoin="round"
            />

            <g id="SVGRepo_iconCarrier">
              <path
                d="M5 6.2C5 5.07989 5 4.51984 5.21799 4.09202C5.40973 3.71569 5.71569 3.40973 6.09202 3.21799C6.51984 3 7.07989 3 8.2 3H15.8C16.9201 3 17.4802 3 17.908 3.21799C18.2843 3.40973 18.5903 3.71569 18.782 4.09202C19 4.51984 19 5.07989 19 6.2V21L12 16L5 21V6.2Z"
                stroke="#000000"
                stroke-width="2"
                stroke-linejoin="round"
              />
            </g>
          </svg>
          저장
        </a>
      </div>

      <div>
        <a href="#">
          <svg
            class="w-9"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="SVGRepo_bgCarrier" stroke-width="0" />

            <g
              id="SVGRepo_tracerCarrier"
              stroke-linecap="round"
              stroke-linejoin="round"
            />

            <g id="SVGRepo_iconCarrier">
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M16.5 2.25C14.7051 2.25 13.25 3.70507 13.25 5.5C13.25 5.69591 13.2673 5.88776 13.3006 6.07412L8.56991 9.38558C8.54587 9.4024 8.52312 9.42038 8.50168 9.43939C7.94993 9.00747 7.25503 8.75 6.5 8.75C4.70507 8.75 3.25 10.2051 3.25 12C3.25 13.7949 4.70507 15.25 6.5 15.25C7.25503 15.25 7.94993 14.9925 8.50168 14.5606C8.52312 14.5796 8.54587 14.5976 8.56991 14.6144L13.3006 17.9259C13.2673 18.1122 13.25 18.3041 13.25 18.5C13.25 20.2949 14.7051 21.75 16.5 21.75C18.2949 21.75 19.75 20.2949 19.75 18.5C19.75 16.7051 18.2949 15.25 16.5 15.25C15.4472 15.25 14.5113 15.7506 13.9174 16.5267L9.43806 13.3911C9.63809 12.9694 9.75 12.4978 9.75 12C9.75 11.5022 9.63809 11.0306 9.43806 10.6089L13.9174 7.4733C14.5113 8.24942 15.4472 8.75 16.5 8.75C18.2949 8.75 19.75 7.29493 19.75 5.5C19.75 3.70507 18.2949 2.25 16.5 2.25ZM14.75 5.5C14.75 4.5335 15.5335 3.75 16.5 3.75C17.4665 3.75 18.25 4.5335 18.25 5.5C18.25 6.4665 17.4665 7.25 16.5 7.25C15.5335 7.25 14.75 6.4665 14.75 5.5ZM6.5 10.25C5.5335 10.25 4.75 11.0335 4.75 12C4.75 12.9665 5.5335 13.75 6.5 13.75C7.4665 13.75 8.25 12.9665 8.25 12C8.25 11.0335 7.4665 10.25 6.5 10.25ZM16.5 16.75C15.5335 16.75 14.75 17.5335 14.75 18.5C14.75 19.4665 15.5335 20.25 16.5 20.25C17.4665 20.25 18.25 19.4665 18.25 18.5C18.25 17.5335 17.4665 16.75 16.5 16.75Z"
                fill="#1C274C"
              />
            </g>
          </svg>
          공유
        </a>
      </div>
    </div>

    <!-- 메뉴 탭 섹션 -->
    <div v-if="menuItems && menuItems.length > 0" class="flex-col text-center">
      <h2 class="">오늘의 메뉴</h2>
      <div class="m-auto w-1/2 rounded-2xl border-0 bg-slate-200">
        <p v-for="(menuItem, index) in menu" :key="index">{{ menuItem }}</p>
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
            class="bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg w-full transition"
            @click.prevent="goToMenuRegPage"
          >
            메뉴 제보하기
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useFetch } from '#app';
import { useRoute, useRouter } from 'vue-router';

// 라우트에서 storeId 가져오기
const route = useRoute();
const router = useRouter();
const storeId = route.params.storeId;

// 반응형 데이터 정의
const reviewStats = ref({ name: '', overallAverageScore: 0, reviewCount: 0 });
const selectedStore = ref({ name: '', description: '', image: '' });
const menuItems = ref([]);
const actionButtons = ref(['경로', '저장', '공유']); // 필요에 맞게 설정

// 데이터 가져오기 함수
async function fetchData() {
  const { data: reviewSummaryData, error: reviewSummaryError } = await useFetch(
    `http://localhost:8080/api/v1/stores/${storeId}/review-Summary`,
  );

  const { data: storeData, error: storeError } = await useFetch(
    `http://localhost:8080/api/v1/stores/${storeId}`,
  );
  const { data: menuData, error: menuError } = await useFetch(
    `http://localhost:8080/api/v1/stores/${storeId}/menus/today`,
  );

  // 데이터 콘솔 출력
  console.log('Review Summary Data:', reviewSummaryData.value);
  console.log('Store Data:', storeData.value);
  console.log('Menu Data:', menuData.value);

  if (reviewStatData.value) {
    reviewStats.value = {
      name: data.value.name,
      overallAverageScore: data.value.overallAverageScore,
      reviewCount: data.value.reviewCount,
    };
  }
  if (storeData.value) {
    selectedStore.value = storeData.value.store;
  }
  if (menuData.value) {
    menuItems.value = menuData.value.menus.map((item) => item.name);
  }

  if (storeError.value || menuError.value || reviewSummaryError.value) {
    console.error('데이터 가져오기 오류:', storeError.value || menuError.value);
  }
}

// 컴포넌트가 마운트될 때 데이터 가져오기
onMounted(fetchData);

// 메뉴 등록 페이지로 이동하는 함수
function goToMenuRegPage() {
  router.push(`/stores/${storeId}/menu/new`);
}
</script>

<style scoped>
/* 스타일 추가 */
h2 {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  padding: 5px 0;
}
button {
  cursor: pointer;
}
</style>
