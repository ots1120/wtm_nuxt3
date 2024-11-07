<template>
  <div v-if="reviews && reviews.length">
    <div
      v-for="(review, index) in reviews"
      :key="review.id"
      class="flex border-b-2"
    >
      <!-- 유저 프로필 사진 영역 -->
      <div class="flex items-start justify-center p-3">
        <div v-if="review.member.profilePicture">
          <img
            :src="review.member.profilePicture"
            alt="profile"
            class="h-14 w-14 rounded-full"
          />
        </div>
        <div v-else>
          <!-- 기본 아이콘 추가 -->
        </div>
      </div>
      <div class="w-full flex-col p-3">
        <div class="flex justify-between">
          <span>{{ review.member.name }}</span>
          <span class="text-xs text-gray-400">{{ review.createdTime }}</span>
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
              :fill="n <= Math.floor(review.rating) ? '#ffd500' : '#d3d3d3'"
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
            {{ review.content }}
          </p>
          <button
            v-if="review.content.length > 100"
            class="mt-1 text-xs text-blue-500"
            @click="toggleExpand(index)"
          >
            {{ isExpanded[index] ? '접기' : '더보기' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

// 리뷰 데이터는 기본적으로 빈 배열로 초기화
const props = defineProps({
  reviews: {
    type: Array,
    default: () => [],
  },
});

const isReplying = ref(Array(props.reviews.length).fill(false)); // 답글 상태 저장
const isExpanded = ref(Array(props.reviews.length).fill(false)); // 텍스트 확장 상태 저장

const toggleExpand = (index) => {
  isExpanded.value[index] = !isExpanded.value[index];
};

watch(
  () => props.reviews,
  (newReviews) => {
    isReplying.value = Array(newReviews.length).fill(false);
    isExpanded.value = Array(newReviews.length).fill(false);
  },
);
</script>
