<template>
  <div>
    <div v-if="reviews.length > 0">
      <div
        v-for="(review, index) in reviews"
        :key="review.id"
        class="flex border-b-2"
      >
        <!-- 유저 프로필 사진 영역 -->
        <div class="flex items-start justify-center p-3">
          <div v-if="review.userProfilePicture">
            <img
              :src="review.userProfilePicture"
              alt="profile"
              class="h-14 w-14 rounded-full"
            />
          </div>
          <div v-else>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-24"
              viewBox="0 0 16 16"
            >
              <path
                fill="#BDBDBD"
                d="M8 16A8 8 0 1 1 8 0a8 8 0 0 1 0 16m.847-8.145a2.502 2.502 0 1 0-1.694 0C5.471 8.261 4 9.775 4 11c0 .395.145.995 1 .995h6c.855 0 1-.6 1-.995c0-1.224-1.47-2.74-3.153-3.145"
              />
            </svg>
          </div>
        </div>
        <div class="w-full flex-col p-3">
          <div class="flex justify-between">
            <span v-if="review.userName">
              {{ review.userName }}
            </span>
            <span class="text-xs text-gray-400">{{
              review.reviewRegDate
            }}</span>
          </div>
          <!-- 별점 표시 -->
          <div>
            <svg
              v-for="n in 5"
              :key="n"
              class="inline w-5"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21.12 9.88005C21.0781 9.74719 20.9996 9.62884 20.8935 9.53862C20.7873 9.4484 20.6579 9.38997 20.52 9.37005L15.1 8.58005L12.67 3.67005C12.6008 3.55403 12.5027 3.45795 12.3853 3.39123C12.2678 3.32451 12.1351 3.28943 12 3.28943C11.8649 3.28943 11.7322 3.32451 11.6147 3.39123C11.4973 3.45795 11.3991 3.55403 11.33 3.67005L8.89999 8.58005L3.47999 9.37005C3.34211 9.38997 3.21266 9.4484 3.10652 9.53862C3.00038 9.62884 2.92186 9.74719 2.87999 9.88005C2.83529 10.0124 2.82846 10.1547 2.86027 10.2907C2.89207 10.4268 2.96124 10.5512 3.05999 10.6501L6.99999 14.4701L6.06999 19.8701C6.04642 20.0091 6.06199 20.1519 6.11497 20.2826C6.16796 20.4133 6.25625 20.5267 6.36999 20.6101C6.48391 20.6912 6.61825 20.7389 6.75785 20.7478C6.89746 20.7566 7.03675 20.7262 7.15999 20.6601L12 18.1101L16.85 20.6601C16.9573 20.7189 17.0776 20.7499 17.2 20.7501C17.3573 20.7482 17.5105 20.6995 17.64 20.6101C17.7537 20.5267 17.842 20.4133 17.895 20.2826C17.948 20.1519 17.9636 20.0091 17.94 19.8701L17 14.4701L20.93 10.6501C21.0305 10.5523 21.1015 10.4283 21.1351 10.2922C21.1687 10.1561 21.1634 10.0133 21.12 9.88005Z"
                :fill="
                  n <= Math.floor(review.reviewScore) ? '#ffd500' : '#d3d3d3'
                "
              />
            </svg>
          </div>
          <!-- 리뷰 내용 -->
          <div class="mt-1 text-xs">
            <p
              :style="
                isExpanded[index]
                  ? 'height:auto;'
                  : 'height:4.5rem; overflow:hidden;'
              "
            >
              {{ review.reviewContent }}
            </p>
            <button
              v-if="review.reviewContent && review.reviewContent.length > 200"
              class="mt-1 text-xs text-blue-500"
              @click="toggleExpand(index)"
            >
              {{ isExpanded[index] ? '접기' : '더보기' }}
            </button>
          </div>
          <!-- 리뷰 답글 출력 -->
          <div v-if="review.reviewComments.length > 0">
            <div
              v-for="comment in review.reviewComments"
              :key="comment.commentId"
              class="mt-2 p-2 border rounded-md text-xs text-gray-600"
            >
              <div class="flex items-center gap-2">
                <div v-if="comment.adminProfilePicture">
                  <img
                    :src="comment.adminProfilePicture"
                    alt="admin profile"
                    class="h-6 w-6 rounded-full"
                  />
                </div>
                <span class="font-semibold">{{ comment.adminName }}</span>
              </div>
              <p>{{ comment.commentContent }}</p>
            </div>
          </div>
          <!-- 답글이 없을 때 답글 작성 폼 -->
          <div class="flex justify-end mt-2">
            <button
              v-if="!isReplying[index]"
              class="cursor-pointer text-xs text-blue-500"
              @click="toggleReply(index)"
            >
              답글
            </button>
            <ReplyForm
              v-if="isReplying[index]"
              :review-data="review"
              :index="index"
              @submit-reply="submitReply"
              @cancel-reply="toggleReply"
            />
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <p class="text-center text-gray-500">리뷰가 없습니다.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { ref, onMounted } from 'vue';
import axios from 'axios';
import ReplyForm from '~/components/admin/ReplyForm.vue';

interface ReviewComment {
  commentId: number;
  commentContent: string;
  adminName: string;
  adminProfilePicture?: string;
}

interface Review {
  id: number;
  userName: string;
  userProfilePicture?: string;
  reviewContent: string;
  reviewScore: number;
  reviewRegDate: string;
  reviewComments: ReviewComment[];
}

// 라우트 인스턴스 생성
const route = useRoute();

// 상태 정의
const reviews = ref<Review[]>([]);
const isExpanded = ref<boolean[]>([]);
const isReplying = ref<boolean[]>([]);

// storeId 가져오기
const storeId = route.params.storeId;
console.log(storeId);

// 데이터 가져오기 함수
const fetchReviews = async () => {
  try {
    const response = await axios.get(
      `http://localhost:8080/api/admin/stores/${storeId}/reviews`,
    );
    reviews.value = response.data.map((review: Review) => {
      return {
        ...review,
      };
    });
    isExpanded.value = new Array(reviews.value.length).fill(false);
    isReplying.value = new Array(reviews.value.length).fill(false);
  } catch (error) {
    console.error('데이터 요청 중 예외 발생:', error);
  }
};

// 컴포넌트가 마운트될 때 데이터 로드
onMounted(fetchReviews);

// 더보기/접기 함수
const toggleExpand = (index: number) => {
  isExpanded.value[index] = !isExpanded.value[index];
};

// 답글 표시/숨기기 토글 함수
const toggleReply = (index: number) => {
  isReplying.value[index] = !isReplying.value[index];
};

// 답글 제출 로직
const submitReply = (replyContent: string, index: number) => {
  console.log('답글 제출:', replyContent);
  toggleReply(index); // 답글 제출 후 상태 초기화
};
</script>

<style scoped>
/* 필요한 스타일 추가 */
</style>
