<template lang="">
  <div>
    <section
      v-for="(item, index) in history"
      :key="index"
      class="rounded-lg bg-white p-4 shadow-md"
    >
      <h1 class="mb-4 text-lg font-bold">사용 상세 내역</h1>
      <div>
        <div class="mb-2 text-sm text-gray-500">{{ item.date }}</div>
        <div class="flex items-center p-2">
          <div class="flex items-center space-x-2">
            <img
              src="@/assets/icons/fork_knife.svg"
              alt="icon"
              class="h-4 w-4"
            />
          </div>
          <div class="ml-2">
            <div class="text-lg font-semibold text-gray-700">
              {{ item.price }}원
            </div>
            <div class="text-sm text-gray-500">{{ item.storeName }}</div>
          </div>
          <div class="ml-auto text-sm text-gray-400">{{ item.time }}</div>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
export default {
  props: {
    history: {
      type: Array,
      required: true,
    },
  },
};
</script>
<style lang=""></style>
