<template>
  <div>
    <TheHeader title="메뉴등록" />
    <main class="flex min-h-screen items-center justify-center">
      <section class="w-full max-w-md p-8">
        <h1 class="hidden">메뉴 등록</h1>
        <form
          class="space-y-4"
          enctype="multipart/form-data"
          @submit.prevent="submitForm"
        >
          <!-- 메뉴 사진 업로드 -->
          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700"
              >메뉴사진 업로드</label
            >
            <div class="flex w-full items-center justify-center">
              <label
                class="flex h-32 w-32 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-400"
              >
                <input
                  id="menu-img"
                  type="file"
                  name="menuImg"
                  class="hidden"
                  accept="image/*"
                  multiple
                  @change="handleFileUpload"
                />
                <!-- 이미지 미리보기 -->
                <img
                  v-if="imagePreview"
                  :src="imagePreview"
                  alt="Image Preview"
                  class="h-32 w-32 object-cover mt-2 rounded-lg"
                />
              </label>
            </div>
          </div>

          <!-- 메인메뉴 입력 -->
          <div>
            <label
              for="mainMenu"
              class="mb-2 block text-sm font-medium text-gray-700"
              >메인메뉴</label
            >
            <input
              id="mainMenu"
              v-model="formData.mainMenu"
              name="mainMenu"
              class="menu-register__input w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="메인 메뉴 하나를 입력해주세요."
            />
          </div>

          <!-- 국물류 입력 -->
          <div>
            <label
              for="soup-menu"
              class="mb-2 block text-sm font-medium text-gray-700"
              >국물류</label
            >
            <input
              id="soup-menu"
              v-model="formData.soupMenu"
              name="soupMenu"
              class="menu-register__input w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="국 혹은 찌개류 하나를 입력해주세요."
            />
          </div>

          <!-- 기타메뉴 입력 -->
          <div v-for="(etcMenu, index) in formData.etcMenus" :key="index">
            <label
              :for="'etc-menu-' + index"
              class="mb-2 block text-sm font-medium text-gray-700"
              >기타메뉴{{ index + 1 }}</label
            >
            <input
              :id="'etc-menu-' + index"
              v-model="formData.etcMenus[index]"
              :name="'etcMenu' + index"
              class="menu-register__input w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
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
import { useRoute, useFetch } from '#app';
import TheHeader from '~/components/user/layout/TheHeader.vue';

// 폼 데이터 초기화
const formData = ref({
  mainMenu: '',
  soupMenu: '',
  etcMenus: [''],
  menuImages: [],
});
const imagePreview = ref(null); // 이미지 미리보기 저장

// 라우트 정보 가져오기
const route = useRoute();
const storeId = route.params.storeId;

// 파일 업로드 핸들러
const handleFileUpload = (event) => {
  formData.value.menuImages = event.target.files;
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
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
  Array.from(formData.value.menuImages).forEach((file, index) => {
    form.append(`menuImages[${index}]`, file);
  });

  // FormData 내용 확인
  form.forEach((value, key) => {
    console.log(key, value);
  });

  try {
    const { data, error } = await useFetch(
      `http://localhost:3000/stores/${storeId}/menus`,
      {
        method: 'POST',
        body: form,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    if (error.value) {
      console.error('메뉴 등록 중 오류 발생:', error.value);
    } else {
      console.log('서버 응답:', data.value);
    }
  } catch (err) {
    console.error('API 요청 중 오류 발생:', err);
  }
};
</script>

<style scoped>
/* 필요한 경우 스타일 추가 */
</style>
