<template>
  <div
    class="relative z-10 flex flex-col items-center pt-3 px-1 w-full max-w-lg bg-slate-100"
  >
    <NuxtLink to="/" aria-label="홈으로 이동">
      <svg
        class="w-16"
        viewBox="0 0 50 15"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M6.27327 0.819999H9.29327L10.7733 5.36L12.2533 0.819999H15.2933L12.8733 7.42L14.3133 11.2L17.8733 0.799999H21.4533L15.9133 15H13.0733L10.7733 9.44L8.49327 15H5.63327L0.113269 0.799999H3.67327L7.25327 11.2L8.65327 7.42L6.27327 0.819999ZM33.507 3.68H29.187V15H25.907V3.68H21.567V0.799999H33.507V3.68ZM46.3089 15V6.54L43.2489 12.7H41.4489L38.3889 6.54V15H35.1089V0.799999H38.6689L42.3489 8.22L46.0489 0.799999H49.5889V15H46.3089Z"
          fill="black"
        />
      </svg>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
const searchText = ref('');
</script>

<style scoped></style>
