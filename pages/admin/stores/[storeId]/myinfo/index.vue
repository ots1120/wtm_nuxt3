<template>
  <section class="flex justify-center mt-4 px-4">
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
          class="w-28 h-28 rounded-full border overflow-hidden flex items-center justify-center"
        >
          <img
            v-if="isDataLoaded"
            :src="store.profilePicture"
            alt="Profile Image"
            class="w-full h-full object-cover"
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
        <label for="nickname" class="text-lg font-extrabold text-gray-700 mt-2"
          >가게이름</label
        >
        <div class="flex justify-between items-center border-b py-2">
          <input
            id="nickname"
            v-model="store.storeName"
            type="text"
            class="w-full max-w-sm p-2"
            placeholder="가게이름"
          />
        </div>

        <!-- 가게 주소 -->
        <div class="flex justify-between mt-2 items-center border-b py-2">
          <AdminPostAddressForm
            title="실제 사업장 주소"
            :title-class="'text-lg font-extrabold text-gray-700'"
            :address-data="store.storeAddress"
            @update-address="updateStoreAddress"
          />
        </div>

        <!-- 가게 번호 -->
        <label for="phone" class="text-lg mt-2 font-extrabold text-gray-700"
          >가게번호</label
        >
        <div class="flex justify-between items-center border-b py-2">
          <input
            id="phone"
            v-model="store.phone"
            type="text"
            class="w-full max-w-sm p-2"
            placeholder="010-1234-5678"
          />
        </div>

        <!-- SNS -->
        <div class="flex flex-col border-b py-2 mt-2">
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
              class="w-3/4 max-w-sm p-2"
              placeholder="SNS 주소"
            />
            <button
              v-if="store.snsAddress.length > 1"
              type="button"
              class="bg-[#db3d39] text-white text-sm px-2 py-1 rounded"
              @click="removeSnsAddress(index)"
            >
              삭제
            </button>
          </div>
          <button
            type="button"
            class="bg-blue-600 text-white px-3 py-1 mt-2 rounded-lg"
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
      <div class="mt-2 mb-24">
        <button
          class="w-full h-12 mt-4 bg-[#db3d39] text-white p-2 rounded-xl"
          type="submit"
          @click="openModal"
        >
          저장
        </button>
      </div>
    </form>
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
  </section>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { ref, onMounted } from 'vue';
import { useRuntimeConfig } from '#app';
import AdminPostAddressForm from '~/components/admin/AdminPostAddressForm.vue';
import BasicModal from '~/components/modal/BasicModal.vue';

onBeforeMount(() => {
  route.meta.title = '정보수정';
});

definePageMeta({
  layout: 'admin',
});

const config = useRuntimeConfig();
const baseUrl = config.public.baseApiUrl;

// 라우트 설정
const route = useRoute();
const storeId = route.params.storeId;

// 상태 관리
interface Address {
  postcode: string;
  address: string;
  detailAddress: string;
  extraAddress: string;
}

interface Store {
  storeId: number;
  profilePicture: string;
  storeName: string;
  storeAddress: Address;
  snsAddress: string[];
  phone: string;
  openTime: string;
  closeTime: string;
}

const store = ref<Store>({
  storeId: 0,
  profilePicture: '',
  storeName: '',
  storeAddress: {
    postcode: '',
    address: '',
    detailAddress: '',
    extraAddress: '',
  },
  snsAddress: [],
  phone: '',
  openTime: '',
  closeTime: '',
});

// 데이터 로드 상태
const isDataLoaded = ref(false);

// 데이터 가져오기
const fetchStoreData = async () => {
  try {
    const response = await fetch(
      `${baseUrl}/api/v1/admin/stores/${storeId}/info`,
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const fetchData: Store = await response.json();
    store.value = {
      ...fetchData,
      profilePicture: `${baseUrl}${fetchData.profilePicture}`,
      storeAddress: fetchData.storeAddress || {
        // storeAddress가 없는 경우 기본값 설정
        postcode: '',
        address: '',
        detailAddress: '',
        extraAddress: '',
      },
    };
    isDataLoaded.value = true;
    console.log(store.value.storeAddress);
  } catch (error) {
    console.error('데이터 요청 중 오류 발생:', error);
    isDataLoaded.value = false;
  }
};

// 컴포넌트가 마운트되었을 때 데이터 로드
onMounted(() => {
  fetchStoreData();
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

// 다음 주소 API
const updateStoreAddress = (addressData: {
  postcode: string;
  address: string;
  detailAddress: string;
  extraAddress: string;
}) => {
  store.value.storeAddress = {
    postcode: addressData.postcode || '',
    address: addressData.address || '',
    detailAddress: addressData.detailAddress || '',
    extraAddress: addressData.extraAddress || '',
  };
};

// Modal 관리 로직
const modal = ref<{
  visible: boolean;
  reviewIndex: number | null;
  commentIndex: number | null;
  reviewId: number | null;
  commentId: number | null;
}>({
  visible: false,
  reviewIndex: null,
  commentIndex: null,
  reviewId: null,
  commentId: null,
});

const openModal = () => {
  modal.value.visible = true;
};

const confirmSave = async () => {
  try {
    const formatTime = (time: string) => {
      // 초 단위를 제거하고 HH:mm 형식으로 변환
      const [hours, minutes] = time.split(':');
      return `${hours}:${minutes}`;
    };
    const formData = new FormData();
    formData.append(
      'dto',
      JSON.stringify({
        storeName: store.value.storeName,
        postcode: store.value.storeAddress.postcode,
        address: store.value.storeAddress.address,
        detailAddress: store.value.storeAddress.detailAddress,
        extraAddress: store.value.storeAddress.extraAddress,
        snsAddress: store.value.snsAddress,
        phone: store.value.phone,
        openTime: formatTime(store.value.openTime),
        closeTime: formatTime(store.value.closeTime),
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
      console.log(store.value.storeAddress);
      console.log('데이터가 성공적으로 저장되었습니다.');
      modal.value.visible = false;
      alert('저장 완료');
    } else {
      console.error('저장 중 오류 발생:', await response.text());
    }
  } catch (err) {
    console.error('폼 제출 중 예외 발생:', err);
  }
};

const cancelSave = (): void => {
  // Simply hide the modal and reset the state
  modal.value = {
    visible: false,
    reviewIndex: null,
    commentIndex: null,
    reviewId: null,
    commentId: null,
  };
};
</script>

<style scoped></style>
