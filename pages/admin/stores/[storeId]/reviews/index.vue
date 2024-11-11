<template>
  <div>
    <div v-if="reviews.length > 0">
      <div
        v-for="(review, reviewIndex) in reviews"
        :key="review.reviewId"
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
              class="h-14"
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
            <span v-if="review.userName">{{ review.userName }}</span>
            <span class="text-xs text-gray-400">{{
              review.dayDifference
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
          <!-- 별점 표시 아래, 리뷰 내용 표시 -->
          <div>
            <!-- 리뷰 내용 -->
            <div class="mt-2">
              <p v-if="!isExpanded[reviewIndex]" class="truncate">
                {{ review.reviewContent }}
              </p>
              <p v-else class="whitespace-pre-wrap">
                {{ review.reviewContent }}
              </p>
              <!-- 더보기/접기 버튼 -->
              <button
                v-if="review.reviewContent.length > 100"
                class="text-xs text-blue-500"
                @click="toggleExpand(reviewIndex)"
              >
                {{ isExpanded[reviewIndex] ? '접기' : '더보기' }}
              </button>
            </div>

            <!-- 리뷰 이미지 항목 -->
            <div
              v-if="review.reviewImgs && review.reviewImgs.length > 0"
              class="mt-3 flex gap-2"
            >
              <div
                v-for="(img, imgIndex) in review.reviewImgs"
                :key="imgIndex"
                class="w-24 h-24 border rounded-md overflow-hidden"
              >
                <a :href="img" target="_blank">
                  <img
                    :src="img"
                    alt="Review Image"
                    class="w-full h-full object-cover"
                  />
                </a>
              </div>
            </div>
          </div>
          <!-- 리뷰 댓글 -->
          <div v-if="review.reviewComments.length > 0">
            <div
              v-for="(comment, commentIndex) in review.reviewComments"
              :key="comment.commentId"
              class="mt-2 p-2 border rounded-md text-xs text-gray-600"
            >
              <div class="flex items-center gap-2">
                <div v-if="review.adminProfilePicture">
                  <img
                    :src="review.adminProfilePicture"
                    alt="admin profile"
                    class="h-6 w-6 rounded-full"
                  />
                </div>
                <span class="font-semibold">{{ comment.adminName }}</span>
              </div>
              <!-- 수정 중인 댓글 -->
              <div v-if="isEditing[reviewIndex]?.[commentIndex]">
                <textarea
                  v-model="editContent[reviewIndex][commentIndex]"
                  class="w-full h-full mt-2 border rounded-md resize-none focus:border-orange-400 focus:outline-none"
                  spellcheck="false"
                ></textarea>
                <div class="flex justify-end gap-4 mt-2">
                  <button
                    class="text-xs text-blue-500"
                    @click="
                      submitUpdatedComment(
                        review.reviewId,
                        comment.commentId,
                        reviewIndex,
                        commentIndex,
                      )
                    "
                  >
                    등록
                  </button>
                  <button
                    class="text-xs text-gray-500"
                    @click="cancelEdit(reviewIndex, commentIndex)"
                  >
                    취소
                  </button>
                </div>
              </div>
              <!-- 기본 상태 -->
              <div v-else>
                <p>{{ comment.commentContent }}</p>
                <div class="flex justify-end gap-4">
                  <button
                    class="text-xs text-blue-500"
                    @click="
                      enableEdit(
                        comment.commentContent,
                        reviewIndex,
                        commentIndex,
                      )
                    "
                  >
                    수정
                  </button>
                  <button
                    class="text-xs text-red-500"
                    @click="deleteComment(review.reviewId, comment.commentId)"
                  >
                    삭제
                  </button>
                </div>
              </div>
            </div>
          </div>
          <!-- 답글 작성 -->
          <div class="flex justify-end mt-2">
            <button
              v-if="!isReplying[reviewIndex]"
              class="cursor-pointer text-xs text-blue-500"
              @click="toggleComment(reviewIndex)"
            >
              답글
            </button>
            <ReplyForm
              v-if="isReplying[reviewIndex]"
              :review-data="review"
              :index="reviewIndex"
              @submit-reply="submitComment"
              @cancel-reply="toggleComment"
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
import { ref, watchEffect } from 'vue';
import { useFetch } from '#app';
import { differenceInDays } from 'date-fns';
import ReplyForm from '~/components/admin/reviews/ReplyForm.vue';

onBeforeMount(() => {
  route.meta.title = '리뷰관리';
});

definePageMeta({
  layout: 'admin',
});

interface ReviewComment {
  commentId: number;
  commentContent: string;
  adminName: string;
  adminProfilePicture: string;
}

interface Review {
  reviewId: number;
  userName: string;
  userProfilePicture: string | null;
  adminProfilePicture: string | null;
  reviewContent: string;
  reviewImgs: string[];
  reviewScore: number;
  reviewRegDate: string;
  reviewComments: ReviewComment[];
  dayDifference: string;
}

// 라우트 인스턴스 생성
const route = useRoute();

// 상태 정의
const reviews = ref<Review[]>([]);
const isExpanded = ref<boolean[]>([]);
const isReplying = ref<boolean[]>([]);
const isEditing = ref<Record<number, Record<number, boolean>>>({});
const editContent = ref<Record<number, Record<number, string>>>({});

// storeId 가져오기
const storeId = route.params.storeId;
console.log(storeId);

// 등록일자 계산
const formatDateDifference = (regDate: string) => {
  const date = new Date(regDate);
  if (isNaN(date.getTime())) {
    console.error('유효하지 않은 날짜 형식:', regDate);
    return '유효하지 않은 날짜';
  }
  const daysDifference = differenceInDays(new Date(), date);
  return `${daysDifference}일 전`;
};

// 더보기/접기 함수
const toggleExpand = (index: number) => {
  isExpanded.value[index] = !isExpanded.value[index];
};

// 답글 표시/숨기기 토글 함수
const toggleComment = (index: number) => {
  isReplying.value[index] = !isReplying.value[index];
};

// 데이터 가져오기 API
const { data, refresh, error } = useFetch<Review[]>(
  `/api/admin/stores/${storeId}/reviews`,
  {
    baseURL: 'http://localhost:8080',
  },
);

watchEffect(() => {
  if (data.value) {
    reviews.value = data.value.map((review) => ({
      ...review,
      dayDifference: formatDateDifference(review.reviewRegDate),
      userProfilePicture: review.userProfilePicture
        ? `http://localhost:8080${review.userProfilePicture}`
        : null,
      adminProfilePicture: review.adminProfilePicture
        ? `http://localhost:8080${review.adminProfilePicture}`
        : null,
      reviewImgs: review.reviewImgs.map((img) => `http://localhost:8080${img}`), // 배열의 각 경로에 도메인을 추가
    }));
    console.log(data.value);
    isExpanded.value = new Array(reviews.value.length).fill(false);
    isReplying.value = new Array(reviews.value.length).fill(false);
  }
  if (error.value) {
    console.error('데이터 요청 중 예외 발생:', error.value);
  }
});

// 답글 등록 API
const submitComment = async (
  reviewId: number,
  commentContent: string,
  index: number,
) => {
  try {
    //     // const userId = getUserIdFromSession(); //세션이나 인증된 사용자 정보에서 가져와야 함.
    //     // const userName = getUserNameFromSession(); //세션이나 인증된 사용자 정보에서 가져와야 함.
    //     // const userProfilePicture = getUserProfilePictureFromSession(); //세션이나 인증된 사용자 정보에서 가져와야 함.
    await useFetch(`/api/admin/stores/${storeId}/reviews/${reviewId}`, {
      baseURL: 'http://localhost:8080',
      method: 'POST',
      body: {
        storeId,
        userId: 1,
        reviewId,
        content: commentContent,
        userProfilePciture: null,
      },
    });

    // 답글 제출 후 리뷰 재갱신
    toggleComment(index);
    await refresh();
  } catch (error) {
    console.error('답글 제출 중 오류 발생: ', error);
  }
};

// 수정 버튼 클릭 시 폼 활성화
const enableEdit = (
  content: string,
  reviewIndex: number,
  commentIndex: number,
) => {
  if (!isEditing.value[reviewIndex]) {
    isEditing.value[reviewIndex] = {};
    editContent.value[reviewIndex] = {};
  }
  isEditing.value[reviewIndex][commentIndex] = true;
  editContent.value[reviewIndex][commentIndex] = content;
};

// 취소 버튼 클릭 시 원복
const cancelEdit = (reviewIndex: number, commentIndex: number) => {
  isEditing.value[reviewIndex][commentIndex] = false;
  editContent.value[reviewIndex][commentIndex] = '';
};

// 수정 내용 등록
const submitUpdatedComment = async (
  reviewId: number,
  commentId: number,
  reviewIndex: number,
  commentIndex: number,
) => {
  try {
    const response = await fetch(
      `http://localhost:8080/api/admin/stores/${storeId}/reviews/${reviewId}/comments/${commentId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: editContent.value[reviewIndex][commentIndex],
        }),
      },
    );

    if (response.ok) {
      console.log('댓글 수정 완료');
      // 데이터 새로고침
      isEditing.value[reviewIndex][commentIndex] = false;
      await refresh(); // API로 전체 데이터 새로고침
    } else {
      console.error('댓글 수정 실패:', await response.text());
    }
  } catch (err) {
    console.error('댓글 수정 중 오류 발생:', err);
  }
};

// 답글 삭제 API
const deleteComment = async (reviewId: number, commentId: number) => {
  try {
    await useFetch(
      `/api/admin/stores/${storeId}/reviews/${reviewId}/comments/${commentId}`,
      {
        baseURL: 'http://localhost:8080',
        method: 'DELETE',
      },
    );

    await refresh();
  } catch (error) {
    console.error('답글 삭제 중 오류 발생: ', error);
  }
};
</script>

<style scoped></style>
