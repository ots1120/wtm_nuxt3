<template>
  <div class="flex items-center space-x-4">
    <p class="text-gray-600">{{ title }}</p>
    <div class="h-2.5 w-32 rounded-full bg-gray-300">
      <div
        class="h-2.5 rounded-full bg-blue-500"
        :style="{ width: ratingWidth }"
      ></div>
    </div>
    <p class="text-gray-600">{{ score }}점</p>
  </div>
</template>

<script>
export default {
  name: 'RatingBar',
  props: {
    title: {
      type: String,
      default: '음식 맛',
    },
    score: {
      type: Number,
      required: true,
    },
  },
  computed: {
    ratingWidth() {
      return `${(this.score / 5) * 100}%`;
    },
  },
};
</script>
