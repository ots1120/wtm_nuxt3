<template>
  <header
    class="inline-flex w-full p-3 max-w-lg border-b-2 justify-between bg-slate-50"
  >
    <div class="flex flex-col items-center">
      <button type="button" @click="goBack">
        <svg
          class="w-8"
          viewBox="0 0 1024 1024"
          xmlns="http://www.w3.org/2000/svg"
          fill="#000000"
          stroke="#000000"
          stroke-width="20.48"
        >
          <g id="SVGRepo_bgCarrier" stroke-width="0" />
          <g
            id="SVGRepo_tracerCarrier"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <g id="SVGRepo_iconCarrier">
            <path
              fill="#000000"
              d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z"
            />
            <path
              fill="#000000"
              d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z"
            />
          </g>
        </svg>
      </button>
    </div>
    <h1 class="flex text-2xl font-semibold">{{ title }}</h1>
    <div class="w-8"></div>
  </header>
</template>

<script setup lang="ts">
const router = useRouter();

interface Props {
  title?: string;
}
withDefaults(defineProps<Props>(), {
  title: '',
});

const goBack = () => {
  router.go(-1);
};
</script>

<style scoped></style>
