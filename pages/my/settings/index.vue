<template>
  <div>
    <section class="flex justify-center">
      <!-- 파일 업로드 시, 멀티 일반은 application/json -->
      <form @submit.prevent="onSubmitForm" enctype="multipart/form-data">
        <div class="items-center justify-center text-center border-b">
          <svg
            width="120px"
            height="120px"
            viewBox="0 0 64 64"
            xmlns="http://www.w3.org/2000/svg"
            stroke-width="3"
            stroke="#000000"
            fill="none"
            class="block stroke-white bg-gray-300 rounded-full mx-auto mt-4 mb-3"
          >
            <g id="SVGRepo_bgCarrier" stroke-width="0" />
            <g
              id="SVGRepo_tracerCarrier"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <g id="SVGRepo_iconCarrier">
              <circle cx="32" cy="18.14" r="11.14" />
              <path
                d="M54.55,56.85A22.55,22.55,0,0,0,32,34.3h0A22.55,22.55,0,0,0,9.45,56.85Z"
              />
            </g>
          </svg>
          <div class="mb-3">
            <label
              for="profilePicture"
              class="text-blue-500"
              style="cursor: pointer"
              >프로필 사진 수정</label
            >
            <input
              type="file"
              id="profilePicture"
              name="profilePicture"
              class="hidden"
              @change="handleImageChange"
            />
          </div>
        </div>
        <div>
          <div class="grid grid-cols-2 gap-4 py-2 border-b" v-for="field in fields" :key="field.id">
            <label
              :for="field.id"
              class="font-extrabold text-lg text-gray-700 content-center"
              >{{ field.label }}</label
            >
            <input
              :type="field.type"
              :id="field.id"
              v-model="user[field.id as keyof User]"
              class="w-full max-w-sm p-2"
              :placeholder="field.placeholder"
            />
          </div>
        </div>
        <button type="submit" class="text-blue-500 mt-4">완료</button>
      </form>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

// 타입 정의
interface Field {
  id: string;
  label: string;
  type: string;
  placeholder: string;
}

interface User {
  email: string;
  name: string;
  password: string;
  address: string;
  phone: string;
  profilePicture: File | null;
}

const user = ref<User>({
  email: '',
  name: '',
  password: '',
  address: '',
  phone: '',
  profilePicture: null
});


const fields: Field[] = [
  { id: 'name', label: '닉네임', type: 'text', placeholder: '닉네임' },
  { id: 'email', label: '이메일', type: 'email', placeholder: 'example@ex.com' },
  { id: 'password', label: '비밀번호', type: 'password', placeholder: '비밀번호(9~16자리)' },
  { id: 'address', label: '주소', type: 'text', placeholder: '주소 입력' },
  { id: 'phone', label: '휴대폰번호', type: 'tel', placeholder: '010-1234-1234' }
];

const profileImage = ref<File | null>(null);

// 메서드 정의
const handleImageChange = (event: Event): void => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0] || null;
  profileImage.value = file;
};

// useFetch로 사용자 정보 가져오기
const userId = '1';
const { data, error } = await useFetch(`http://localhost:8080/api/v1/user/my/settings?userId=${userId}`);

if (data.value) {
  Object.assign(user.value, data.value);
} else if (error.value) {
  console.error('유저정보를 불러오는 중 실패하였습니다', error.value);
}

const onSubmitForm = async (): Promise<void> => {
  try {
    const formData = new FormData();
    Object.entries(user.value).forEach(([key, value]) => {
      if (key === 'profilePicture' && value instanceof File) {
        formData.append(key, value);
      } else if (key !== 'profilePicture') {
        formData.append(key, value as string);
      }
    });

    if (profileImage.value) {
      formData.append('profilePicture', profileImage.value);
    }

    await useFetch(`http://localhost:8080/api/v1/user/my/settings?userId=${userId}`, {
      method: 'PUT',
      body: formData,
      
    });

    // 유저정보다시불러오기
    const { data: updatedData, error: fetchError } = await useFetch<User>(`http://localhost:8080/api/v1/user/my/settings/${userId}`);
    if (fetchError.value) {
      throw new Error('Failed to fetch updated user data');
    }
    if (updatedData.value) {
      Object.assign(user.value, updatedData.value);
    }
  } catch (error) {
    console.error('프로필 업데이트에 실패했습니다:', error);
  }
};
</script>

<style scoped>
/* 필요한 경우 추가 스타일링 */
</style>
