<!-- components/CustomInput.vue -->
<template>
  <div
    class="m-3 inline-flex items-center w-full border-2 border-gray-100 rounded-3xl"
  >
    <div class="p-4">
      <svg
        width="32px"
        height="32px"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="SVGRepo_bgCarrier" stroke-width="0" />
        <g
          id="SVGRepo_tracerCarrier"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <g id="SVGRepo_iconCarrier">
          <path
            d="M15.7955 15.8111L21 21M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z"
            stroke="#000000"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </g>
      </svg>
    </div>
    <form class="inline-flex w-full" role="search">
      <input
        v-model="inputValue"
        type="search"
        :placeholder="placeholder"
        class="w-full pr-2 py-5 outline-none caret-transparent placeholder no-underline"
        name="query"
        autocomplete="off"
        @input="onInput"
      />
      <button
        v-if="showClear"
        type="button"
        class="w-4 mr-4"
        aria-label="입력 내용 지우기"
        @click="clearInput"
      >
        <!-- 아이콘 또는 텍스트 -->
        ×
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';

interface Props {
  modelValue?: string;
  placeholder?: string;
}
// withDefaults를 사용하여 기본값 설정
const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: '',
});

// Emits 정의
const emit = defineEmits(['update:modelValue']);

// 로컬 상태
const inputValue = ref(props.modelValue);

// 부모로부터 받은 modelValue가 변경되면 로컬 상태 업데이트
watch(
  () => props.modelValue,
  (newValue) => {
    inputValue.value = newValue;
  },
);

// 입력 값이 변경될 때 부모 컴포넌트에 이벤트 전달
function onInput() {
  emit('update:modelValue', inputValue.value);
}

// 입력 값이 있을 때만 클리어 버튼 표시
const showClear = computed(() => inputValue.value.length > 0);

// 입력 값 지우기
function clearInput() {
  inputValue.value = '';
  emit('update:modelValue', '');
}
</script>

<style scoped>
/* 모든 브라우저에서 기본 클리어 버튼 숨기기 */

/* 크롬, 사파리, 엣지 (WebKit 기반 브라우저) */
input[type='search']::-webkit-search-cancel-button {
  display: none;
}

/* 파이어폭스 */
input[type='search']::-moz-search-cancel-button {
  display: none;
}

/* 인터넷 익스플로러 및 구형 엣지 */
input[type='search']::-ms-clear {
  display: none;
}

/* 일반적인 텍스트 입력 필드의 클리어 버튼 숨기기 */
input::-ms-clear {
  display: none;
}
</style>
