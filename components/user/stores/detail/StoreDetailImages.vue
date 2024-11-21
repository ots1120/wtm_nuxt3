<template>
  <div class="relative w-full aspect-video bg-black">
    <img
      :src="currentImage"
      :alt="restaurantName"
      class="w-full h-full object-contain"
    />

    <!-- Image counter -->
    <div
      class="absolute top-4 right-4 bg-black/50 text-white px-2 py-1 rounded-full text-sm"
    >
      {{ currentImageIndex + 1 }} / {{ images.length }}
    </div>

    <!-- Navigation Arrows -->
    <button
      v-if="hasImages"
      class="absolute left-4 top-1/2 -translate-y-1/2 bg-white/70 text-gray-800 p-2 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-gray-500"
      aria-label="Previous image"
      @click="previousImage"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M15 19l-7-7 7-7"
        />
      </svg>
    </button>
    <button
      v-if="hasImages"
      class="absolute right-4 top-1/2 -translate-y-1/2 bg-white/70 text-gray-800 p-2 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-gray-500"
      aria-label="Next image"
      @click="nextImage"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 5l7 7-7 7"
        />
      </svg>
    </button>

    <!-- Thumbnail navigation -->
    <div class="absolute bottom-4 left-0 right-0 flex justify-center space-x-3">
      <button
        v-for="(image, index) in images"
        :key="index"
        class="w-2.5 h-2.5 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white shadow-md"
        :class="
          index === currentImageIndex ? 'bg-white scale-125' : 'bg-white/70'
        "
        :aria-label="`View image ${index + 1}`"
        @click="setCurrentImage(index)"
      ></button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  images: {
    type: Array,
    required: true,
    default: () => ['/placeholder.svg?height=400&width=400'],
  },
  restaurantName: {
    type: String,
    required: true,
  },
});

const currentImageIndex = ref(0);

const defaultImage = '/images/menu-default.jpg';

const hasImages = computed(() => props.images.length > 0);

const currentImage = computed(() => {
  return hasImages.value ? props.images[currentImageIndex.value] : defaultImage;
});

const nextImage = () => {
  if (hasImages.value) {
    currentImageIndex.value =
      (currentImageIndex.value + 1) % props.images.length;
  }
};

const previousImage = () => {
  if (hasImages.value) {
    currentImageIndex.value =
      currentImageIndex.value === 0
        ? props.images.length - 1
        : currentImageIndex.value - 1;
  }
};

const setCurrentImage = (index) => {
  currentImageIndex.value = index;
};
</script>

<style scoped>
.aspect-square {
  aspect-ratio: 1 / 1;
}

.backdrop-blur-md {
  backdrop-filter: blur(12px);
}
</style>
