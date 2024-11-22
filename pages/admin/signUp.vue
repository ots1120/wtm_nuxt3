<template>
  <div class="bg-gray-100 flex flex-col justify-center min-h-screen">
    <div class="relative px-4 bg-white">
      <div class="max-w-md mx-auto">
        <form class="space-y-2" @submit.prevent="submitForm">
          <!-- Email Section -->
          <div
            class="max-w-md mx-auto bg-white shadow-lg rounded-lg p-6 space-y-6"
          >
            <p>관리자 정보</p>
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">
                이메일<span class="pl-0.5 text-red-500">*</span>
              </label>
              <div class="flex space-x-2">
                <input
                  v-model="email"
                  type="email"
                  placeholder="이메일을 입력해주세요"
                  class="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  :class="{ 'border-red-500': emailError }"
                />
                <button
                  type="button"
                  class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                  :class="{
                    'bg-green-500': emailVerified,
                    'text-white': emailVerified,
                  }"
                  @click="checkEmail"
                >
                  중복확인
                </button>
              </div>
              <p
                v-if="emailMessage"
                :class="{
                  'text-green-600': !emailError,
                  'text-red-600': emailError,
                }"
                class="text-xs"
              >
                {{ emailMessage }}
              </p>
            </div>
            <!-- Password Section -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">
                비밀번호<span class="pl-0.5 text-red-500">*</span>
              </label>
              <input
                v-model="password"
                type="password"
                placeholder="비밀번호를 입력해주세요"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div class="space-y-1">
                <div class="flex items-center space-x-2">
                  <div
                    class="h-1 flex-1 rounded-full"
                    :class="passwordStrengthClass"
                  ></div>
                </div>
                <p class="text-sm text-gray-500">
                  {{ passwordStrengthMessage }}
                </p>
              </div>
            </div>
            <!-- Password Confirmation -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">
                비밀번호 확인<span class="pl-0.5 text-red-500">*</span>
              </label>
              <input
                v-model="passwordConfirm"
                type="password"
                placeholder="비밀번호를 다시 입력해주세요"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                :class="{ 'border-red-500': passwordMismatch }"
              />
              <p v-if="passwordMismatch" class="text-xs text-red-600 mt-1">
                비밀번호가 일치하지 않습니다
              </p>
            </div>
          </div>

          <AdminBizValidator @verify-business="handleBusinessVerification" />
          <div
            class="max-w-md mx-auto bg-white shadow-lg rounded-lg p-6 space-y-6"
          >
            <div class="space-y-3">
              <label class="block text-sm font-medium text-gray-700">
                상호명<span class="pl-0.5 text-red-500">*</span>
              </label>
              <div class="flex items-center space-x-2">
                <input
                  v-model="name"
                  type="text"
                  placeholder="관리자명으로 사용될 상호명을 입력해주세요(식당 이름)"
                  class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
              <label class="block text-sm font-medium text-gray-700">
                전화번호<span class="pl-0.5 text-red-500">*</span>
              </label>
              <div class="flex items-center space-x-2">
                <input
                  v-model="phone"
                  type="tel"
                  placeholder="사업장 전화번호를 입력해주세요"
                  class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  @input="formatAndValidatePhone"
                />
              </div>
              <p v-if="phoneError" class="text-xs text-red-600 mt-1">
                전화번호는 하이픈(-) 없이 입력해주세요.
              </p>
            </div>
            <client-only>
              <AdminPostAddressForm
                title="실제 사업장 주소"
                update-address="handleUpdateAddress"
              />
            </client-only>
          </div>
        </form>

        <div class="p-4 bg-white border-t">
          <button
            type="submit"
            class="w-full bg-blue-500 text-white py-3 rounded-md font-medium hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            :disabled="!isBusinessVerified || !isFormValid || isSubmitting"
            @click="submitForm"
          >
            {{ isSubmitting ? '처리 중...' : '가입하기' }}
          </button>
          <!-- Error and Success Messages -->
          <p
            v-if="showErrorMessage"
            class="text-xs text-center text-red-600 mt-2"
          >
            모든 필수 항목을 입력하고 이메일 중복 확인을 완료해주세요.
          </p>
        </div>
        <div
          v-if="showSuccessModal"
          class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <div class="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full">
            <h3 class="text-lg font-medium leading-6 text-gray-900 mb-4">
              회원가입을 축하합니다!
            </h3>
            <p class="text-sm text-gray-500 mb-4">
              성공적으로 가입되었습니다. 로그인 페이지로 이동합니다.
            </p>
            <div class="flex mt-4">
              <button
                type="button"
                class="flex-1 inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                @click="closeSuccessModal"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRuntimeConfig } from 'nuxt/app';
import AdminPostAddressForm from '~/components/admin/AdminPostAddressForm.vue';

const config = useRuntimeConfig();
const baseApiUrl = config.public.baseApiUrl;

definePageMeta({
  title: '사장님 회원가입',
});

const email = ref('');
const password = ref('');
const passwordConfirm = ref('');
const name = ref('');
const phone = ref('');
const postcode = ref('');
const address = ref('');
const detailAddress = ref('');
const extraAddress = ref('');

const emailError = ref(false);
const emailMessage = ref('');
const emailVerified = ref(false);

const showErrorMessage = ref(false);
const phoneError = ref(false);

const isSubmitting = ref(false);
const isBusinessVerified = ref(false);
const showSuccessModal = ref(false);

const handleBusinessVerification = (verified) => {
  isBusinessVerified.value = verified;
};

const passwordMismatch = computed(() => {
  return passwordConfirm.value && password.value !== passwordConfirm.value;
});
// 이메일 값이 변경되면 중복 확인 상태 리셋
watch(email, () => {
  emailVerified.value = false;
  emailError.value = false;
  emailMessage.value = '';
});

// 자식 컴포넌트에서 받은 데이터를 signUpFormData 저장
const handleUpdateAddress = (data) => {
  postcode.value = data.postcode;
  address.value = data.address;
  detailAddress.value = data.detailAddress;
  extraAddress.value = data.extraAddress;
};
// Password strength check
const passwordStrength = computed(() => {
  const pwd = password.value;
  if (!pwd) return 0;
  let strength = 0;
  if (pwd.length >= 8) strength++;
  if (/[A-Z]/.test(pwd)) strength++;
  if (/[0-9]/.test(pwd)) strength++;
  if (/[^A-Za-z0-9]/.test(pwd)) strength++;
  return strength;
});

const passwordStrengthClass = computed(() => {
  switch (passwordStrength.value) {
    case 0:
      return 'bg-gray-200';
    case 1:
      return 'bg-red-500';
    case 2:
      return 'bg-yellow-500';
    case 3:
      return 'bg-blue-500';
    case 4:
      return 'bg-green-500';
    default:
      return 'bg-gray-200';
  }
});

const passwordStrengthMessage = computed(() => {
  switch (passwordStrength.value) {
    case 0:
      return '보안 강도';
    case 1:
      return '매우 약함';
    case 2:
      return '약함';
    case 3:
      return '보통';
    case 4:
      return '강함';
    default:
      return '';
  }
});

const isFormValid = computed(() => {
  return (
    email.value &&
    password.value &&
    passwordConfirm.value &&
    name.value &&
    emailVerified.value &&
    !passwordMismatch.value
  );
});

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const checkEmail = async () => {
  try {
    if (!email.value) {
      emailError.value = true;
      emailMessage.value = '이메일을 입력해주세요.';
      emailVerified.value = false;
      return;
    }

    if (!isValidEmail(email.value)) {
      emailError.value = true;
      emailMessage.value = '올바른 이메일 형식이 아닙니다.';
      emailVerified.value = false;
      return;
    }
    // 서버로 이메일 중복 확인 요청 보내기
    const response = await $fetch(`${baseApiUrl}/api/v1/auth/check-email`, {
      method: 'POST',
      body: {
        email: email.value,
      },
    });
    const isDuplicate = response.duplicate;
    emailError.value = isDuplicate;
    emailMessage.value = isDuplicate
      ? '이미 사용 중인 이메일입니다'
      : '사용 가능한 이메일입니다';
    emailVerified.value = !isDuplicate;
  } catch (error) {
    console.log(error);
    emailError.value = true;
    emailMessage.value =
      '서버와 통신 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
    emailVerified.value = false;
  }
};

const submitForm = async () => {
  // 필수 입력값 검증
  if (isSubmitting.value || !isFormValid.value) {
    // 부족한 정보가 있을 때 showErrorMessage 활성화
    showErrorMessage.value = !isFormValid.value;
    showSuccessMessage.value = false;
    return;
  }

  isSubmitting.value = true; // 요청 시작 시 플래그 설정

  try {
    // 서버로 회원가입 요청 보내기
    await $fetch(`${baseApiUrl}/api/v1/auth/admin/signUp`, {
      method: 'POST',
      body: {
        email: email.value,
        password: password.value,
        name: name.value,
        phone: phone.value,
        address: {
          postcode: postcode.value,
          address: address.value,
          detailAddress: detailAddress.value,
          extraAddress: extraAddress.value,
        },
        role: 'ADMIN',
      },
    });

    // 회원가입 성공 시 메시지 표시
    showSuccessModal.value = true;
    showErrorMessage.value = false;

    // 로그인 페이지로 이동하거나, 메인 페이지로 리디렉션
  } catch (error) {
    if (error.status === 409) {
      emailError.value = true;
      emailMessage.value = '이미 사용 중인 이메일입니다.';
    } else if (error.status === 400) {
      showErrorMessage.value = true;
      emailMessage.value =
        '잘못된 데이터가 포함되어 있습니다. 다시 확인해주세요.';
    } else {
      showErrorMessage.value = true;
      emailMessage.value = '서버와 통신 중 오류가 발생했습니다.';
    }
  } finally {
    isSubmitting.value = false; // 요청 종료 시 플래그 해제
  }
};

const formatAndValidatePhone = () => {
  // 숫자가 아닌 문자 제거
  phone.value = phone.value.replace(/\D/g, '');
};

const closeSuccessModal = () => {
  showSuccessModal.value = false;
  moveToSignIn();
};
const moveToSignIn = async () => {
  await navigateTo('/signIn');
};
</script>
