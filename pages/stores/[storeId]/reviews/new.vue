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
          <input
            type="file"
            class="w-full border rounded-md p-2"
            multiple
            @change="onFileChange"
          />
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
const imageFiles = ref([]); // 여러 파일을 저장할 배열로 변경
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

// 사진 파일 변경 처리
const onFileChange = (event) => {
  imageFiles.value = Array.from(event.target.files); // 여러 파일을 배열로 저장
};

// 리뷰 제출 함수
const submitReview = async () => {
  const formData = new FormData();
  formData.append('revisit', revisit.value);
  formData.append('reviewContent', reviewText.value);

  // 리뷰 점수 리스트를 JSON 문자열로 추가 (ID 변환 포함)
  const scores = Object.entries(ratings.value).map(([category, score]) => ({
    reviewScaleId: ratingIds[category], // 항목 이름을 ID로 변환
    reviewScore: score,
  }));
  formData.append('reviewScoresDtos', JSON.stringify(scores));

  // 여러 파일을 FormData에 추가
  imageFiles.value.forEach((file) => {
    formData.append('files', file); // 여러 파일을 'files'라는 동일한 키로 추가
  });

  try {
    const response = await $fetch(
      `http://localhost:8080/api/v1/stores/${storeId}/reviews`,
      {
        method: 'POST',
        body: formData,
      },
    );
    // 여기서 response를 직접 사용합니다.
    console.log('리뷰가 성공적으로 등록되었습니다.', response);
    router.push(`/stores/${storeId}/reviews`);
  } catch (error) {
    console.error('리뷰 등록 중 오류 발생:', error);
  }
};
</script>

<style scoped>
/* 필요한 경우 스타일 추가 */
</style>
