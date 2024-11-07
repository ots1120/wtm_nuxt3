<template>
  <div>
    <TheHeader :title="title" />
    <section class="flex justify-center">
      <form enctype="multipart/form-data" @submit.prevent="submitReview">
        <!-- 리뷰 평가 항목 -->
        <div class="review-category mt-8 mb-8 w-96">
          <h1 class="hidden">리뷰 평가 항목</h1>
          <!-- 각 항목을 StarRating 컴포넌트로 분리 -->
          <StarRating v-model="ratings.taste" label="맛" category="taste" />
          <StarRating
            v-model="ratings.cleanliness"
            label="청결도"
            category="cleanliness"
          />
          <StarRating v-model="ratings.mood" label="분위기" category="mood" />
          <StarRating
            v-model="ratings.kindness"
            label="친절도"
            category="kindness"
          />
        </div>
        <!-- 재방문 체크박스 -->
        <RevisitCheckbox v-model="revisit" />
        <!-- 사진 업로드 -->
        <PhotoUpload v-model="imageFile" />
        <!-- 리뷰 작성 -->
        <ReviewTextArea v-model="reviewText" />
        <!-- 작성 완료 버튼 -->
        <SubmitButton />
      </form>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import TheHeader from '~/components/user/layout/TheHeader.vue';
import StarRating from '~/components/user/stores/review/StarRating.vue';
import RevisitCheckbox from '~/components/user/stores/review/RevisitCheckbox.vue';
import PhotoUpload from '~/components/user/stores/review/PhotoUpload.vue';
import ReviewTextArea from '~/components/user/stores/review/ReviewTextArea.vue';
import SubmitButton from '~/components/user/stores/review/SubmitButton.vue';

// 데이터 정의
const title = '리뷰작성하기';
const ratings = ref({
  taste: 0,
  cleanliness: 0,
  mood: 0,
  kindness: 0,
});
const revisit = ref(false);
const imageFile = ref(null);
const reviewText = ref('');

// 리뷰 제출 함수
const submitReview = () => {
  const formData = new FormData();
  formData.append('taste', ratings.value.taste);
  formData.append('cleanliness', ratings.value.cleanliness);
  formData.append('mood', ratings.value.mood);
  formData.append('kindness', ratings.value.kindness);
  formData.append('revisit', revisit.value);
  if (imageFile.value) {
    formData.append('file', imageFile.value);
  }
  formData.append('reviewText', reviewText.value);

  // 서버에 폼 데이터를 제출하는 로직을 구현
  console.log('Form submitted', formData);
};
</script>

<style scoped>
/* 필요한 경우 스타일 추가 */
</style>
