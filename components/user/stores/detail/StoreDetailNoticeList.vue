<template lang="">
  <div class="flex justify-center border-b border-gray-300">
    <li class="max-w-md list-none p-2">
      <div class="flex items-center">
        <img src="#" alt=" " />
        <span>{{ storeName }}</span>
      </div>
      <div class="mb-4 flex justify-between text-sm text-gray-500">
        <span class="block">{{ daysAgo }}일전</span>
      </div>
      <div class="mb-4">
        <h3 class="mb-1 text-lg font-bold">{{ noticeName }}</h3>
        <p class="text-greay-700">{{ noticeContent }}</p>
      </div>
    </li>
  </div>
</template>
<script>
export default {
  props: {
    storeId: String,
    storeName: String,
    daysAgo: Number,
    noticeName: String,
    noticeContent: String,
  },
};
</script>
<style lang=""></style>
