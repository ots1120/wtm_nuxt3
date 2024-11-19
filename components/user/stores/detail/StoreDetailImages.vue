<template>
  <div class="relative w-full aspect-square">
    <img
      :src="currentImage"
      :alt="restaurantName"
      class="w-full h-full object-cover"
    />

    <!-- Navigation Arrows -->
    <button
      v-if="hasImages"
      class="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full"
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
      class="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full"
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
</script>
