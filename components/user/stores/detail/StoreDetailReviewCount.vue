<template lang="">
  <div class="flex justify-between border-b border-t p-2">
    <span class="text-sm font-bold">리뷰 {{ reviewCount }}건</span>
    <a href="" class="text-sm">전체보기<!-- svg파일 --></a>
  </div>
</template>
<script>
export default {
  props: {
    reviewCount: Number,
  },
};
</script>
<style lang=""></style>
