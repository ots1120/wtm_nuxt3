<template>
  <div class="mt-2 w-full">
    <textarea
      v-model="commentContent"
      class="h-20 w-full resize-none rounded-md border border-gray-300 p-2 text-xs focus:border-orange-400"
      placeholder="답글을 입력해주세요."
      spellcheck="false"
    ></textarea>
    <div class="mt-1 flex justify-end">
      <button class="mr-2 text-xs text-blue-500" @click="handleSubmitComment">
        답글 달기
      </button>
      <button
        class="text-xs text-gray-500"
        @click="$emit('cancel-reply', index)"
      >
        취소
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue';

// Props 정의
const props = defineProps<{
  reviewData: {
    id: number;
    userName: string;
    userProfilePicture?: string;
    reviewContent: string;
    reviewScore: number;
    reviewRegDate: string;
  };
  index: number;
}>();

// Emits 정의
const emit = defineEmits<{
  (event: 'submitComment', reviewId: number, commentContent: string): void;
  (event: 'cancel-reply', index: number): void;
}>();

// 답글 내용 관리
const commentContent = ref<string>('');

// 답글 제출 함수
const handleSubmitComment = () => {
  if (props.reviewData) {
    console.log(props.reviewData);
    console.log('Replying to review with ID:', props.reviewData.id);
    console.log('Reply content:', commentContent.value);
    emit('submitComment', props.reviewData.id, commentContent.value); // submitComment 이벤트 발생
    commentContent.value = ''; // 답글 제출 후 초기화
  } else {
    console.error('Review data is missing!');
  }
};
</script>

<style scoped></style>
