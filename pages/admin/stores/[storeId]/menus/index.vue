<template>
  <div class="container mx-auto p-6 space-y-6">
    <h1 class="text-3xl font-bold text-gray-800">일별 메뉴 등록</h1>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="bg-white shadow-md rounded-lg p-10">
        <h2 class="text-xl font-semibold text-gray-700 mb-4">날짜 선택</h2>
        <Datepicker
          v-model="selectedDate"
          :auto-apply="true"
          :enable-time-picker="false"
          :inline="true"
          :format="'yyyy-MM-dd'"
          class="rounded-md"
        />
      </div>

      <div class="bg-white shadow-md rounded-lg p-6">
        <h2 class="text-xl font-semibold text-gray-700 mb-4">메뉴 등록</h2>
        <form class="space-y-4" @submit.prevent="handleSubmitMenus">
          <div v-for="(menu, index) in menus" :key="index" class="space-y-2">
            <h3 class="text-gray-600 font-medium">메뉴 {{ index + 1 }}</h3>
            <div>
              <label class="block text-sm font-medium text-gray-600"
                >메뉴 이름</label
              >
              <input
                v-model="menu.name"
                type="text"
                placeholder="메뉴 이름 입력"
                class="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-200"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-600"
                >카테고리</label
              >
              <select
                v-model.number="menu.categoryId"
                class="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-200"
              >
                <option disabled value="">카테고리 선택</option>
                <option value="1">메인</option>
                <option value="2">사이드</option>
                <option value="3">디저트</option>
              </select>
            </div>
            <button
              type="button"
              class="text-red-600 hover:text-red-800"
              @click="removeMenu(index)"
            >
              삭제
            </button>
          </div>
          <div>
            <button
              type="button"
              class="mt-4 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              @click="addMenu"
            >
              메뉴 추가
            </button>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-600"
              >이미지 업로드</label
            >
            <input
              type="file"
              accept="image/*"
              multiple
              class="w-full mt-1 px-4 py-2 border rounded-md focus:ring focus:ring-blue-200"
              @change="handleImageUpload"
            />
          </div>
          <div v-if="previewImages.length" class="mt-4 grid grid-cols-2 gap-4">
            <div
              v-for="(image, index) in previewImages"
              :key="index"
              class="border rounded-md p-2"
            >
              <img
                :src="image"
                alt="Preview"
                class="object-cover w-full h-32"
              />
            </div>
          </div>
          <button
            type="submit"
            class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            등록
          </button>
        </form>
      </div>
    </div>

    <div class="bg-white shadow-md rounded-lg p-6">
      <h2 class="text-xl font-semibold text-gray-700 mb-4">
        {{ selectedDate.toLocaleDateString() }} 메뉴
      </h2>
      <table class="table-auto w-full border-collapse border border-gray-200">
        <thead>
          <tr>
            <th class="border border-gray-200 px-4 py-2 text-left">메뉴</th>
            <th class="border border-gray-200 px-4 py-2 text-left">카테고리</th>
            <th class="border border-gray-200 px-4 py-2 text-left">이미지</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in dailyMenus" :key="item.id">
            <td class="border border-gray-200 px-4 py-2">{{ item.name }}</td>
            <td class="border border-gray-200 px-4 py-2">
              {{ item.categoryId }}
            </td>
            <td class="border border-gray-200 px-4 py-2">
              <div v-if="item.menuImg.length" class="flex flex-wrap gap-2">
                <div v-for="(img, index) in item.menuImg" :key="index">
                  <a :href="img" target="_blank">
                    <img
                      :src="img"
                      alt="Menu"
                      class="w-16 h-16 object-cover rounded-md"
                    />
                  </a>
                </div>
              </div>
              <p v-else>미등록</p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import { useRoute, useFetch } from '#app';

onBeforeMount(() => {
  route.meta.title = '메뉴관리';
});

definePageMeta({
  layout: 'admin',
});

interface Menu {
  name: string;
  categoryId: number | '';
  menuImg: string[];
}

interface MenuResponse {
  id: number;
  name: string;
  categoryId: number;
  menuImg: string[];
}

const selectedDate = ref<Date>(new Date());
const menus = ref<Menu[]>([{ name: '', categoryId: '', menuImg: [] }]);
const dailyMenus = ref<MenuResponse[]>([]);
const images = ref<File[]>([]);
const previewImages = ref<string[]>([]);
const route = useRoute();
const storeId = route.params.storeId as string;

// 메뉴 추가
const addMenu = () => {
  menus.value.push({ name: '', categoryId: '', menuImg: [] });
};

// 메뉴 삭제
const removeMenu = (index: number) => {
  menus.value.splice(index, 1);
};

// 이미지 업로드
const handleImageUpload = (event: Event) => {
  const files = (event.target as HTMLInputElement).files;
  if (files) {
    images.value = Array.from(files);
    previewImages.value = images.value.map((file) => URL.createObjectURL(file));
  }
};

// 메뉴 조회
const fetchMenus = async () => {
  const { data, error } = await useFetch<MenuResponse[]>(
    `http://localhost:8080/api/admin/stores/${storeId}/menus`,
    {
      query: { date: selectedDate.value.toISOString().split('T')[0] },
    },
  );

  if (!error.value && data.value) {
    dailyMenus.value = data.value.map((menu) => ({
      id: menu.id,
      name: menu.name,
      categoryId: menu.categoryId,
      menuImg: menu.menuImg.map((img) => `http://localhost:8080${img}`),
    }));
  } else {
    console.error('메뉴 조회 실패:', error.value);
  }
};

// 메뉴 등록
const handleSubmitMenus = async () => {
  const formData = new FormData();

  // MealDate 추가
  formData.append('mealDate', selectedDate.value.toISOString().split('T')[0]);

  // 메뉴 DTO 추가
  const menuDtos = menus.value.map(({ name, categoryId }) => ({
    name,
    categoryId,
    userId: 1, // 하드코딩된 사용자 ID
  }));
  formData.append('menuDtos', JSON.stringify(menuDtos));

  // 이미지 파일 추가
  images.value.forEach((image) => formData.append('imgs', image));

  const { data, error } = await useFetch<MenuResponse[]>(
    `http://localhost:8080/api/admin/stores/${storeId}/menus`,
    {
      method: 'POST',
      body: formData,
    },
  );

  if (!error.value && data.value) {
    console.log('메뉴 등록 성공');
    fetchMenus(); // 등록 후 메뉴 목록 갱신
    menus.value = [{ name: '', categoryId: '', menuImg: [] }];
    images.value = [];
    previewImages.value = [];
  } else {
    console.error('메뉴 등록 실패:', error.value);
  }
};

// 날짜 변경 시 메뉴 조회
watch(selectedDate, fetchMenus);

// 초기 메뉴 조회
fetchMenus();
</script>
