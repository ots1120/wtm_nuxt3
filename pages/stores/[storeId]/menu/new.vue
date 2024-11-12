<template>
  <div class="min-h-screen flex items-center justify-center w-full p-10">
    <main class="w-full max-w-full px-4">
      <section class="w-full max-w-xl mx-auto bg-white p-8">
        <h1 class="hidden">메뉴 등록</h1>
        <form
          class="space-y-4"
          enctype="multipart/form-data"
          @submit.prevent="submitForm"
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
          </div>

          <!-- 기타메뉴 입력 -->
          <div v-for="(etcMenu, index) in formData.etcMenus" :key="index">
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
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from '#app';

// 폼 데이터 초기화
const formData = ref({
  mainMenu: '',
  soupMenu: '',
  etcMenus: [''],
  menuImages: [],
});
const imageFiles = ref([]); // 이미지 미리보기와 파일을 함께 저장
const imagePreview = ref(null); // 이미지 미리보기 저장

// 라우트 및 라우터 정보 가져오기
const route = useRoute();
const router = useRouter();
const storeId = route.params.storeId;

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
      imageFiles.value.push({ file, preview: e.target.result });
    };
    reader.readAsDataURL(file);
  }
};

// 이미지 제거 함수
const removeImage = (index) => {
  imageFiles.value.splice(index, 1);
};

// 기타 메뉴 추가 핸들러
const addMenu = () => {
  if (formData.value.etcMenus.length < 5) {
    formData.value.etcMenus.push('');
  }
};

// 폼 제출 핸들러
const submitForm = async () => {
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
  }
};
</script>

<style scoped>
/* 필요한 경우 스타일 추가 */
</style>
