<template lang="">
  <div v-if="selectedStore">
    <section class="bg-white p-5 text-center">
      <h1 class="mb-4 text-lg font-semibold">{{ selectedStore.name }}</h1>
      <div class="inline-block rounded-lg bg-gray-100 p-4">
        <img src="#" alt="qr코드사진" class="h-40 w-40" />
      </div>
      <div class="mt-4">
        <span class="block font-semibold">사용 개수</span>
        <span class="text-sm">{{ quantity }}</span>
        <!--부모 컴포넌트 quantity 값-->
      </div>
      <button
        @click="$emit('closeModal')"
        class="mt-4 bg-gray-500 text-white px-4 py-2 rounded-lg"
      >
        닫기
      </button>
    </section>
  </div>
</template>
<script>
export default {
  props: {
    quantity: {
      type: Number,
      required: true,
    },
    selectedStore: {
      type: Object,
      required: true,
    },
  },
};
</script>
<style lang=""></style>
