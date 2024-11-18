<template>
  <section class="flex justify-center">
    <form
      action=""
      enctype="multipart/form-data"
      class="w-full max-w-lg"
      @submit.prevent="openModal"
    >
      <div
        class="flex flex-col items-center justify-center border-b text-center"
      >
        <div
          class="w-32 h-32 rounded-full border overflow-hidden flex items-center justify-center"
        >
          <img
            v-if="isDataLoaded"
            :src="store.profilePicture"
            alt="Profile Image"
            class="w-full h-full object-cover"
            width="120"
            height="120"
          />
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            class="w-2/3 h-2/3"
            viewBox="0 0 16 16"
          />
        </div>

        <div class="mb-3">
          <label for="profileImg" class="text-blue-500 cursor-pointer"
            >가게 사진 수정</label
          >
          <input
            id="profileImg"
            type="file"
            name="profileImg"
            class="hidden"
            @change="handleImageUpload"
          />
        </div>
      </div>

      <div class="flex flex-col">
        <!-- 가게 이름 -->
        <div class="flex justify-between items-center border-b py-2">
          <label for="nickname" class="text-lg font-extrabold text-gray-700"
            >가게이름</label
          >
          <input
            id="nickname"
            v-model="store.storeName"
            type="text"
            class="w-full max-w-sm p-2"
            placeholder="가게이름"
          />
        </div>

        <!-- 가게 주소 -->
        <div class="flex justify-between items-center border-b py-2">
          <label for="address" class="text-lg font-extrabold text-gray-700"
            >가게주소</label
          >
          <input
            id="address"
            v-model="store.storeAddress"
            type="text"
            class="w-full max-w-sm p-2"
            placeholder="가게 주소"
          />
        </div>

        <!-- 가게 번호 -->
        <div class="flex justify-between items-center border-b py-2">
          <label for="phone" class="text-lg font-extrabold text-gray-700"
            >가게번호</label
          >
          <input
            id="phone"
            v-model="store.phone"
            type="text"
            class="w-full max-w-sm p-2"
            placeholder="010-1234-5678"
          />
        </div>

        <!-- SNS -->
        <div class="flex flex-col border-b py-2">
          <label class="text-lg font-extrabold text-gray-700">SNS</label>
          <div
            v-for="(address, index) in store.snsAddress"
            :key="index"
            class="flex items-center justify-between space-x-2 border-b-2"
          >
            <input
              :id="`sns-${index}`"
              v-model="store.snsAddress[index]"
              type="text"
              class="w-full max-w-sm p-2"
              placeholder="SNS 주소"
            />
            <button
              v-if="store.snsAddress.length > 1"
              type="button"
              class="bg-red-500 text-white text-sm px-2 py-1 rounded"
              @click="removeSnsAddress(index)"
            >
              삭제
            </button>
          </div>
          <button
            type="button"
            class="bg-green-400 text-white px-3 py-1 mt-2 rounded"
            @click="addSnsAddress"
          >
            SNS 추가
          </button>
        </div>

        <!-- 영업시간 -->
        <div class="flex justify-between items-center border-b py-2">
          <label for="startTime" class="text-lg font-extrabold text-gray-700"
            >영업시간</label
          >
          <input
            id="startTime"
            v-model="store.openTime"
            type="time"
            class="w-1/3 p-2"
          />
          <span>~</span>
          <input
            id="endTime"
            v-model="store.closeTime"
            type="time"
            class="w-1/3 p-2"
          />
        </div>
      </div>
      <div class="mt-10">
        <button
          class="w-full h-12 mt-4 bg-orange-400 text-white p-2 rounded-xl"
          type="submit"
        >
          저장
        </button>
      </div>
    </form>
  </section>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { ref, watchEffect } from 'vue';
import { useFetch, useRuntimeConfig } from '#app';

const config = useRuntimeConfig();
const baseUrl = config.public.baseApiUrl;

onBeforeMount(() => {
  route.meta.title = '가게정보수정';
});

definePageMeta({
  layout: 'admin',
});

interface Store {
  storeId: number;
  profilePicture: string;
  storeName: string;
  storeAddress: string;
  snsAddress: string[];
  phone: string;
  openTime: string;
  closeTime: string;
}

// 라우트 설정
const route = useRoute();
const storeId = route.params.storeId;

// 상태 관리
const store = ref<Store>({
  storeId: 0,
  profilePicture: '',
  storeName: '',
  storeAddress: '',
  snsAddress: [],
  phone: '',
  openTime: '',
  closeTime: '',
});

// SNS 관리 로직
const addSnsAddress = () => {
  store.value.snsAddress.push('');
};

const removeSnsAddress = (index: number) => {
  if (store.value.snsAddress.length > 1) {
    store.value.snsAddress.splice(index, 1);
  } else {
    store.value.snsAddress[0] = '';
  }
};

// 데이터 로드 상태
const isDataLoaded = ref(false);

// 데이터 가져오기
const { data, error } = useFetch(`/api/v1/admin/stores/${storeId}/info`, {
  baseURL: baseUrl,
});
watchEffect(() => {
  if (data.value) {
    const fetchData = data.value as Store;
    store.value = {
      ...fetchData,
      profilePicture: `${baseUrl}${fetchData.profilePicture}`,
    };
    isDataLoaded.value = true;
  }
  if (error.value) {
    console.error('데이터 요청 중 오류 발생:', error.value);
    isDataLoaded.value = false;
  }
});

// 이미지 미리보기 로직
const handleImageUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    const file = target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        store.value.profilePicture = reader.result.toString();
      }
    };
    reader.readAsDataURL(file);
  }
};

// 폼 데이터 제출
const openModal = async () => {
  try {
    const formData = new FormData();
    formData.append(
      'dto',
      JSON.stringify({
        storeName: store.value.storeName,
        storeAddress: store.value.storeAddress,
        snsAddress: store.value.snsAddress,
        phone: store.value.phone,
        openTime: store.value.openTime,
        closeTime: store.value.closeTime,
      }),
    );
    const profileImgInput = document.getElementById(
      'profileImg',
    ) as HTMLInputElement;
    if (profileImgInput && profileImgInput.files && profileImgInput.files[0]) {
      formData.append('img', profileImgInput.files[0]);
    }

    const response = await fetch(
      `${baseUrl}/api/v1/admin/stores/${storeId}/info`,
      {
        method: 'PUT',
        body: formData,
      },
    );

    if (response.ok) {
      console.log('데이터가 성공적으로 저장되었습니다.');
    } else {
      console.error('저장 중 오류 발생:', await response.text());
    }
  } catch (err) {
    console.error('폼 제출 중 예외 발생:', err);
  }
};
</script>

<style scoped></style>
