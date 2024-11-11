<template>
  <div>
    <h1 class=""></h1>
    <div>
      <div v-if="reviews.length > 0">
        <ReviewItem
          v-for="(review, i) in reviews"
          :key="i"
          :review="review"
          :index="i"
          @toggle-modal="openModal(review.reviewId)"
        />
      </div>
      <p v-else class="text-center mt-4">리뷰를 작성한 적이 없습니다</p>
    </div>
    <ReviewDeleteModal
      v-if="visible"
      :visible="visible"
      :reviewId="selectedReviewId"
      @cancel="closeModal"
      @confirm="deleteCard"
    />
  </div>
</template>

<script setup lang="ts">
import ReviewDeleteModal from '~/components/user/modal/ReviewDeleteModal.vue';
import ReviewItem from '~/components/user/my/ReviewItem.vue';

interface Review{
  storeName: String,
  createdTime: String,
  averageScore: number,// math처리는 원시형 타입만 지원
  content: String,
  reviewId: number,
}
const reviews = ref<Review[]>([]);
const userId = 1;

// 모달 상태 관리
const visible = ref(false);
const selectedReviewId = ref<number | null>(null);

// 모달 열기
const openModal = (reviewId: number) => {
  selectedReviewId.value = reviewId;
  visible.value = true;
};

// 모달 닫기
const closeModal = () => {
  visible.value = false;
  selectedReviewId.value = null;
};

// 컴포넌트 생성 시 리뷰 데이터를 가져옴
const { data,error } = useFetch<Review[]>(
`http://localhost:8080/api/v1/user/my/reviews?userId=${userId}`, {

});

watchEffect(() => {
  if (data.value){
    reviews.value = data.value;
  }
});

const deleteCard = async (reviewId: number) => {
  try {
    console.log(reviewId);
    // 백엔드에 DELETE 요청을 보내 북마크를 삭제
    const userId = 1; // 실제로는 적절한 userId를 사용해야 합니다
    const { data, error } = await useFetch(
      `http://localhost:8080/api/v1/user/my/reviews?reviewId=${reviewId}&userId=${userId}`, 
      {
        method: 'DELETE',
      }
    );

    if (error.value) {
      throw new Error('Failed to delete the review');
    }

    console.log('리뷰가 삭제되었습니다.');

     // 최신 북마크 데이터를 다시 가져오기
     const { data: updatedData, error: fetchError } = await useFetch<Review[]>(
      `http://localhost:8080/api/v1/user/my/reviews?userId=${userId}`, {}
    );

    if (fetchError.value) {
      throw new Error('Failed to fetch updated reviews');
    }

    if (updatedData.value) {
      reviews.value = updatedData.value;
    }
    
  } catch (error) {
    console.error('리뷰 삭제에 실패했습니다:', error);
  } finally {
    closeModal();
  }
};
</script>

<style scoped></style>
