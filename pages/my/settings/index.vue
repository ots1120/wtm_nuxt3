<template>
  <div>
    <section class="flex justify-center">
      <!-- 파일 업로드 시, 멀티 일반은 application/json -->
      <form @submit.prevent="onSubmitForm" enctype="multipart/form-data">
        <div class="items-center justify-center text-center border-b">
          
          <!-- 프로필 사진 미리보기 -->
          <div class="relative w-32 h-32 bg-gray-300 rounded-full mx-auto mt-4 mb-3 flex items-center justify-center">
            <!-- 프로필 사진이 있는 경우 보여줌 -->
            <img
              v-if="user.profilePicture"
              :src="user.profilePicture"
              alt="프로필 사진"
              class="w-32 h-32 object-cover rounded-full"
            /> 
            <!-- 프로필 사진이 없는 경우 SVG 아이콘을 보여줌 -->
            <svg
              v-else
              width="120px"
              height="120px"
              viewBox="0 0 64 64"
              xmlns="http://www.w3.org/2000/svg"
              stroke-width="3"
              stroke="#000000"
              fill="none"
              class="block stroke-white rounded-full"
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
          </div>

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

        <!-- 사용자 정보 입력 필드 -->
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
import { ref } from 'vue';

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
  profilePicture: string;
}

const user = ref<User>({
  email: '',
  name: '',
  password: '',
  address: '',
  phone: '',
  profilePicture: '',
});

const fields: Field[] = [
  { id: 'name', label: '닉네임', type: 'text', placeholder: '닉네임' },
  { id: 'email', label: '이메일', type: 'email', placeholder: 'example@ex.com' },
  { id: 'password', label: '비밀번호', type: 'password', placeholder: '비밀번호(9~16자리)' },
  { id: 'address', label: '주소', type: 'text', placeholder: '주소 입력' },
  { id: 'phone', label: '휴대폰번호', type: 'tel', placeholder: '010-1234-1234' }
];

const profileImage = ref<File | null>(null);

// 유저 정보 업데이트 함수
const userFormData = (data: any) => {
  user.value.name = data.name;
  user.value.address = data.address;
  user.value.email = data.email;
  user.value.password = data.password;
  user.value.phone = data.phone;
  user.value.profilePicture = `http://localhost:8080${data.profilePicture}`;
};

// useFetch로 사용자 정보 가져오기
const userId = '1';
const { data, error } = await useFetch(`http://localhost:8080/api/v1/user/my/settings?userId=${userId}`);

if (data.value) {
  userFormData(data.value);  // 첫 번째 GET 요청 결과 적용
} else if (error.value) {
  console.error('유저정보를 불러오는 중 실패하였습니다', error.value);
}

const handleImageChange = (event: Event): void => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0] || null;
  profileImage.value = file;

  // 파일 객체 대신 URL을 user.profilePicture에 저장
  if (file) {
    user.value.profilePicture = URL.createObjectURL(file);
  }
};

const onSubmitForm = async (): Promise<void> => {
  try {
    const formData = new FormData();
    Object.entries(user.value).forEach(([key, value]) => {
      if (key === 'profilePicture' && profileImage.value) {
        formData.append(key, profileImage.value);  // File 객체로 추가
      } else if (key !== 'profilePicture') {
        formData.append(key, value as string);
      }
    });

    await useFetch(`http://localhost:8080/api/v1/user/my/settings?userId=${userId}`, {
      method: 'PUT',
      body: formData,
    });

    // 유저 정보 다시 불러오기
    const { data: updatedData, error: fetchError } = await useFetch<User>(`http://localhost:8080/api/v1/user/my/settings?userId=${userId}`);
    if (fetchError.value) {
      throw new Error('Failed to fetch updated user data');
    }
    if (updatedData.value) {
      userFormData(updatedData.value);  // PUT 이후 GET 결과 적용
    }
  } catch (error) {
    console.error('프로필 업데이트에 실패했습니다:', error);
  }
};
</script>


<style scoped>
/* 필요한 경우 추가 스타일링 */
</style>
