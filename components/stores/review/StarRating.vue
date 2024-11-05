<template>
  <div class="flex items-end justify-center mb-4 gap-4">
    <span class="text-lg font-semibold w-20 text-center">{{ label }}</span>
    <div class="flex text-yellow-400 w-28" @mouseleave="clearHover">
      <!-- 각 별점의 input과 label -->
      <input
        v-for="star in 5"
        :key="star"
        type="radio"
        :id="`${category}-${star}-stars`"
        :name="category"
        :value="star"
        v-model="rating"
        class="hidden"
      />
      <label
        v-for="star in 5"
        :key="star"
        :for="`${category}-${star}-stars`"
        class="cursor-pointer text-gray-300 transition"
        :class="{ 'text-yellow-400': star <= hoverRating || star <= rating }"
        @mouseenter="setHover(star)"
      >
        &#9733;
      </label>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    label: String,
    category: String,
    modelValue: Number,
  },
  data() {
    return {
      hoverRating: 0, // 마우스 오버시 사용할 상태 변수
    };
  },
  computed: {
    rating: {
      get() {
        return this.modelValue;
      },
      set(value) {
        this.$emit('update:modelValue', value);
      },
    },
  },
  methods: {
    setHover(star) {
      this.hoverRating = star; // 마우스가 올려진 별의 값 설정
    },
    clearHover() {
      this.hoverRating = 0; // 마우스가 나가면 hover 상태를 초기화
    },
  },
};
</script>

<style></style>
