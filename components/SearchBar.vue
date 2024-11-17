<!-- components/CustomInput.vue -->
<template>
  <div
    class="mt-3 inline-flex items-center w-full border-2 border-gray-200 rounded-2xl"
  >
    <div class="p-4">
      <svg
        class="w-8"
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
    <!-- submit 이벤트에 .prevent를 추가하여 기본 새로고침 동작을 방지하고 검색 실행 -->
    <form class="inline-flex w-full" role="search" @submit.prevent="onSearch">
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
        class="w-5 mr-4"
        aria-label="입력 내용 지우기"
        @click="clearInput"
      >
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

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: '',
});

const emit = defineEmits(['update:modelValue', 'search']);

const inputValue = ref(props.modelValue);

watch(
  () => props.modelValue,
  (newValue) => {
    inputValue.value = newValue;
  },
);

function onInput() {
  emit('update:modelValue', inputValue.value);
}

const showClear = computed(() => inputValue.value.length > 0);

function clearInput() {
  inputValue.value = '';
  emit('update:modelValue', '');
}

function onSearch() {
  emit('search'); // 검색 버튼 클릭 또는 Enter 시 search 이벤트를 발생
}
</script>

<style scoped>
input[type='search']::-webkit-search-cancel-button {
  display: none;
}
input[type='search']::-moz-search-cancel-button {
  display: none;
}
input[type='search']::-ms-clear {
  display: none;
}
input::-ms-clear {
  display: none;
}
</style>
