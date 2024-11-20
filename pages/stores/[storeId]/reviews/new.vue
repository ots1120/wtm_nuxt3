<template>
  <div>
    <section class="flex justify-center">
      <form
        enctype="multipart/form-data"
        class="mt-8 w-96"
        @submit.prevent="submitReview"
      >
        <!-- 리뷰 평가 항목 -->
        <div class="review-category mb-8">
          <h1 class="hidden">리뷰 평가 항목</h1>

          <!-- 맛, 청결도, 분위기, 친절도 별점 입력 -->
          <div
            v-for="(label, key) in ratingLabels"
            :key="key"
            class="flex items-end justify-center mb-4 gap-4"
          >
            <span class="text-lg font-semibold w-20 text-center">{{
              label
            }}</span>
            <div
              class="flex text-yellow-400 w-28"
              @mouseleave="clearHover(key)"
            >
              <input
                v-for="star in 5"
                :id="`${key}-${star}-stars`"
                :key="star"
                v-model="ratings[key]"
                type="radio"
                :name="key"
                :value="star"
                class="hidden"
              />
              <label
                v-for="star in 5"
                :key="star"
                :for="`${key}-${star}-stars`"
                class="cursor-pointer text-gray-300 transition"
                :class="{
                  'text-yellow-400':
                    star <= hoverRatings[key] || star <= ratings[key],
                }"
                @mouseenter="setHover(key, star)"
              >
                &#9733;
              </label>
            </div>
          </div>
          <!-- 별점 에러 메시지 -->
          <p v-if="errors.ratings" class="text-red-500 text-sm">
            {{ errors.ratings }}
          </p>
        </div>

        <!-- 재방문 체크박스 -->
        <div class="mt-4 flex items-center border-2 p-2 justify-center">
          <input id="revisit" v-model="revisit" type="checkbox" class="mr-2" />
          <label for="revisit" class="text-sm">재방문 할래요</label>
        </div>

        <!-- 사진 업로드 -->
        <div class="mb-8">
          <h2 class="text-lg font-semibold mb-2">사진 업로드 (선택 사항)</h2>
          <p class="text-sm text-gray-500 mb-4">
            식당과 메뉴에 관련된 사진을 업로드해주세요. (최대 5장)
          </p>

          <!-- 미리보기 및 삭제 기능 -->
          <div class="flex gap-2 mb-4">
            <div
              v-for="(file, index) in imageFiles"
              :key="index"
              class="relative w-20 h-20"
            >
              <img
                :src="file.preview"
                alt="이미지 미리보기"
                class="w-full h-full object-cover rounded-md"
              />
              <button
                type="button"
                class="absolute top-1 right-1 bg-gray-200 rounded-full p-1"
                @click="removeImage(index)"
              >
                ✕
              </button>
            </div>

            <!-- 이미지 추가 버튼 -->
            <label
              v-if="imageFiles.length < 5"
              class="w-20 h-20 flex items-center justify-center border rounded-md cursor-pointer"
            >
              <input
                type="file"
                class="hidden"
                multiple
                accept="image/*"
                @change="onFileChange"
              />
              <span>+</span>
            </label>
          </div>
          <!-- 이미지 업로드 에러 메시지 -->
          <p v-if="errors.images" class="text-red-500 text-sm">
            {{ errors.images }}
          </p>
        </div>

        <!-- 리뷰 작성 -->
        <div class="mb-8">
          <h2 class="text-lg font-semibold mb-2">리뷰 작성</h2>
          <textarea
            v-model="reviewText"
            class="w-full h-32 border rounded-md p-2"
            :class="{ 'border-red-500': errors.reviewText }"
            placeholder="식당과 유저들에게 도움이 되는 따뜻한 리뷰를 작성해주세요 :)"
            aria-describedby="reviewTextError"
          ></textarea>
          <!-- 리뷰 작성 에러 메시지 -->
          <p
            v-if="errors.reviewText"
            id="reviewTextError"
            class="text-red-500 text-sm"
          >
            {{ errors.reviewText }}
          </p>
        </div>

        <!-- 작성 완료 버튼 -->
        <div class="text-center">
          <button
            type="submit"
            class="w-full bg-orange-400 text-white font-semibold py-3 rounded-md"
          >
            작성 완료
          </button>
        </div>
      </form>
    </section>
  </div>
</template>

<script setup>
import { ref, reactive, onBeforeMount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useNavigationState } from '~/composables/useNavigationState';
import { useAuthStore } from '~/stores/auth'; // Pinia 스토어 임포트

// 현재 경로에서 storeId 가져오기
const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

// Pinia에서 username과 인증 상태 가져오기
const username = computed(() => authStore.user?.username);
const isAuthenticated = computed(() => authStore.isAuthenticated);

const ratings = ref({
  taste: 0,
  cleanliness: 0,
  mood: 0,
  kindness: 0,
});
const hoverRatings = ref({
  taste: 0,
  cleanliness: 0,
  mood: 0,
  kindness: 0,
});
const revisit = ref(false);
const imageFiles = ref([]);
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

const { getState } = useNavigationState();

// 에러 메시지 초기화
const errors = reactive({
  ratings: '',
  images: '',
  reviewText: '',
});

// 별점 호버 설정 및 초기화
const setHover = (key, star) => {
  hoverRatings.value[key] = star;
};
const clearHover = (key) => {
  hoverRatings.value[key] = 0;
};

// 파일 선택 시 미리보기 추가
const onFileChange = (event) => {
  const files = event.target.files;
  const maxSize = 5 * 1024 * 1024;

  for (const file of files) {
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
      if (imageFiles.value.length < 5) {
        imageFiles.value.push({ file, preview: e.target.result });
        // 이미지 관련 에러가 있으면 제거
        errors.images = '';
      }
    };
    reader.readAsDataURL(file);
  }
};

// 이미지 제거 함수
const removeImage = (index) => {
  imageFiles.value.splice(index, 1);
  // 이미지 관련 에러가 있으면 제거 (이미지 업로드가 선택 사항이므로 필요 없음)
  // 하지만 업로드된 이미지가 최대 갯수를 초과했을 때 다시 추가 가능하도록 유지
};

// 유효성 검사 함수
const validateForm = () => {
  let isValid = true;

  // 에러 초기화
  errors.ratings = '';
  errors.images = '';
  errors.reviewText = '';

  // 별점 유효성 검사
  for (const key in ratings.value) {
    if (ratings.value[key] < 1) {
      errors.ratings = '모든 항목에 대해 최소 1점 이상의 별점을 선택해주세요.';
      isValid = false;
      break;
    }
  }

  // 이미지 유효성 검사 (선택 사항)
  // 업로드된 이미지가 있을 경우 크기와 형식은 이미 onFileChange에서 검사하였으므로 추가 검사 필요 없음
  // 단, 추가적인 조건이 필요하다면 여기서 추가할 수 있습니다.

  // 리뷰 텍스트 유효성 검사
  if (!reviewText.value.trim()) {
    errors.reviewText = '리뷰 내용을 입력해주세요.';
    isValid = false;
  } else if (reviewText.value.trim().length < 10) {
    // 최소 10자 이상
    errors.reviewText = '리뷰는 최소 10자 이상이어야 합니다.';
    isValid = false;
  }

  return isValid;
};

// 리뷰 제출 함수
const submitReview = async () => {
  const storeId = getState('storeId'); // 타입 단언 필요
  const ticketHistoryUsageId = getState('ticketHistoryUsageId'); // 타입 단언 필요

  console.log('storeId:', storeId); // 123
  console.log('ticketHistoryUsageId:', ticketHistoryUsageId);
  if (!validateForm()) {
    // 첫 번째 에러로 스크롤 (선택 사항)
    const firstError = document.querySelector('.text-red-500');
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
      `http://localhost:8080/api/v1/stores/${storeId}/ticketHistoryUsage/${ticketHistoryUsageId}/reviews`,
      {
        method: 'POST',
        body: formData,
        headers: {
          'X-Username': username.value, // Pinia에서 가져온 username을 헤더에 추가
        },
      },
    );
    console.log('리뷰가 성공적으로 등록되었습니다.', response);
    await router.push(`/stores/${storeId}/reviews`);
  } catch (error) {
    console.error('리뷰 등록 중 오류 발생:', error.response || error.message);
    // 선택적으로 서버 측 유효성 검사 오류를 처리할 수 있습니다.
  }
};

// 페이지 메타데이터 설정
onBeforeMount(() => {
  route.meta.title = '리뷰 작성';
});
</script>

<style scoped>
/* 필요한 경우 스타일 추가 */
.text-red-500 {
  color: #f56565;
}
</style>
