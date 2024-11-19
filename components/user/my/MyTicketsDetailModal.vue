<template>
  <div v-if="storeInfo">
    <section class="bg-white p-5 text-center">
      <div class="inline-block rounded-lg bg-gray-100 p-4">
        <!-- QR 코드 생성 (275x275 해상도 설정) -->
        <qrcode-vue :value="qrCodeUrl" :size="275" />
      </div>
      <div class="mt-4">
        <span class="block font-semibold">{{ typeLabel }}</span>
        <span class="text-sm">{{ ticketQuantity }}</span>
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

<script setup lang="ts">
import { computed } from 'vue';
import QrcodeVue from 'qrcode.vue';
import CryptoJS from 'crypto-js';
import { useRuntimeConfig } from '#app';

interface storeInfo {
  storeName: string;
  storeId: number;
  ticketAmount: number;
  isBookmarked: boolean;
}

// 부모 컴포넌트로부터 전달받는 props
const props = defineProps<{
  storeInfo: storeInfo;
  ticketQuantity: number;
  userId: number;
  type: string;
}>();

const config = useRuntimeConfig();

// QR 코드 URL을 동적으로 생성
const qrCodeUrl = computed(() => {
  const data = {
    userId: props.userId,
    storeId: props.storeInfo.storeId,
    ticketQuantity: props.ticketQuantity,
    type: props.type
  }
  const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(data), config.public.qrSecretKey).toString();

  return encryptedData;

});

const typeLabel = computed(() => {
  return props.type === 'usage' ? '사용 개수' : '충전 개수';
});

</script>

<style scoped>
.inline-block {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
