<template>
  <div class="min-h-screen bg-gray-100">
    <div class="max-w-md mx-auto bg-white shadow-lg overflow-hidden">
      <div class="p-6">
        <form enctype="multipart/form-data" @submit.prevent="submitReview">
          <!-- Rating Section -->
          <div class="mb-6">
            <h2 class="text-lg font-semibold mb-4">평가</h2>
            <div v-for="(label, key) in ratingLabels" :key="key" class="mb-4">
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-gray-700">{{
                  label
                }}</span>
                <div class="flex text-yellow-400">
                  <template v-for="star in 5" :key="star">
                    <input
                      :id="`${key}-${star}-stars`"
                      v-model="ratings[key]"
                      type="radio"
                      :name="key"
                      :value="star"
                      class="hidden"
                    />
                    <label
                      :for="`${key}-${star}-stars`"
                      class="cursor-pointer text-gray-300 transition"
                      :class="{ 'text-yellow-400': star <= ratings[key] }"
                    >
                      &#9733;
                    </label>
                  </template>
                </div>
              </div>
            </div>
            <p v-if="errors.ratings" class="mt-2 text-sm text-red-600">
              {{ errors.ratings }}
            </p>
          </div>

          <!-- Revisit Checkbox -->
          <div class="mb-6">
            <label class="flex items-center">
              <input
                v-model="revisit"
                type="checkbox"
                class="form-checkbox h-5 w-5 text-blue-600"
              />
              <span class="ml-2 text-sm text-gray-700">재방문 할래요</span>
            </label>
          </div>

          <!-- Image Upload -->
          <div class="mb-6">
            <h2 class="text-lg font-semibold mb-2">사진 업로드 (선택 사항)</h2>
            <p class="text-sm text-gray-500 mb-4">
              식당과 메뉴에 관련된 사진을 업로드해주세요. (최대 5장)
            </p>
            <div class="relative">
              <div
                v-if="imageFiles.length > 0"
                class="w-full h-48 bg-gray-200 rounded-lg overflow-hidden mb-2"
              >
                <img
                  :src="imageFiles[currentImageIndex].preview"
                  alt="Preview"
                  class="w-full h-full object-contain"
                />
              </div>
              <div
                v-else
                class="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center mb-2"
              >
                <p class="text-gray-500">이미지를 업로드해주세요</p>
              </div>
              <button
                v-if="imageFiles.length > 1"
                type="button"
                class="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md"
                @click="prevImage"
              >
                <svg
                  class="w-6 h-6 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button
                v-if="imageFiles.length > 1"
                type="button"
                class="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md"
                @click="nextImage"
              >
                <svg
                  class="w-6 h-6 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
            <div class="flex justify-between items-center">
              <p class="text-sm text-gray-500">
                {{ imageFiles.length }}/5 이미지
              </p>
              <label
                v-if="imageFiles.length < 5"
                class="cursor-pointer bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition-colors"
              >
                추가
                <input
                  type="file"
                  class="hidden"
                  multiple
                  accept="image/*"
                  @change="onFileChange"
                />
              </label>
            </div>
            <p v-if="errors.images" class="mt-2 text-sm text-red-600">
              {{ errors.images }}
            </p>
          </div>

          <!-- Review Text -->
          <div class="mb-6">
            <h2 class="text-lg font-semibold mb-2">리뷰 내용</h2>
            <textarea
              v-model="reviewText"
              class="w-full h-32 px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="식당과 유저들에게 도움이 되는 따뜻한 리뷰를 작성해주세요 :)"
            ></textarea>
            <p v-if="errors.reviewText" class="mt-2 text-sm text-red-600">
              {{ errors.reviewText }}
            </p>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            class="w-full bg-[#db3d39] text-white py-2 px-4 rounded-lg hover:bg-[#c22420] transition-colors"
          >
            작성 완료
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { useRoute, useRouter } from '#app';
import { useNavigationState } from '~/composables/useNavigationState';
import { useAuthStore } from '~/stores/auth';

const config = useRuntimeConfig();
const baseUrl = config.public.baseApiUrl;

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const { getState } = useNavigationState();

const username = computed(() => authStore.user?.username);
const isAuthenticated = computed(() => authStore.isAuthenticated);

const ratings = ref({
  taste: 0,
  cleanliness: 0,
  mood: 0,
  kindness: 0,
});
const revisit = ref(false);
const imageFiles = ref([]);
const currentImageIndex = ref(0);
const reviewText = ref('');
const ratingLabels = {
  taste: '맛',
  cleanliness: '청결도',
  mood: '분위기',
  kindness: '친절도',
};
const ratingIds = {
  taste: 1,
  cleanliness: 2,
  mood: 3,
  kindness: 4,
};

const errors = reactive({
  ratings: '',
  images: '',
  reviewText: '',
});

const onFileChange = (event) => {
  const files = event.target.files;
  const maxSize = 5 * 1024 * 1024;

  for (const file of files) {
    if (imageFiles.value.length >= 5) break;

    if (file.size > maxSize) {
      alert(`${file.name} 파일은 5MB를 초과합니다.`);
      continue;
    }
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      alert(`${file.name} 파일 형식이 허용되지 않습니다.`);
      continue;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      imageFiles.value.push({ file, preview: e.target.result });
    };
    reader.readAsDataURL(file);
  }
};

const prevImage = () => {
  currentImageIndex.value =
    (currentImageIndex.value - 1 + imageFiles.value.length) %
    imageFiles.value.length;
};

const nextImage = () => {
  currentImageIndex.value =
    (currentImageIndex.value + 1) % imageFiles.value.length;
};

const validateForm = () => {
  let isValid = true;

  errors.ratings = '';
  errors.reviewText = '';

  for (const key in ratings.value) {
    if (ratings.value[key] < 1) {
      errors.ratings = '모든 항목에 대해 최소 1점 이상의 별점을 선택해주세요.';
      isValid = false;
      break;
    }
  }

  if (!reviewText.value.trim()) {
    errors.reviewText = '리뷰 내용을 입력해주세요.';
    isValid = false;
  } else if (reviewText.value.trim().length < 10) {
    errors.reviewText = '리뷰는 최소 10자 이상이어야 합니다.';
    isValid = false;
  }

  return isValid;
};

const submitReview = async () => {
  const storeId = getState('storeId');
  const ticketHistoryUsageId = getState('ticketHistoryUsageId');

  if (!validateForm()) {
    const firstError = document.querySelector('.text-red-600');
    if (firstError) {
      firstError.scrollIntoView({ behavior: 'smooth' });
    }
    return;
  }

  const formData = new FormData();
  formData.append('revisit', revisit.value);
  formData.append('reviewContent', reviewText.value);

  const scores = Object.entries(ratings.value).map(([category, score]) => ({
    reviewScaleId: ratingIds[category],
    reviewScore: score,
  }));
  formData.append('reviewScoresDtos', JSON.stringify(scores));

  imageFiles.value.forEach(({ file }) => {
    formData.append('files', file);
  });

  try {
    const response = await $fetch(
      `${baseUrl}/api/v1/stores/${storeId}/ticketHistoryUsage/${ticketHistoryUsageId}/reviews`,
      {
        method: 'POST',
        body: formData,
        headers: {
          'X-Username': username.value,
        },
        credentials: 'include',
      },
    );
    console.log('리뷰가 성공적으로 등록되었습니다.', response);
    await router.push(`/stores/${storeId}/reviews`);
  } catch (error) {
    console.error('리뷰 등록 중 오류 발생:', error.response || error.message);
    alert('리뷰 등록 중 오류가 발생했습니다. 다시 시도해주세요.');
  }
};
</script>
