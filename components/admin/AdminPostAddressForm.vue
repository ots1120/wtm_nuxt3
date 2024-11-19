<template>
  <div class="space-y-2">
    <label :class="titleClass"
      >{{ title }}<span class="pl-0.5 text-red-500">*</span></label
    >
    <div class="flex space-x-2">
      <input
        v-model="postcode"
        type="text"
        placeholder="우편번호"
        class="w-1/3 px-4 py-3 border border-gray-300 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        readonly
      />
      <button
        type="button"
        class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
        @click="execDaumPostcode"
      >
        우편번호 찾기
      </button>
    </div>
    <input
      v-model="address"
      type="text"
      placeholder="주소"
      class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
      readonly
    />
    <input
      v-model="detailAddress"
      type="text"
      placeholder="상세주소"
      class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
    />
    <input
      v-model="extraAddress"
      type="text"
      placeholder="참고항목"
      class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
      readonly
    />
    <!-- 모달 창 -->
    <div
      v-if="showModal"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10"
      @click.self="closeDaumPostcode"
    >
      <div
        class="bg-white p-4 rounded shadow-lg relative w-11/12 md:w-1/2 lg:w-1/3"
      >
        <!-- Daum 우편번호 API가 여기에 삽입됩니다 -->
        <div
          ref="daumPostcodeContainer"
          style="width: 100%; height: 500px"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue';

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  titleClass: {
    type: String,
    default: 'block text-sm font-medium text-gray-700', // 기본 스타일
  },
  addressData: {
    type: Object,
    required: true,
  },
});

// 내부 상태 초기화
const postcode = ref(props.addressData?.postcode || '');
const address = ref(props.addressData?.address || '');
const detailAddress = ref(props.addressData?.detailAddress || '');
const extraAddress = ref(props.addressData?.extraAddress || '');
const showModal = ref(false);
const daumPostcodeContainer = ref(null);

const emit = defineEmits(['updateAddress']);

// 값이 변경될 때마다 부모에게 알림
const emitAddressData = () => {
  emit('updateAddress', {
    postcode: postcode.value,
    address: address.value,
    detailAddress: detailAddress.value,
    extraAddress: extraAddress.value,
  });
};

// Props 값이 변경되었을 때 내부 상태 업데이트
watch(
  () => props.addressData,
  (newAddressData) => {
    postcode.value = newAddressData?.postcode || '';
    address.value = newAddressData?.address || '';
    detailAddress.value = newAddressData?.detailAddress || '';
    extraAddress.value = newAddressData?.extraAddress || '';
  },
  { immediate: true }, // 컴포넌트 초기화 시에도 실행
);

// 특정 값이 변경되면 emitAddressData 호출
watch([postcode, address, detailAddress, extraAddress], emitAddressData);

useHead({
  script: [
    {
      src: '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js',
      async: true,
    },
  ],
});

const closeDaumPostcode = () => {
  showModal.value = false;
};

const execDaumPostcode = () => {
  showModal.value = true;

  nextTick(() => {
    new window.daum.Postcode({
      oncomplete: (data) => {
        let addr = '';
        let extraAddr = '';

        if (data.userSelectedType === 'R') {
          addr = data.roadAddress;
        } else {
          addr = data.jibunAddress;
        }

        if (data.userSelectedType === 'R') {
          if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
            extraAddr += data.bname;
          }
          if (data.buildingName !== '' && data.apartment === 'Y') {
            extraAddr +=
              extraAddr !== '' ? ', ' + data.buildingName : data.buildingName;
          }
          if (extraAddr !== '') {
            extraAddr = ' (' + extraAddr + ')';
          }
          extraAddress.value = extraAddr;
        } else {
          extraAddress.value = '';
        }

        postcode.value = data.zonecode;
        address.value = addr;
        detailAddress.value = '';

        closeDaumPostcode();
      },
      width: '100%',
      height: '100%',
    }).embed(daumPostcodeContainer.value);
  });
};
</script>

<style scoped></style>
