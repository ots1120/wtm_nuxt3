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
        </div>

        <!-- 재방문 체크박스 -->
        <div class="mt-4 flex items-center border-2 p-2 justify-center">
          <input id="revisit" v-model="revisit" type="checkbox" class="mr-2" />
          <label for="revisit" class="text-sm">재방문 할래요</label>
        </div>

        <!-- 사진 업로드 -->
        <div class="mb-8">
          <h2 class="text-lg font-semibold mb-2">사진 업로드</h2>
          <p class="text-sm text-gray-500 mb-4">
            식당과 메뉴에 관련된 사진을 업로드해주세요.
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
              class="w-20 h-20 flex items-center justify-center border rounded-md cursor-pointer"
            >
              <input
                type="file"
                class="hidden"
                multiple
                @change="onFileChange"
              />
              <span>+</span>
            </label>
          </div>
        </div>

        <!-- 리뷰 작성 -->
        <div class="mb-8">
          <h2 class="text-lg font-semibold mb-2">리뷰 작성</h2>
          <textarea
            v-model="reviewText"
            class="w-full h-32 border rounded-md p-2"
            placeholder="식당과 유저들에게 도움이 되는 따뜻한 리뷰를 작성해주세요 :)"
          ></textarea>
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
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

// 현재 경로에서 storeId 가져오기
const route = useRoute();
const router = useRouter();
const storeId = route.params.storeId;

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
      imageFiles.value.push({ file, preview: e.target.result });
    };
    reader.readAsDataURL(file);
  }
};

// 이미지 제거 함수
const removeImage = (index) => {
  imageFiles.value.splice(index, 1);
};

// 리뷰 제출 함수
const submitReview = async () => {
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
      `http://localhost:8080/api/v1/stores/${storeId}/reviews`,
      {
        method: 'POST',
        body: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      },
    );
    console.log('리뷰가 성공적으로 등록되었습니다.', response);
    await navigateTo(`/stores/${storeId}/reviews`);
  } catch (error) {
    console.error('리뷰 등록 중 오류 발생:', error);
  }
};
</script>

<style scoped>
/* 필요한 경우 스타일 추가 */
</style>
