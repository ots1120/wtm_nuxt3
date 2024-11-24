<template>
  <div class="min-h-screen">
    <section class="flex overflow-y-auto justify-center px-4 pb-10">
      <form enctype="multipart/form-data" @submit.prevent="openModal">
        <!-- 프로필 사진 -->
        <div class="items-center justify-center text-center border-b pb-4">
          <div
            class="relative w-32 h-32 rounded-full mx-auto mt-4 mb-3 flex items-center justify-center"
          >
            <img
              v-if="user.profilePicture"
              :src="user.profilePicture"
              alt="프로필 사진"
              class="w-32 h-32 object-cover rounded-full"
            />
            <!-- 기본 SVG 이미지를 표시 -->
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              class="h-32 w-32 text-gray-400"
              viewBox="0 0 16 16"
            >
              <path
                fill="#BDBDBD"
                d="M8 16A8 8 0 1 1 8 0a8 8 0 0 1 0 16m.847-8.145a2.502 2.502 0 1 0-1.694 0C5.471 8.261 4 9.775 4 11c0 .395.145.995 1 .995h6c.855 0 1-.6 1-.995c0-1.224-1.47-2.74-3.153-3.145"
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
          <PostAddressForm
            :postcode="user.userAddress.postcode"
            :address="user.userAddress.address"
            :detail-address="user.userAddress.detailAddress"
            :extra-address="user.userAddress.extraAddress"
            :show-modal="showModal"
            title-class="font-extrabold text-lg text-gray-700 block"
            @update-address="updateUserAddress"
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
          :disabled="!isPasswordValid"
          @click="openModal"
        >
          완료
        </button>
      </form>
    </section>
    <BasicModal
      v-if="modal.visible"
      :visible="modal.visible"
      :message-title="'정보 수정'"
      :message-body="'내 정보를 수정하시겠습니까?'"
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

const config = useRuntimeConfig();
const baseUrl = config.public.baseApiUrl;
const isDataLoaded = ref(false);
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

// AuthStore와 라우터 활용
const authstore = useAuthStore();
const username = authstore.user?.username;
const route = useRoute();
const router = useRouter(); // 라우터

// 프로필 이미지 변경 핸들러
const handleImageChange = (event: Event): void => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0] || null;
  profileImage.value = file;

  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      user.value.profilePicture = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
};

// 주소 업데이트 핸들러
const updateUserAddress = (addressData: {
  postcode: string;
  address: string;
  detailAddress: string;
  extraAddress: string;
}) => {
  user.value.userAddress = {
    postcode: addressData.postcode || '',
    address: addressData.address || '',
    detailAddress: addressData.detailAddress || '',
    extraAddress: addressData.extraAddress || '',
  };
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
    const dto = {
      email: user.value.email,
      name: user.value.name,
      password: user.value.password,
      phone: user.value.phone,
      userAddress: {
        postcode: user.value.userAddress.postcode,
        address: user.value.userAddress.address,
        detailAddress: user.value.userAddress.detailAddress,
        extraAddress: user.value.userAddress.extraAddress,
      },
    };
    const formData = new FormData();
    formData.append('dto', JSON.stringify(dto));

    // 프로필 이미지 추가
    if (profileImage.value) {
      formData.append('profilePicture', profileImage.value);
    }

    const response = await fetch(`${baseUrl}/api/v1/user/my/settings`, {
      method: 'PUT',
      body: formData,
      credentials: 'include',
    });

    if (response.ok) {
      console.log('데이터가 성공적으로 저장되었습니다.');
      modal.value.visible = false;
      fetchUserData();
    } else {
      console.error('저장 중 오류 발생:', await response.text());
    }
  } catch (err) {
    console.error('폼 제출 중 예외 발생:', err);
  }
};

const fetchUserData = async () => {
  try {
    const response = await fetch(
      `${baseUrl}/api/v1/user/my/settings?username=${username}`,
      {
        credentials: 'include',
      },
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const fetchData: User = await response.json();
    user.value = {
      ...fetchData,
      userAddress: fetchData.userAddress || {
        // userAddress가 없는 경우 기본값 설정
        postcode: '',
        address: '',
        detailAddress: '',
        extraAddress: '',
      },
      profilePicture: fetchData.profilePicture
        ? `${baseUrl}${fetchData.profilePicture}`
        : null,
    };
    isDataLoaded.value = true;
  } catch (error) {
    console.error('데이터 요청 중 오류 발생:', error);
    isDataLoaded.value = false;
  }
};

// 페이지 로드 시 유저 정보 불러오기
onBeforeMount(async () => {
  route.meta.title = '내 정보 수정'; // 페이지 타이틀 설정
  fetchUserData();
});
</script>

<style scoped>
/* 필요한 경우 스타일 추가 */
</style>
