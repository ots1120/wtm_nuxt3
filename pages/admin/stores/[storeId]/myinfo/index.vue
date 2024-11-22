<template>
  <div class="min-h-screen">
    <section class="flex overflow-y-auto justify-center px-4 pb-10">
      <form enctype="multipart/form-data" @submit.prevent="openModal">
        <!-- 프로필 사진 -->
        <div class="items-center justify-center text-center border-b pb-4">
          <div
            class="relative w-32 h-32 bg-gray-300 rounded-full mx-auto mt-4 mb-3 flex items-center justify-center"
          >
            <img
              v-if="user.profilePicture"
              :src="user.profilePicture"
              alt="프로필 사진"
              class="w-32 h-32 object-cover rounded-full"
            />
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
              <circle cx="32" cy="18.14" r="11.14" />
              <path
                d="M54.55,56.85A22.55,22.55,0,0,0,32,34.3h0A22.55,22.55,0,0,0,9.45,56.85Z"
              />
            </svg>
          </div>
          <div class="mb-3">
            <label for="profilePicture" class="text-blue-500 cursor-pointer"
              >프로필 사진 수정</label
            >
            <input
              id="profilePicture"
              type="file"
              name="profilePicture"
              class="hidden"
              @change="handleImageChange"
            />
          </div>
        </div>

        <!-- 닉네임 -->
        <div class="pt-4 border-b">
          <label for="name" class="font-extrabold text-lg text-gray-700 block"
            >닉네임</label
          >
          <input
            id="name"
            v-model="user.name"
            type="text"
            class="w-full p-3 mt-2 border rounded-lg"
            placeholder="닉네임"
          />
        </div>

        <!-- 이메일 -->
        <div class="pt-4 border-b">
          <label for="email" class="font-extrabold text-lg text-gray-700 block"
            >이메일</label
          >
          <input
            id="email"
            v-model="user.email"
            type="email"
            class="w-full p-3 mt-2 border rounded-lg"
            placeholder="example@ex.com"
          />
        </div>

        <!-- 비밀번호 -->
        <div class="pt-4 border-b">
          <label
            for="password"
            class="font-extrabold text-lg text-gray-700 block"
            >비밀번호</label
          >
          <input
            id="password"
            v-model="user.password"
            type="password"
            class="w-full p-3 mt-2 border rounded-lg"
            placeholder="비밀번호(9~16자리)"
          />
        </div>

        <!-- 주소 -->
        <div class="pt-4 border-b">
          <label for="" class="font-extrabold text-lg text-gray-700 block"
            >주소</label
          >
          <PostAddressForm
            :postcode="user.userAddress.postcode"
            :address="user.userAddress.address"
            :detail-address="user.userAddress.detailAddress"
            :extra-address="user.userAddress.extraAddress"
            :show-modal="showModal"
            @update-address="updateAddress"
          />
        </div>

        <!-- 휴대폰번호 -->
        <div class="pt-4 border-b">
          <label for="phone" class="font-extrabold text-lg text-gray-700 block"
            >휴대폰번호</label
          >
          <input
            id="phone"
            v-model="user.phone"
            type="tel"
            class="w-full p-3 mt-2 border rounded-lg"
            placeholder="010-1234-1234"
          />
        </div>

        <!-- 완료 버튼 -->
        <button
          type="submit"
          class="w-full bg-blue-500 text-white py-2 rounded-lg text-lg font-medium mt-4"
          onclick="submitForm"
          :disabled="!isPasswordValid"
        >
          완료
        </button>
      </form>
    </section>
    <BasicModal
      v-if="modal.visible"
      :visible="modal.visible"
      :message-title="'정보 수정'"
      :message-body="'가게 정보를 수정하시겠습니까?'"
      :cancel-message="'취소'"
      :confirm-message="'저장'"
      @confirm="confirmSave"
      @cancel="cancelSave"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeMount } from 'vue';
import { useRoute } from 'vue-router';
import PostAddressForm from '~/components/user/PostAddressForm.vue';
import { useAuthStore } from '~/stores/auth'; // AuthStore 경로에 맞게 수정 필요
import BasicModal from '~/components/modal/BasicModal.vue';

interface Address {
  postcode: string;
  address: string;
  detailAddress: string;
  extraAddress: string;
}
// 유저 데이터 타입 정의
interface User {
  email: string;
  name: string;
  password: string;
  userAddress: Address;
  phone: string;
  profilePicture: string | null;
}

// 유저 상태 관리
const user = ref<User>({
  email: '',
  name: '',
  password: '',
  userAddress: {
    postcode: '',
    address: '',
    detailAddress: '',
    extraAddress: '',
  },
  phone: '',
  profilePicture: null,
});

const config = useRuntimeConfig();
const baseUrl = config.public.baseApiUrl;

// 비밀번호 유효성 상태
const isPasswordValid = ref(true);

// 비밀번호 검증 로직
const validatePassword = () => {
  isPasswordValid.value = !!user.value.password; // 비밀번호가 입력되어 있는지 확인
};

// 주소 상태 관리
const showModal = ref(false);

// 프로필 이미지 상태
const profileImage = ref<File | null>(null);

const openModal = () => {
  modal.value.visible = true;
};

// Modal 관리 로직
const modal = ref<{
  visible: boolean;
}>({
  visible: false,
});

const cancelSave = (): void => {
  // Simply hide the modal and reset the state
  modal.value = {
    visible: false,
  };
};

// 유저 정보 업데이트 함수
const userFormData = (data: any) => {
  user.value.name = data.name;
  user.value.userAddress.postcode = ''; // 초기화
  user.value.userAddress.address = '';
  user.value.userAddress.detailAddress = ''; // 초기화
  user.value.userAddress.extraAddress = ''; // 초기화
  user.value.email = data.email;
  user.value.password = data.password;
  user.value.phone = data.phone;
  user.value.profilePicture = data.profilePicture
    ? `${baseUrl}${data.profilePicture}`
    : null;
};

// AuthStore와 라우터 활용
const authstore = useAuthStore();
const username = authstore.user?.username;
const route = useRoute();

// 프로필 이미지 변경 핸들러
const handleImageChange = (event: Event): void => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0] || null;
  profileImage.value = file;

  if (file) {
    // URL.createObjectURL을 사용해 이미지 미리보기 URL 생성
    user.value.profilePicture = URL.createObjectURL(file);
  }
};

// 주소 업데이트 핸들러
const updateAddress = (addressData: {
  postcode: string;
  address: string;
  detailAddress: string;
  extraAddress: string;
}) => {
  console.log(addressData);
  user.value.userAddress.postcode = addressData.postcode || '';
  user.value.userAddress.address = addressData.address || '';
  user.value.userAddress.detailAddress = addressData.detailAddress || '';
  user.value.userAddress.extraAddress = addressData.extraAddress || '';
};

// 폼 제출 핸들러
const confirmSave = async (): Promise<void> => {
  validatePassword(); // 비밀번호 검증
  if (!isPasswordValid.value) {
    alert('비밀번호를 입력해주세요.');
    modal.value.visible = false;

    return; // 검증 실패 시 제출 중단
  }
  try {
    const formData = new FormData();

    formData.append('email', user.value.email);
    formData.append('name', user.value.name);
    formData.append('password', user.value.password);
    formData.append('phone', user.value.phone);

    // userAddress 데이터를 분리해서 추가
    formData.append('userAddress.postcode', user.value.userAddress.postcode);
    formData.append('userAddress.address', user.value.userAddress.address);
    formData.append(
      'userAddress.detailAddress',
      user.value.userAddress.detailAddress,
    );
    formData.append(
      'userAddress.extraAddress',
      user.value.userAddress.extraAddress,
    );

    // 프로필 이미지 추가
    if (profileImage.value) {
      formData.append('profilePicture', profileImage.value); // 파일 추가
    }

    for (const [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }

    // API 요청 (PUT 메서드)
    await useFetch(`/api/v1/user/my/settings`, {
      baseURL: baseUrl,
      method: 'PUT',
      body: formData,
      credentials: 'include',
    });

    // 유저 정보 다시 가져오기
    const { data: updatedData, error: fetchError } = await useFetch<User>(
      `/api/v1/user/my/settings?username=${username}`,
      {
        baseURL: baseUrl,
        credentials: 'include',
      },
    );

    if (fetchError.value) {
      throw new Error('Failed to fetch updated user data');
    }

    if (updatedData.value) {
      modal.value.visible = false;
      userFormData(updatedData.value); // PUT 요청 이후 받은 데이터로 상태 업데이트
      alert('저장 완료');
    }
  } catch (error) {
    console.error('프로필 업데이트에 실패했습니다:', error);
  }
};

// 페이지 로드 시 유저 정보 불러오기
onBeforeMount(async () => {
  route.meta.title = '내 정보 수정'; // 페이지 타이틀 설정
  const { data, error } = await useFetch(
    `/api/v1/user/my/settings?username=${username}`,
    {
      baseURL: baseUrl,
      credentials: 'include',
    },
  );

  if (data.value) {
    userFormData(data.value); // GET 요청 결과로 상태 초기화
    console.log(data.value);
  } else if (error.value) {
    console.error('유저정보를 불러오는 중 실패하였습니다', error.value);
  }
});
</script>

<style scoped>
/* 필요한 경우 스타일 추가 */
</style>
