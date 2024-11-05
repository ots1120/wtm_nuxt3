<template lang="">
  <div class="flex flex-col items-center justify-center">
    <h3 class="text-lg font-bold mb-4">오늘의 메뉴</h3>
    <div
      class="w-1/2 max-w-lg flex flex-col items-center bg-gray-100 rounded-lg p-4"
    >
      <p class="text-gray-500 mb-4">아직 메뉴 정보가 없어요 😢</p>
      <form action="#" method="post" class="w-full">
        <button
          class="bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg w-full transition"
          @click="goToMenuRegPage"
        >
          메뉴 제보하기
        </button>
      </form>
    </div>
  </div>
</template>
<script>
export default {
  methods: {
    goToMenuRegPage() {
      this.$router.push('/newMenu');
    },
  },
};
</script>
<style></style>
