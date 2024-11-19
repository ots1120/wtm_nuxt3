<template>
  <div class="max-w-md mx-auto bg-white shadow-lg rounded-lg p-6 space-y-6">
    <p>사업장 정보</p>
    <div class="space-y-2">
      <div
        class="text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7"
      >
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >사업자등록번호</label
          >
          <input
            v-model="businessNumber"
            type="text"
            placeholder="000-00-00000"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            @input="formatBusinessNumber"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >개업일자</label
          >
          <input
            v-model="businessStartDate"
            type="text"
            placeholder="YYYYMMDD"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            @input="formatBusinessStartDate"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >대표자 성명</label
          >
          <input
            v-model="ownerName"
            type="text"
            placeholder="홍길동"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>
        <div>
          <button
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            @click="validateBusiness"
          >
            사업자 등록 인증
          </button>
        </div>
        <div
          v-if="validationResult"
          class="mt-3 text-center"
          :class="validationResultClass"
        >
          {{ validationResult }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(['verify-business']);

const businessNumber = ref('');
const businessStartDate = ref('');
const ownerName = ref('');
const validationResult = ref('');
const validationResultClass = ref('');

const validateBusiness = async () => {
  const requestBody = {
    businesses: [
      {
        b_no: businessNumber.value.replace(/-/g, ''), // 하이픈 제거
        start_dt: businessStartDate.value,
        p_nm: ownerName.value,
      },
    ],
  };

  try {
    const response = await fetch(
      'https://api.odcloud.kr/api/nts-businessman/v1/validate?serviceKey=ljNbcn8ZAODw7o3nK4GmkZXSlmInBFd2aHzbModVh%2Fnh%2BlmbKgWbymisW54DBrx2oBDbBjJY%2BK%2FK5PI4N%2BxCHw%3D%3D',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      },
    );
    // 응답 코드 확인
    if (!response.ok) {
      validationResult.value = `API 오류로 인증 실패 - 상태 코드: ${response.status}`;
      validationResultClass.value = 'text-red-600';
      emit('verify-business', false); // 인증 실패
      return;
    }

    const data = await response.json();
    const result = data.data[0];

    if (result.valid === '01') {
      validationResult.value = '유효한 사업자입니다.';
      validationResultClass.value = 'text-green-600';
      emit('verify-business', true); // 인증 성공
    } else {
      validationResult.value = '유효하지 않은 사업자입니다.';
      validationResultClass.value = 'text-red-600';
      emit('verify-business', false); // 인증 실패
    }
  } catch (error) {
    validationResult.value = '인증 실패 - 다시 시도해 주세요.';
    validationResultClass.value = 'text-red-600';
    emit('verify-business', false); // 인증 실패
    console.error('Fetch Error:', error);
  }
};

// 사업자등록번호 형식 변환 함수
const formatBusinessNumber = () => {
  // 숫자만 남기기
  businessNumber.value = businessNumber.value.replace(/\D/g, '');

  // 하이픈 추가 형식: 000-00-00000
  if (businessNumber.value.length > 3 && businessNumber.value.length <= 5) {
    businessNumber.value = `${businessNumber.value.slice(0, 3)}-${businessNumber.value.slice(3)}`;
  } else if (businessNumber.value.length > 5) {
    businessNumber.value = `${businessNumber.value.slice(0, 3)}-${businessNumber.value.slice(3, 5)}-${businessNumber.value.slice(5, 10)}`;
  }
};

// 개업일자 형식 변환 함수
const formatBusinessStartDate = () => {
  // 숫자만 남기고 최대 8자리로 제한
  businessStartDate.value = businessStartDate.value
    .replace(/\D/g, '')
    .slice(0, 8);
};
</script>
