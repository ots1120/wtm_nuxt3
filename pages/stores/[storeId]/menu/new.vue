<template>
  <div class="min-h-screen bg-gray-100">
    <div class="max-w-md mx-auto bg-white overflow-hidden">
      <div class="p-6">
        <form enctype="multipart/form-data" @submit.prevent="handleSubmit">
          <!-- Image Upload and Carousel -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              메뉴 사진 업로드
            </label>
            <div class="relative">
              <div
                v-if="imageFiles.length > 0"
                class="w-full h-64 bg-gray-200 rounded-lg overflow-hidden"
              >
                <img
                  :src="imageFiles[currentImageIndex].preview"
                  alt="Preview"
                  class="w-full h-full object-contain"
                />
              </div>
              <div
                v-else
                class="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center"
              >
                <p class="text-gray-500">이미지를 업로드해주세요</p>
              </div>
              <button
                v-if="imageFiles.length > 1"
                type="button"
                class="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md"
                @click="prevImage"
              >
                <svg
                  class="w-6 h-6 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
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
                v-if="imageFiles.length > 1"
                type="button"
                class="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md"
                @click="nextImage"
              >
                <svg
                  class="w-6 h-6 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
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
            <div class="mt-2 flex justify-between items-center">
              <p class="text-sm text-gray-500">
                {{ imageFiles.length }}/5 이미지
              </p>
              <label
                v-if="imageFiles.length < 5"
                class="cursor-pointer bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition-colors"
              >
                추가
                <input
                  type="file"
                  class="hidden"
                  multiple
                  accept="image/*"
                  @change="onFileChange"
                />
              </label>
            </div>
            <p v-if="errors.images" class="mt-2 text-sm text-red-600">
              {{ errors.images }}
            </p>
          </div>

          <!-- Main Menu Input -->
          <div class="mb-4">
            <label
              for="mainMenu"
              class="block text-sm font-medium text-gray-700 mb-2"
              >메인메뉴</label
            >
            <input
              id="mainMenu"
              v-model="formData.mainMenu"
              type="text"
              class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="메인 메뉴를 입력해주세요"
            />
            <p v-if="errors.mainMenu" class="mt-2 text-sm text-red-600">
              {{ errors.mainMenu }}
            </p>
          </div>

          <!-- Soup Menu Input -->
          <div class="mb-4">
            <label
              for="soupMenu"
              class="block text-sm font-medium text-gray-700 mb-2"
              >국물류</label
            >
            <input
              id="soupMenu"
              v-model="formData.soupMenu"
              type="text"
              class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="국 혹은 찌개류를 입력해주세요"
            />
            <p v-if="errors.soupMenu" class="mt-2 text-sm text-red-600">
              {{ errors.soupMenu }}
            </p>
          </div>

          <!-- Other Menus -->
          <div
            v-for="(etcMenu, index) in formData.etcMenus"
            :key="index"
            class="mb-4"
          >
            <div class="flex items-center">
              <label
                :for="'etcMenu' + index"
                class="block text-sm font-medium text-gray-700 mb-2"
                >기타메뉴 {{ index + 1 }}</label
              >
              <button
                v-if="formData.etcMenus.length > 1"
                type="button"
                class="ml-auto text-red-500 hover:text-red-700"
                @click="removeMenu(index)"
              >
                삭제
              </button>
            </div>
            <input
              :id="'etcMenu' + index"
              v-model="formData.etcMenus[index]"
              type="text"
              class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="그 외 메뉴를 입력해주세요"
            />
            <p v-if="errors.etcMenus[index]" class="mt-2 text-sm text-red-600">
              {{ errors.etcMenus[index] }}
            </p>
          </div>

          <!-- Add Menu Button -->
          <button
            v-if="formData.etcMenus.length < 5"
            type="button"
            class="mb-6 text-blue-500 hover:text-blue-700 font-medium"
            @click="addMenu"
          >
            + 메뉴 추가
          </button>

          <!-- Submit Button -->
          <button
            type="submit"
            class="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
          >
            작성 완료
          </button>
        </form>
      </div>
    </div>

    <!-- Menu Registration Confirmation Modal -->
    <MenuRegModal
      :visible="isModalVisible"
      :store-id="storeId"
      @cancel="hideModal"
      @confirm="submitToServer"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onBeforeMount, computed } from 'vue';
import { useRoute, useRouter } from '#app';
import MenuRegModal from '~/components/user/modal/MenuRegModal.vue';

const formData = ref({
  mainMenu: '',
  soupMenu: '',
  etcMenus: [''],
  menuImages: [],
});

const imageFiles = ref([]);
const currentImageIndex = ref(0);

const errors = reactive({
  mainMenu: '',
  soupMenu: '',
  etcMenus: [],
  images: '',
});

const route = useRoute();
const router = useRouter();
const storeId = parseInt(route.params.storeId, 10);

const isModalVisible = ref(false);

const onFileChange = (event) => {
  const files = event.target.files;
  const maxSize = 5 * 1024 * 1024;

  for (const file of files) {
    if (imageFiles.value.length >= 5) break;

    if (file.size > maxSize) {
      alert(`${file.name} 파일은 5MB를 초과합니다.`);
      continue;
    }
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      alert(`${file.name} 파일 형식이 허용되지 않습니다.`);
      continue;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      imageFiles.value.push({ file, preview: e.target.result });
      errors.images = '';
    };
    reader.readAsDataURL(file);
  }
};

const removeImage = (index) => {
  imageFiles.value.splice(index, 1);
  if (currentImageIndex.value >= imageFiles.value.length) {
    currentImageIndex.value = Math.max(0, imageFiles.value.length - 1);
  }
  if (imageFiles.value.length < 5) {
    errors.images = '';
  }
};

const prevImage = () => {
  currentImageIndex.value =
    (currentImageIndex.value - 1 + imageFiles.value.length) %
    imageFiles.value.length;
};

const nextImage = () => {
  currentImageIndex.value =
    (currentImageIndex.value + 1) % imageFiles.value.length;
};

const addMenu = () => {
  if (formData.value.etcMenus.length < 5) {
    formData.value.etcMenus.push('');
    errors.etcMenus.push('');
  }
};

const removeMenu = (index) => {
  formData.value.etcMenus.splice(index, 1);
  errors.etcMenus.splice(index, 1);
};

const validateForm = () => {
  let isValid = true;

  errors.mainMenu = '';
  errors.soupMenu = '';
  errors.images = '';
  errors.etcMenus = formData.value.etcMenus.map(() => '');

  if (!formData.value.mainMenu.trim()) {
    errors.mainMenu = '메인메뉴는 필수 입력 사항입니다.';
    isValid = false;
  }

  if (!formData.value.soupMenu.trim()) {
    errors.soupMenu = '국물류는 필수 입력 사항입니다.';
    isValid = false;
  }

  formData.value.etcMenus.forEach((menu, index) => {
    if (!menu.trim()) {
      errors.etcMenus[index] = '이 항목은 비워둘 수 없습니다.';
      isValid = false;
    }
  });

  if (imageFiles.value.length === 0) {
    errors.images = '적어도 한 장의 메뉴 사진을 업로드해야 합니다.';
    isValid = false;
  }

  return isValid;
};

const showModal = () => {
  isModalVisible.value = true;
};

const hideModal = () => {
  isModalVisible.value = false;
};

const handleSubmit = () => {
  if (validateForm()) {
    showModal();
  } else {
    const firstError = document.querySelector('.text-red-600');
    if (firstError) {
      firstError.scrollIntoView({ behavior: 'smooth' });
    }
  }
};

const submitToServer = async (storeId) => {
  hideModal();

  const form = new FormData();
  form.append('mainMenu', formData.value.mainMenu);
  form.append('soupMenu', formData.value.soupMenu);
  formData.value.etcMenus.forEach((etcMenu, index) => {
    form.append(`etcMenus[${index}]`, etcMenu);
  });
  imageFiles.value.forEach(({ file }) => {
    form.append('files', file);
  });

  try {
    const response = await $fetch(
      `http://localhost:8080/api/v1/stores/${storeId}/menus`,
      {
        method: 'POST',
        body: form,
        credentials: 'include',
      },
    );
    console.log('서버 응답:', response);
    router.push(`/stores/${storeId}/menu`);
  } catch (error) {
    console.error('메뉴 등록 중 오류 발생:', error);
    alert('메뉴 등록 중 오류가 발생했습니다. 다시 시도해주세요.');
  }
};

onBeforeMount(() => {
  route.meta.title = '메뉴 등록';
});
</script>
