<template>
  <div>
    <div v-if="reviews.length > 0" class="mb-10">
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
              class="h-14 w-14 rounded-full object-cover"
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
        <div class="w-full flex-col p-3 overflow-hidden">
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
          <div class="mt-2 overflow-hidden">
            <p
              v-if="!isExpanded[reviewIndex]"
              class="truncate text-ellipsis whitespace-nowrap"
            >
              {{ review.reviewContent }}
            </p>
            <p v-else class="whitespace-pre-wrap">
              {{ review.reviewContent }}
            </p>
            <button
              v-if="review.reviewContent.length > 40"
              class="text-xs text-blue-500"
              @click="toggleExpand(reviewIndex)"
            >
              {{ isExpanded[reviewIndex] ? '접기' : '더보기' }}
            </button>
          </div>
          <!-- 리뷰 이미지 항목 -->
          <div
            v-if="review.reviewImgs && review.reviewImgs.length > 0"
            class="mt-3 flex flex-wrap gap-2"
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
                    class="h-6 w-6 rounded-full object-cover"
                  />
                </div>
                <span class="font-semibold">{{ comment.adminName }}</span>
              </div>
              <!-- 수정 중인 댓글 -->
              <div v-if="isEditing[reviewIndex]?.[commentIndex]">
                <textarea
                  v-model="editContent[reviewIndex][commentIndex]"
                  class="w-full h-24 mt-2 border rounded-md resize-none focus:border-orange-400 focus:outline-none"
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
                <p class="whitespace-pre-wrap">{{ comment.commentContent }}</p>
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
                    @click="
                      deleteComment(
                        review.reviewId,
                        comment.commentId,
                        reviewIndex,
                        commentIndex,
                      )
                    "
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
    <!-- Sentinel -->
    <div ref="sentinel" class="h-1"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { useRuntimeConfig } from '#app';
import { differenceInDays } from 'date-fns';
import ReplyForm from '~/components/admin/reviews/ReplyForm.vue';

const config = useRuntimeConfig();
const baseUrl = config.public.baseApiUrl;

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
  adminProfilePicture: string | null;
}

interface ServerComment {
  reviewId: number;
  content: string;
  username: string;
  profilePicture: string;
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
  dayDifference?: string;
}

interface ReviewPageResponse {
  reviews: Review[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

interface IntersectionObserverEntry {
  isIntersecting: boolean;
}

interface IntersectionObserverOptions {
  root: Element | null;
  rootMargin: string;
  threshold: number;
}

// 라우트 인스턴스 생성
const route = useRoute();

// 상태 정의
const reviews = ref<Review[]>([]);
const isExpanded = ref<boolean[]>([]);
const isReplying = ref<boolean[]>([]);
const isEditing = ref<Record<number, Record<number, boolean>>>({});
const editContent = ref<Record<number, Record<number, string>>>({});

// 페이지 상태 관리
const currentPage = ref<number>(0);
const pageSize = ref<number>(5);
const totalPages = ref<number>(0);
const isLoading = ref<boolean>(false);
const sentinel = ref<HTMLElement | null>(null); // 관찰할 엘리먼트

let observer: IntersectionObserver;

// storeId 가져오기
const storeId = route.params.storeId as string;

// 등록일자 계산
const formatDateDifference = (regDate: string): string => {
  const date = new Date(regDate);
  if (isNaN(date.getTime())) {
    console.error('유효하지 않은 날짜 형식:', regDate);
    return '유효하지 않은 날짜';
  }
  const daysDifference = differenceInDays(new Date(), date);
  return `${daysDifference}일 전`;
};

// 더보기/접기 함수
const toggleExpand = (index: number): void => {
  isExpanded.value[index] = !isExpanded.value[index];
};

// 답글 표시/숨기기 토글 함수
const toggleComment = (index: number): void => {
  isReplying.value[index] = !isReplying.value[index];
};

// 리뷰 데이터 로드 함수
const loadReviews = async (): Promise<void> => {
  if (
    isLoading.value ||
    (totalPages.value && currentPage.value >= totalPages.value)
  ) {
    return;
  }
  isLoading.value = true;

  try {
    const response = await $fetch<ReviewPageResponse>(
      `/api/v1/admin/stores/${storeId}/reviews`,
      {
        baseURL: baseUrl,
        params: {
          page: currentPage.value,
          size: pageSize.value,
        },
      },
    );

    if (response && response.reviews) {
      totalPages.value = response.totalPages;
      currentPage.value = response.currentPage + 1;

      // 새 데이터 병합
      const newReviews = response.reviews.map((review) => ({
        ...review,
        dayDifference: formatDateDifference(review.reviewRegDate),
        userProfilePicture: review.userProfilePicture
          ? `${baseUrl}${review.userProfilePicture}`
          : null,
        adminProfilePicture: review.adminProfilePicture
          ? `${baseUrl}${review.adminProfilePicture}`
          : null,
        reviewImgs: review.reviewImgs.map((img) => `${baseUrl}${img}`),
      }));

      reviews.value = [...reviews.value, ...newReviews];
      isExpanded.value = [
        ...isExpanded.value,
        ...new Array(newReviews.length).fill(false),
      ];
      isReplying.value = [
        ...isReplying.value,
        ...new Array(newReviews.length).fill(false),
      ];
    }
  } catch (error) {
    console.error('리뷰 데이터를 가져오는 중 오류 발생:', error);
  } finally {
    isLoading.value = false;
  }
};

// Intersection Observer 설정
onMounted(() => {
  loadReviews(); // 첫 번째 페이지 데이터 로드

  const options: IntersectionObserverOptions = {
    root: null, // 뷰포트 기준
    rootMargin: '0px',
    threshold: 1.0, // sentinel의 100%가 뷰포트에 들어왔을 때 트리거
  };

  observer = new IntersectionObserver(handleIntersect, options);
  if (sentinel.value) {
    observer.observe(sentinel.value);
  }
});

onUnmounted(() => {
  if (observer) {
    observer.disconnect();
  }
});

const handleIntersect = (entries: IntersectionObserverEntry[]): void => {
  if (entries[0].isIntersecting && !isLoading.value) {
    loadReviews(); // 새로운 페이지의 리뷰 데이터를 로드
  }
};

// 답글 등록 API
const submitComment = async (
  reviewId: number,
  commentContent: string,
  index: number,
): Promise<void> => {
  try {
    const newComment = await $fetch<ServerComment>(
      `/api/v1/admin/stores/${storeId}/reviews/${reviewId}`,
      {
        baseURL: baseUrl,
        method: 'POST',
        body: {
          storeId,
          userId: 1,
          reviewId,
          content: commentContent,
          userProfilePciture: null,
        },
      },
    );
    // 서버 응답 데이터를 ReviewComment 형식으로 변환
    const processedComment: ReviewComment = {
      commentId: newComment.reviewId,
      commentContent: newComment.content,
      adminName: newComment.username,
      adminProfilePicture: newComment.profilePicture
        ? `${baseUrl}${newComment.profilePicture}`
        : null,
    };

    // 댓글 배열이 없을 경우 초기화
    if (!reviews.value[index].reviewComments) {
      reviews.value[index].reviewComments = [];
    }

    // 로컬 상태에 댓글 추가
    reviews.value[index].reviewComments.push(processedComment);

    toggleComment(index);
  } catch (error) {
    console.error('답글 제출 중 오류 발생: ', error);
  }
};

// 수정 버튼 클릭 시 폼 활성화
const enableEdit = (
  content: string,
  reviewIndex: number,
  commentIndex: number,
): void => {
  if (!isEditing.value[reviewIndex]) {
    isEditing.value[reviewIndex] = {};
    editContent.value[reviewIndex] = {};
  }
  isEditing.value[reviewIndex][commentIndex] = true;
  editContent.value[reviewIndex][commentIndex] = content;
};

// 취소 버튼 클릭 시 원복
const cancelEdit = (reviewIndex: number, commentIndex: number): void => {
  isEditing.value[reviewIndex][commentIndex] = false;
  editContent.value[reviewIndex][commentIndex] = '';
};

// 수정 내용 등록
const submitUpdatedComment = async (
  reviewId: number,
  commentId: number,
  reviewIndex: number,
  commentIndex: number,
): Promise<void> => {
  try {
    const response = await fetch(
      `${baseUrl}/api/v1/admin/stores/${storeId}/reviews/${reviewId}/comments/${commentId}`,
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
      // 로컬 상태에서 댓글 내용 업데이트
      reviews.value[reviewIndex].reviewComments[commentIndex].commentContent =
        editContent.value[reviewIndex][commentIndex];

      isEditing.value[reviewIndex][commentIndex] = false;
    } else {
      console.error('댓글 수정 실패:', await response.text());
    }
  } catch (err) {
    console.error('댓글 수정 중 오류 발생:', err);
  }
};

// 답글 삭제 API
const deleteComment = async (
  reviewId: number,
  commentId: number,
  reviewIndex: number,
  commentIndex: number,
): Promise<void> => {
  try {
    await $fetch(
      `/api/v1/admin/stores/${storeId}/reviews/${reviewId}/comments/${commentId}`,
      {
        baseURL: baseUrl,
        method: 'DELETE',
      },
    );
    // 로컬 상태에서 댓글 삭제
    reviews.value[reviewIndex].reviewComments.splice(commentIndex, 1);
  } catch (error) {
    console.error('답글 삭제 중 오류 발생: ', error);
  }
};
</script>

<style scoped>
.sentinel {
  height: 1px;
  background: transparent;
}
</style>
