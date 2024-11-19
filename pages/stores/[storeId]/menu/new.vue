<template>
  <div class="min-h-screen flex items-center justify-center w-full">
    <main class="w-full max-w-full px-4">
      <section class="w-full max-w-xl mx-auto bg-white p-8">
        <h1 class="hidden">메뉴 등록</h1>
        <form
          class="space-y-4"
          enctype="multipart/form-data"
          @submit.prevent="handleSubmit"
        >
          <!-- 메뉴 사진 업로드 -->
          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700">
              메뉴 사진 업로드
            </label>
            <p class="text-sm text-gray-500 mb-4">
              메뉴에 관련된 사진을 업로드해주세요. (최대 5장)
            </p>
            <div class="flex gap-2 mb-4">
              <!-- 이미지 미리보기 및 삭제 기능 -->
              <div
                v-for="(file, index) in imageFiles"
                :key="index"
                class="relative w-20 h-20"
              >
                <img
                  :src="file.preview"
                  alt="이미지 미리보기"
                  class="w-full h-full object-cover rounded-md"
                />
                <button
                  type="button"
                  class="absolute top-1 right-1 bg-gray-200 rounded-full p-1"
                  @click="removeImage(index)"
                >
                  ✕
                </button>
              </div>

              <!-- 이미지 추가 버튼 -->
              <label
                v-if="imageFiles.length < 5"
                class="w-20 h-20 flex items-center justify-center border rounded-md cursor-pointer"
              >
                <input
                  type="file"
                  class="hidden"
                  multiple
                  accept="image/*"
                  @change="onFileChange"
                />
                <span>+</span>
              </label>
            </div>
            <!-- 이미지 업로드 에러 메시지 -->
            <p v-if="errors.images" class="text-red-500 text-sm">
              {{ errors.images }}
            </p>
          </div>

          <!-- 메인메뉴 입력 -->
          <div>
            <label
              for="mainMenu"
              class="mb-2 block text-sm font-medium text-gray-700"
            >
              메인메뉴
            </label>
            <input
              id="mainMenu"
              v-model="formData.mainMenu"
              name="mainMenu"
              class="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="메인 메뉴 하나를 입력해주세요."
            />
            <!-- 메인메뉴 에러 메시지 -->
            <p v-if="errors.mainMenu" class="text-red-500 text-sm">
              {{ errors.mainMenu }}
            </p>
          </div>

          <!-- 국물류 입력 -->
          <div>
            <label
              for="soup-menu"
              class="mb-2 block text-sm font-medium text-gray-700"
            >
              국물류
            </label>
            <input
              id="soup-menu"
              v-model="formData.soupMenu"
              name="soupMenu"
              class="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="국 혹은 찌개류 하나를 입력해주세요."
            />
            <!-- 국물류 에러 메시지 -->
            <p v-if="errors.soupMenu" class="text-red-500 text-sm">
              {{ errors.soupMenu }}
            </p>
          </div>

          <!-- 기타메뉴 입력 -->
          <div
            v-for="(etcMenu, index) in formData.etcMenus"
            :key="index"
            class="flex items-center space-x-2"
          >
            <div class="flex-1">
              <label
                :for="'etc-menu-' + index"
                class="mb-2 block text-sm font-medium text-gray-700"
              >
                기타메뉴{{ index + 1 }}
              </label>
              <input
                :id="'etc-menu-' + index"
                v-model="formData.etcMenus[index]"
                :name="'etcMenu' + index"
                class="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
                placeholder="그 외 메뉴 하나를 입력해주세요."
              />
              <!-- 기타메뉴 에러 메시지 -->
              <p v-if="errors.etcMenus[index]" class="text-red-500 text-sm">
                {{ errors.etcMenus[index] }}
              </p>
            </div>
            <!-- 기타메뉴 삭제 버튼 (기타메뉴가 1개 이상일 때 표시) -->
            <button
              v-if="formData.etcMenus.length > 1"
              type="button"
              class="text-red-500 hover:text-red-700"
              aria-label="기타메뉴 삭제"
              @click="removeMenu(index)"
            >
              ✕
            </button>
          </div>

          <!-- 메뉴 추가 -->
          <div>
            <button
              type="button"
              class="font-medium text-orange-500"
              :disabled="formData.etcMenus.length >= 5"
              @click="addMenu"
            >
              + 메뉴 추가
            </button>
          </div>

          <!-- 작성 완료 버튼 -->
          <div class="flex justify-center">
            <button
              type="submit"
              class="w-full rounded-lg bg-orange-500 py-3 text-white hover:bg-orange-600"
            >
              작성 완료
            </button>
          </div>
        </form>
      </section>
    </main>

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
import { ref, reactive, onBeforeMount } from 'vue';
import { useRoute, useRouter } from '#app';
import MenuRegModal from '~/components/user/modal/MenuRegModal.vue'; // Adjust the path as necessary

// 폼 데이터 초기화
const formData = ref({
  mainMenu: '',
  soupMenu: '',
  etcMenus: [''],
  menuImages: [],
});
const imageFiles = ref([]); // 이미지 미리보기와 파일을 함께 저장

// 에러 메시지 초기화
const errors = reactive({
  mainMenu: '',
  soupMenu: '',
  etcMenus: [],
  images: '',
});

// 라우트 및 라우터 정보 가져오기
const route = useRoute();
const router = useRouter();
const storeId = parseInt(route.params.storeId, 10); // Ensure storeId is a number

// Modal visibility state
const isModalVisible = ref(false);

// 파일 선택 시 미리보기 추가
const onFileChange = (event) => {
  const files = event.target.files;
  const maxSize = 5 * 1024 * 1024;

  for (const file of files) {
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
      if (imageFiles.value.length < 5) {
        imageFiles.value.push({ file, preview: e.target.result });
        // 이미지 관련 에러가 있으면 제거
        errors.images = '';
      }
    };
    reader.readAsDataURL(file);
  }
};

// 이미지 제거 함수
const removeImage = (index) => {
  imageFiles.value.splice(index, 1);
  // 이미지 관련 에러가 있으면 제거
  if (imageFiles.value.length < 5) {
    errors.images = '';
  }
};

// 기타 메뉴 추가 핸들러
const addMenu = () => {
  if (formData.value.etcMenus.length < 5) {
    formData.value.etcMenus.push('');
    errors.etcMenus.push(''); // 새 메뉴의 에러 초기화
  }
};

// 기타 메뉴 제거 핸들러
const removeMenu = (index) => {
  formData.value.etcMenus.splice(index, 1);
  errors.etcMenus.splice(index, 1);
};

// 유효성 검사 함수
const validateForm = () => {
  let isValid = true;

  // 에러 초기화
  errors.mainMenu = '';
  errors.soupMenu = '';
  errors.images = '';
  errors.etcMenus = formData.value.etcMenus.map(() => '');

  // 메인메뉴 유효성 검사
  if (!formData.value.mainMenu.trim()) {
    errors.mainMenu = '메인메뉴는 필수 입력 사항입니다.';
    isValid = false;
  }

  // 국물류 유효성 검사
  if (!formData.value.soupMenu.trim()) {
    errors.soupMenu = '국물류는 필수 입력 사항입니다.';
    isValid = false;
  }

  // 기타메뉴 유효성 검사
  formData.value.etcMenus.forEach((menu, index) => {
    if (!menu.trim()) {
      errors.etcMenus[index] = '이 항목은 비워둘 수 없습니다.';
      isValid = false;
    }
  });

  // 이미지 유효성 검사
  if (imageFiles.value.length === 0) {
    errors.images = '적어도 한 장의 메뉴 사진을 업로드해야 합니다.';
    isValid = false;
  }

  return isValid;
};

// Modal control functions
const showModal = () => {
  isModalVisible.value = true;
};

const hideModal = () => {
  isModalVisible.value = false;
};

// 폼 제출 핸들러
const handleSubmit = () => {
  if (validateForm()) {
    showModal();
  } else {
    // 첫 번째 에러로 스크롤 (선택 사항)
    const firstError = document.querySelector('.text-red-500');
    if (firstError) {
      firstError.scrollIntoView({ behavior: 'smooth' });
    }
  }
};

// 실제 폼 제출 함수
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
      },
    );
    console.log('서버 응답:', response);
    router.push(`/stores/${storeId}/menu`);
  } catch (error) {
    console.error('메뉴 등록 중 오류 발생:', error);
    // 선택적으로 서버 측 유효성 검사 오류를 처리할 수 있습니다.
    alert('메뉴 등록 중 오류가 발생했습니다. 다시 시도해주세요.');
  }
};

// 페이지 메타데이터 설정
onBeforeMount(() => {
  route.meta.title = '메뉴 등록';
});
</script>
