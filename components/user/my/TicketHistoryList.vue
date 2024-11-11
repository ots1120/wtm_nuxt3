<template lang="">
  <div>
    <section class="rounded-lg bg-white p-4 shadow-md">
      <div>
        <div class="mb-2 text-sm text-gray-500">{{ props.history.formattedRegDate }}</div>
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
              {{ props.history.price }}원
            </div>
            <div class="text-sm text-gray-500">{{ props.history.storeName }}</div>
          </div>
          <div class="ml-auto text-sm text-gray-400">{{ props.history.formattedTime }}</div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

interface TicketHistory {
  formattedRegDate: String;
  price: Number;
  storeName: String;
  formattedTime: String; 
}
// defineProps를 사용해 props 타입을 지정합니다.
const props = defineProps<{ history: TicketHistory }>();

</script>

<style lang=""></style>
