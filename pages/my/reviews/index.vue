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
      :review-id="selectedReviewId"
      @cancel="closeModal"
      @confirm="deleteCard"
    />
  </div>
</template>

<script setup lang="ts">
import ReviewDeleteModal from '~/components/user/modal/ReviewDeleteModal.vue';
import ReviewItem from '~/components/user/my/ReviewItem.vue';

interface Review {
  storeName: string;
  createdTime: string;
  averageScore: number; // math처리는 원시형 타입만 지원
  content: string;
  reviewId: number;
  reviewImgUrl: string;
}
const reviews = ref<Review[]>([]);

const authstore = useAuthStore();
const username = authstore.user?.username;

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
const { data, error } = useFetch<Review[]>(
  `http://localhost:8080/api/v1/user/my/reviews?username=${username}`,
);

if (data.value) {
  reviews.value = data.value.map((review) => ({
    ...review,
    reviewImgUrl: `http://localhost:8080${review.reviewImgUrl}`,
  }));
} else if (error.value) {
  console.error('유저 정보를 불러오는 데 실패했습니다', error.value);
}

const deleteCard = async (reviewId: number) => {
  try {
    // 백엔드에 DELETE 요청을 보내 북마크를 삭제
    const { data, error } = await useFetch(
      `http://localhost:8080/api/v1/user/my/reviews/${reviewId}/usernames/${username}`,
      {
        method: 'DELETE'
      },
    );

    if (error.value) {
      throw new Error('Failed to delete the review');
    }

    console.log('리뷰가 삭제되었습니다.');

    // 최신 북마크 데이터를 다시 가져오기
    const { data: updatedData, error: fetchError } = await useFetch<Review[]>(
      `http://localhost:8080/api/v1/user/my/reviews?username=${username}`,
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

const route = useRoute();
onBeforeMount(() => {
  route.meta.title = '내 리뷰';
});
</script>

<style scoped></style>
