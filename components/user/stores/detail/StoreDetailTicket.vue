<template lang="">
  <div class="flex justify-center">
    <div
      class="flex w-1/2 max-w-lg flex-col items-center gap-4 rounded-lg bg-gray-100 p-7"
    >
      <h3 class="w-full text-lg font-bold text-black">{{ storeName }}</h3>
      <p class="flex justify-between w-full text-gray-600">
        식권 잔여 개수
        <span class="font-semibold text-black">{{ remainingTickets }}개</span>
      </p>
      <form action="" method="post" class="w-full">
        <button
          class="w-full rounded-lg bg-gray-300 px-4 py-2 font-semibold text-gray-800"
        >
          식권 충전하기
        </button>
      </form>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    storeName: String,
    remainingTickets: Number,
  },
};
</script>
<style lang=""></style>
