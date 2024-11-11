<template>
  <div>
    <!-- 상단 이미지와 식당 정보 섹션 -->
    <div>
      <h2>{{ selectedStore.name }}</h2>
      <p>{{ selectedStore.description }}</p>
      <img :src="selectedStore.image" alt="식당 이미지" />
    </div>

    <!-- 경로, 저장, 공유 버튼 섹션 -->
    <div class="flex justify-evenly border-b-2 p-1 text-center text-xs">
      <div v-for="(action, index) in actionButtons" :key="index">
        <button class="w-20 p-2 bg-gray-200 hover:bg-gray-300">
          {{ action }}
        </button>
      </div>
    </div>

    <!-- 메뉴 탭 섹션 -->
    <div v-if="menuItems && menuItems.length > 0" class="p-4">
      <h3>오늘의 메뉴</h3>
      <ul>
        <li v-for="(menuItem, index) in menuItems" :key="index">
          {{ menuItem }}
        </li>
      </ul>
    </div>
    <div v-else class="p-4">
      <h3>오늘의 메뉴</h3>
      <p>메뉴 정보가 없습니다.</p>
      <button class="bg-gray-300 p-2 rounded" @click="goToMenuRegPage">
        메뉴 제보하기
      </button>
    </div>
  </div>
</template>

<<<<<<< HEAD
<script setup>
import { ref, onMounted } from 'vue';
import { useFetch } from '#app';
import { useRoute, useRouter } from 'vue-router';
=======
<script setup lang="ts">
definePageMeta({
  layout: 'admin',
});
</script>
>>>>>>> upstream/dev

// 라우트에서 storeId 가져오기
const route = useRoute();
const router = useRouter();
const storeId = route.params.storeId;

// 반응형 데이터 정의
const selectedStore = ref({ name: '', description: '', image: '' });
const menuItems = ref([]);
const actionButtons = ref(['경로', '저장', '공유']); // 필요에 맞게 설정

// 데이터 가져오기 함수
async function fetchData() {
  const { data: storeData, error: storeError } = await useFetch(
    `http://localhost:3000/stores/${storeId}`,
  );
  const { data: menuData, error: menuError } = await useFetch(
    `http://localhost:3000/stores/${storeId}/menus`,
  );

  if (storeData.value) {
    selectedStore.value = storeData.value.store;
  }
  if (menuData.value) {
    menuItems.value = menuData.value.menus.map((item) => item.name);
  }

  if (storeError.value || menuError.value) {
    console.error('데이터 가져오기 오류:', storeError.value || menuError.value);
  }
}

// 컴포넌트가 마운트될 때 데이터 가져오기
onMounted(fetchData);

// 메뉴 등록 페이지로 이동하는 함수
function goToMenuRegPage() {
  router.push('/newMenu');
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
