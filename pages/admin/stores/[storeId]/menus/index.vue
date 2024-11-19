<template>
  <div class="flex flex-col mx-auto p-4 w-full max-w-lg">
    <!-- 제목 -->
    <h1 class="text-2xl font-bold text-gray-800 mb-6">일별 메뉴 관리</h1>

    <!-- 날짜 선택 -->
    <div
      class="flex flex-col items-center justify-center bg-white shadow-md rounded-lg p-6 mb-6"
    >
      <h2 class="text-lg font-semibold text-gray-700 mb-4">날짜 선택</h2>
      <Datepicker
        v-model="selectedDate"
        :auto-apply="true"
        :enable-time-picker="false"
        :inline="true"
        :format="'yyyy-MM-dd'"
        class=""
      />
    </div>

    <!-- 이미지 업로드 및 슬라이더 -->
    <div class="mb-6 relative">
      <!-- Hidden file input -->
      <input
        id="image-upload"
        type="file"
        accept="image/*"
        multiple
        style="display: none"
        @change="handleImageUpload"
      />
      <!-- 이미지 업로드 영역 -->
      <label
        for="image-upload"
        class="flex items-center justify-center w-full h-64 bg-gray-200 border-2 border-dashed border-gray-400 rounded-md cursor-pointer relative overflow-hidden"
      >
        <!-- 이미지 슬라이더 -->
        <div class="absolute inset-0 w-full h-full">
          <!-- Slider -->
          <div class="relative w-full h-full">
            <div
              class="flex transition-transform duration-500 h-full"
              :style="{ transform: `translateX(-${currentImageIndex * 100}%)` }"
            >
              <div
                v-for="(image, index) in allImages"
                :key="index"
                class="flex-shrink-0 w-full h-full relative"
              >
                <img
                  :src="image.url"
                  alt="Uploaded Image"
                  class="object-cover w-full h-full"
                />
                <!-- 삭제 버튼 -->
                <button
                  class="delete-button absolute top-2 right-2 bg-red-600 bg-opacity-75 text-white rounded-full w-8 h-8 flex items-center justify-center"
                  @click.stop="openDeleteModal(image.id, index)"
                >
                  &times;
                </button>
              </div>
            </div>

            <!-- 네비게이션 버튼 -->
            <button
              class="navigation-button absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white w-8 h-8 flex items-center justify-center rounded-full"
              :class="{
                'opacity-50 cursor-not-allowed': currentImageIndex <= 0,
              }"
              :disabled="currentImageIndex <= 0"
              @click.stop="prevImage"
            >
              <!-- 왼쪽 화살표 아이콘 -->
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              class="navigation-button absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white w-8 h-8 flex items-center justify-center rounded-full"
              :class="{
                'opacity-50 cursor-not-allowed':
                  currentImageIndex >= allImages.length - 1,
              }"
              :disabled="currentImageIndex >= allImages.length - 1"
              @click.stop="nextImage"
            >
              <!-- 오른쪽 화살표 아이콘 -->
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>

        <!-- 업로드 안내 문구 -->
        <div
          v-if="allImages.length === 0"
          class="flex flex-col justify-center items-center text-center absolute inset-0"
        >
          <!-- 업로드 아이콘 -->
          <svg
            fill="#000000"
            width="64px"
            height="64px"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <!-- SVG 내용 -->
            <path
              d="M19,13a1,1,0,0,0-1,1v.38L16.52,12.9a2.79,2.79,0,0,0-3.93,0l-.7.7L9.41,11.12a2.85,2.85,0,0,0-3.93,0L4,12.6V7A1,1,0,0,1,5,6h7a1,1,0,0,0,0-2H5A3,3,0,0,0,2,7V19a3,3,0,0,0,3,3H17a3,3,0,0,0,3-3V14A1,1,0,0,0,19,13ZM5,20a1,1,0,0,1-1-1V15.43l2.9-2.9a.79.79,0,0,1,1.09,0l3.17,3.17,0,0L15.46,20Zm13-1a.89.89,0,0,1-.18.53L13.31,15l.7-.7a.77.77,0,0,1,1.1,0L18,17.21ZM22.71,4.29l-3-3a1,1,0,0,0-.33-.21,1,1,0,0,0-.76,0,1,1,0,0,0-.33.21l-3,3a1,1,0,0,0,1.42,1.42L18,4.41V10a1,1,0,0,0,2,0V4.41l1.29,1.3a1,1,0,0,0,1.42,0A1,1,0,0,0,22.71,4.29Z"
            />
          </svg>
          <span class="mt-2 text-sm text-gray-600">
            이미지를 업로드하려면 클릭하세요
          </span>
        </div>
      </label>
    </div>

    <!-- 일별 메뉴 테이블 -->
    <div class="bg-white shadow-md rounded-lg p-2">
      <h2 class="text-lg font-semibold text-gray-700 mb-4">
        {{ selectedDate.toLocaleDateString() }} 메뉴
      </h2>
      <table class="table-auto w-full border-collapse border border-gray-200">
        <colgroup>
          <col style="width: 45%" />
          <col style="width: 35%" />
          <col style="width: 20%" />
        </colgroup>
        <thead>
          <tr>
            <th class="border border-gray-200 px-4 py-2 text-left">메뉴</th>
            <th class="border border-gray-200 px-4 py-2 text-left">카테고리</th>
            <th class="border border-gray-200 px-4 py-2 text-center"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in dailyMenus" :key="item.id || index">
            <td class="border border-gray-200 px-4 py-2">
              <input
                v-model="item.name"
                type="text"
                placeholder="메뉴 이름 입력"
                class="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-200"
              />
            </td>
            <td class="border border-gray-200 px-4 py-2">
              <select
                v-model.number="item.categoryId"
                class="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-200"
              >
                <option disabled value="">카테고리 선택</option>
                <option value="1">메인</option>
                <option value="2">국물</option>
                <option value="3">기타</option>
              </select>
            </td>
            <td class="border border-gray-200 px-4 py-2 text-center">
              <!-- 삭제 버튼 -->
              <button
                type="button"
                class="text-red-600 hover:text-red-800 text-sm"
                @click="openMenuDeleteModal(item.id, index)"
              >
                삭제
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <!-- 메뉴 추가 버튼 -->
      <button
        type="button"
        class="w-full mt-4 px-4 py-2 bg-green-200 text-green-800 rounded-md hover:bg-gray-300"
        @click="addMenu"
      >
        메뉴 추가
      </button>
      <!-- 저장 버튼 -->
      <button
        type="button"
        class="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        @click="openSaveModal"
      >
        저장
      </button>
    </div>
    <ConfirmModal
      v-if="isImgModalVisible"
      :visible="isImgModalVisible"
      message-title="이미지 삭제"
      message-body="정말 이 이미지를 삭제하시겠습니까?"
      cancel-message="취소"
      confirm-message="삭제"
      @confirm="confirmDeleteImage"
      @cancel="cancelDeleteImage"
    />
    <ConfirmModal
      v-if="isMenuModalVisible"
      :visible="isMenuModalVisible"
      message-title="메뉴 삭제"
      message-body="정말 이 메뉴를 삭제하시겠습니까?"
      cancel-message="취소"
      confirm-message="삭제"
      @confirm="confirmDeleteMenu"
      @cancel="cancelDeleteMenu"
    />

    <ConfirmModal
      v-if="isSaveModalVisible"
      :visible="isSaveModalVisible"
      message-title="저장 확인"
      message-body="정말로 모든 변경 사항을 저장하시겠습니까?"
      cancel-message="취소"
      confirm-message="저장"
      @confirm="confirmSaveModal"
      @cancel="cancelSaveModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onBeforeMount } from 'vue';
import { useRoute, useRuntimeConfig } from '#app';
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import ConfirmModal from '~/components/modal/BasicModal.vue';

const config = useRuntimeConfig();
const baseUrl = config.public.baseApiUrl;

onBeforeMount(() => {
  route.meta.title = '메뉴관리';
});

definePageMeta({
  layout: 'admin',
});

interface MenuItem {
  id?: number;
  name: string;
  categoryId: number | '';
  userId?: number; // 추가: 사용자 ID
}

interface MenuResponse {
  menuId: number;
  mealId: number;
  userId: number;
  categoryId: number;
  name: string;
  regDate: string;
  modDate: string;
}

interface MenuImgDto {
  id: number;
  url: string;
}

interface ImageItem {
  id?: number; // 이미지 ID
  url: string; // 이미지 URL
  file?: File; // 아직 업로드되지 않은 새로운 이미지
}

const selectedDate = ref<Date>(new Date());
const dailyMenus = ref<MenuItem[]>([]);
const route = useRoute();
const storeId = route.params.storeId as string;

// 이미지 삭제 모달 변수
const isImgModalVisible = ref(false);
const targetImageIndex = ref<number | null>(null);
const targetImageId = ref<number | undefined>(undefined);
// 메뉴 삭제 모달 변수
const isMenuModalVisible = ref(false);
const targetMenuIndex = ref<number | null>(null);
const targetMenuId = ref<number | undefined>(undefined);
// 메뉴 저장 모달 변수
const isSaveModalVisible = ref(false);

// 이미지 삭제 모달 함수
const openDeleteModal = (imageId: number | undefined, index: number) => {
  targetImageId.value = imageId;
  targetImageIndex.value = index;
  isImgModalVisible.value = true;
};

// 이미지 삭제 모달 확인 함수
const confirmDeleteImage = async () => {
  if (targetImageIndex.value !== null) {
    await deleteImage(targetImageId.value, targetImageIndex.value);
    isImgModalVisible.value = false; // 모달 닫기
    targetImageIndex.value = null; // 대상 초기화
    targetImageId.value = undefined; // 대상 초기화
  }
};

// 이미지 삭제 모달 취소 처리 함수
const cancelDeleteImage = () => {
  isImgModalVisible.value = false; // 모달 닫기
  targetImageIndex.value = null; // 대상 초기화
  targetImageId.value = undefined; // 대상 초기화
};

// 메뉴 삭제 모달 함수
const openMenuDeleteModal = (menuId: number | undefined, index: number) => {
  targetMenuId.value = menuId;
  targetMenuIndex.value = index;
  isMenuModalVisible.value = true;
};

// 메뉴 삭제 모달 확인 함수
const confirmDeleteMenu = async () => {
  if (targetMenuIndex.value !== null) {
    // 메뉴 삭제 함수 호출
    await removeMenu(targetMenuIndex.value, targetMenuId.value);
    // 로컬 상태에서 메뉴 제거
    dailyMenus.value.splice(targetMenuIndex.value, 1);
    // 상태 초기화 및 모달 닫기
    targetMenuIndex.value = null;
    targetMenuId.value = undefined;
    isMenuModalVisible.value = false;
  }
};

// 메뉴 삭제 모달 취소 함수
const cancelDeleteMenu = () => {
  isMenuModalVisible.value = false;
  targetMenuIndex.value = null;
  targetMenuId.value = undefined;
};

// 저장 모달 열기
const openSaveModal = () => {
  isSaveModalVisible.value = true;
};

// 저장 모달 확인 함수
const confirmSaveModal = async () => {
  isSaveModalVisible.value = false; // 모달 닫기
  await saveAllData(); // 실제 저장 함수 호출
};

// 저장 모달 취소 함수
const cancelSaveModal = () => {
  isSaveModalVisible.value = false; // 모달 닫기
};

// 이미지 슬라이더 상태
const allImages = ref<ImageItem[]>([]);
const currentImageIndex = ref(0);

// 현재 로그인된 사용자 ID (예시로 1을 사용, 실제로는 로그인한 사용자 정보에서 가져와야 함)
const currentUserId = ref<number>(1);

// 메뉴 추가
const addMenu = () => {
  dailyMenus.value.push({
    name: '',
    categoryId: 0,
    userId: currentUserId.value, // 추가: 사용자 ID 설정
  });
};

// 메뉴 삭제
const removeMenu = (index: number, menuId?: number) => {
  if (menuId) {
    // 기존 메뉴인 경우 서버에서 삭제
    deleteMenu(menuId);
  }
  // dailyMenus에서 제거
  dailyMenus.value.splice(index, 1);
};

const deleteMenu = async (menuId: number) => {
  const { error } = await useFetch(
    `api/v1/admin/stores/${storeId}/menus/${menuId}`,
    {
      baseURL: baseUrl,
      method: 'DELETE',
    },
  );
  if (error.value) {
    console.error('메뉴 삭제 실패:', error.value);
  } else {
    console.log('메뉴 삭제 성공');
  }
};

const saveMenus = async () => {
  // 모든 메뉴가 유효한지 검증
  for (const menu of dailyMenus.value) {
    if (!menu.name || !menu.categoryId) {
      alert('모든 메뉴 항목에 이름과 카테고리를 입력해주세요.');
      return;
    }
  }

  const mealDate = selectedDate.value.toISOString().split('T')[0];

  // 신규 메뉴와 기존 메뉴 분리
  const newMenus = dailyMenus.value.filter((menu) => !menu.id);
  const existingMenus = dailyMenus.value.filter((menu) => menu.id);

  try {
    // 신규 메뉴 저장
    if (newMenus.length > 0) {
      const menuDtos = newMenus.map((menu) => ({
        name: menu.name,
        categoryId: menu.categoryId,
        userId: menu.userId,
      }));

      await $fetch(`api/v1/admin/stores/${storeId}/menus`, {
        baseURL: baseUrl,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
          mealDate,
          menuDtos,
        },
      });

      console.log('신규 메뉴 등록 성공');
    }

    // 기존 메뉴 수정
    for (const menu of existingMenus) {
      const menuDto = {
        name: menu.name,
        categoryId: menu.categoryId,
        userId: menu.userId,
      };

      const body = {
        mealDate,
        menuDto,
      };

      console.log('Sending PUT request with body:', body);

      await $fetch(`api/v1/admin/stores/${storeId}/menus/${menu.id}`, {
        method: 'PUT',
        baseURL: baseUrl,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      console.log(`메뉴 수정 성공: ${menu.name}`);
    }

    // 메뉴 데이터 갱신
    await fetchMenus();
  } catch (error) {
    console.error('메뉴 저장 실패:', error);
  }
};

const saveImages = async () => {
  const mealDate = selectedDate.value.toISOString().split('T')[0];

  try {
    // 이미지 파일 업로드
    const imageFiles = allImages.value
      .filter((img) => img.file)
      .map((img) => img.file!);

    if (imageFiles.length > 0) {
      const formData = new FormData();
      formData.append('mealDate', mealDate);
      imageFiles.forEach((file) => {
        formData.append('imgs', file);
      });

      const response = await $fetch(`api/v1/admin/stores/${storeId}/menuImgs`, {
        baseURL: baseUrl,
        method: 'POST',
        body: formData,
      });

      console.log('이미지 업로드 성공:', response);
    }

    // 이미지 데이터 갱신
    await fetchImages();
  } catch (error) {
    console.error('이미지 저장 실패:', error);
  }
};

// 저장 버튼 클릭 시
const saveAllData = async () => {
  await saveMenus();
  await saveImages();
};

// 이미지 업로드
const handleImageUpload = (event: Event) => {
  const files = (event.target as HTMLInputElement).files;
  if (files) {
    const newFiles = Array.from(files).map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    allImages.value.push(...newFiles);
  }
};

// 이미지 삭제
const deleteImage = async (imageImgId: number | undefined, index: number) => {
  console.log('deleteImage called with imageId:', imageImgId, 'index:', index);
  if (imageImgId) {
    console.log('imageId is defined, making API call');
    try {
      await $fetch(`api/v1/admin/stores/${storeId}/menuImgs/${imageImgId}`, {
        baseURL: baseUrl,
        method: 'DELETE',
      });
      console.log('이미지 삭제 성공');

      // 이미지 배열에서 제거
      allImages.value.splice(index, 1);
      // 현재 이미지 인덱스 업데이트
      if (currentImageIndex.value >= allImages.value.length) {
        currentImageIndex.value = allImages.value.length - 1;
      }
    } catch (error) {
      console.error('이미지 삭제 실패:', error);
    }
  } else {
    console.log('imageId is undefined or zero');

    // 새로 업로드된 이미지일 경우, 바로 제거
    allImages.value.splice(index, 1);
    if (currentImageIndex.value >= allImages.value.length) {
      currentImageIndex.value = allImages.value.length - 1;
    }
  }
};

// 이미지 슬라이더 이전 버튼
const prevImage = () => {
  if (currentImageIndex.value > 0) {
    currentImageIndex.value--;
  }
};

// 이미지 슬라이더 다음 버튼
const nextImage = () => {
  if (currentImageIndex.value < allImages.value.length - 1) {
    currentImageIndex.value++;
  }
};

// 메뉴 조회
const fetchMenus = async () => {
  try {
    const menuData = await $fetch<MenuResponse[]>(
      `api/v1/admin/stores/${storeId}/menus`,
      {
        baseURL: baseUrl,
        params: { date: selectedDate.value.toISOString().split('T')[0] },
      },
    );

    dailyMenus.value = menuData.map((menu) => ({
      id: menu.menuId,
      name: menu.name,
      categoryId: menu.categoryId,
      userId: menu.userId, // 추가: 사용자 ID 포함
    }));
  } catch (error) {
    console.error('메뉴 로드 실패:', error);
    dailyMenus.value = [];
  }
};

// 이미지 조회
const fetchImages = async () => {
  try {
    const imageData = await $fetch<MenuImgDto[]>(
      `/api/v1/admin/stores/${storeId}/menuImgs`,
      {
        baseURL: baseUrl,
        params: { date: selectedDate.value.toISOString().split('T')[0] },
      },
    );

    allImages.value = imageData.map((img) => ({
      id: img.id,
      url: `${baseUrl}${img.url}`,
    }));
    currentImageIndex.value = 0; // 슬라이더 인덱스 초기화
  } catch (error) {
    console.error('이미지 로드 실패:', error);
    allImages.value = [];
  }
};

// 날짜 변경 시 메뉴 및 이미지 조회
watch(selectedDate, () => {
  fetchMenus();
  fetchImages();
});

// 초기 메뉴 및 이미지 조회
fetchMenus();
fetchImages();
</script>
