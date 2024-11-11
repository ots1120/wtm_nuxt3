<template>
  <div class="">
    <form @submit.prevent="handleSubmit">
      <h2 class="mb-4 text-2xl font-bold">공지 제목</h2>
      <input
        v-model="formData.title"
        type="text"
        class="h-14 w-full border-2 rounded-lg bg-slate-200 focus:border-orange-400 focus:outline-none"
        spellcheck="false"
        placeholder="공지 제목을 입력하세요"
        required
      />

      <h2 class="mb-4 mt-8 text-2xl font-bold">공지 내용</h2>
      <textarea
        v-model="formData.content"
        rows="10"
        class="h-96 w-full resize-none border-2 rounded-lg bg-slate-200 p-3 focus:border-orange-400 focus:outline-none"
        spellcheck="false"
        placeholder="공지 내용을 입력하세요"
        required
      ></textarea>

      <button
        type="submit"
        class="w-full mt-4 h-12 bg-orange-400 text-white rounded-lg"
      >
        등록
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive, defineProps, defineEmits, watch } from 'vue';

// 타입 정의
interface NoticeData {
  title: string;
  content: string;
}

// Props 정의
const props = defineProps<{
  initialData: NoticeData;
  isEditMode: boolean;
}>();

// Emit 정의
const emit = defineEmits<{
  (event: 'open-modal', data: NoticeData): void;
}>();

// 폼 데이터 관리
const formData = reactive<NoticeData>({
  title: props.initialData.title || '',
  content: props.initialData.content || '',
});

// Props 변경 감지
watch(
  () => props.initialData,
  (newData) => {
    formData.title = newData.title;
    formData.content = newData.content;
  },
  { deep: true },
);

// Submit 핸들러
const handleSubmit = (): void => {
  emit('open-modal', { ...formData });
};
</script>
