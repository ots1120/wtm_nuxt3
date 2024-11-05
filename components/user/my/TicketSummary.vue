<template lang="">
  <div>
    <section class="rounded-lg bg-white p-6 shadow">
      <h1 class="mb-4 text-lg font-bold">사용 요약</h1>
      <div>
        <div class="mb-2 text-xl text-gray-500">{{ month }}월</div>
        <div class="space-y-2">
          <div class="flex justify-between text-gray-600">
            구매
            <span class="font-semibold text-black">{{ purchasePrice }}원</span>
          </div>
          <div class="flex justify-between text-gray-600">
            사용
            <span class="font-semibold text-blue-500">{{ usedPrice }}원</span>
          </div>
          <div class="flex justify-between text-gray-600">
            잔여수량
            <span class="font-semibold text-red-500"
              >{{ remainingCount }}개</span
            >
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
export default {
  props: {
    month: {
      type: String,
      required: true,
    },
    purchasePrice: {
      type: String,
      required: true,
    },
    usedPrice: {
      type: String,
      required: true,
    },
    remainingCount: {
      type: String,
      required: true,
    },
  },
};
</script>
<style lang=""></style>
