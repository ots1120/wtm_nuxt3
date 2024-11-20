<template>
  <header
    class="inline-flex w-full p-3 max-w-lg border-b-2 justify-between bg-slate-50"
  >
    <div class="flex flex-col items-center">
      <button type="button" @click="goBack">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="lucide lucide-arrow-left w-7"
        >
          <path d="m12 19-7-7 7-7" />
          <path d="M19 12H5" />
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
