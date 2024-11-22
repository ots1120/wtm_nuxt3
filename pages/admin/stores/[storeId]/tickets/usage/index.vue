<template>
  <div class="container mx-auto p-4">
    <h1 class="text-3xl font-bold mb-6">식권 사용</h1>

    <div class="bg-white shadow-md rounded-lg p-4 max-w-md mx-auto">
      <!-- QR 스캔 버튼 -->
      <div class="mb-4">
        <button
          class="w-full px-4 py-2 bg-[#db3d39] text-white rounded-md hover:bg-[#c22420] focus:outline-none"
          @click="scanQRCode"
        >
          QR 코드 스캔
        </button>
      </div>

      <!-- QrScanner 컴포넌트 -->
      <div
        v-if="isScanning"
        class="w-full aspect-square max-h-64 relative overflow-hidden flex justify-center items-center"
      >
        <QrScanner
          :key="scannerKey"
          :scanner-id="'scanner-usage-' + scannerKey"
          :on-decode="handleQRCodeDecode"
          class="w-full h-full"
        />
      </div>

      <!-- 스캔된 정보 및 승인 상태 표시 -->
      <div
        v-if="decodedData"
        class="mt-4 p-4 bg-gray-100 border border-gray-300 rounded-md"
      >
        <p class="text-gray-700 font-semibold">스캔된 정보 (Recharge):</p>
        <p class="text-gray-600">사용자 ID: {{ decodedData.userId }}</p>
        <p class="text-gray-600">
          사용 수량: {{ decodedData.ticketQuantity }}원
        </p>
      </div>
      <!-- 승인 상태 표시 -->
      <div
        v-if="approvalStatus === 'approved'"
        class="mt-4 p-4 bg-green-100 border border-green-400 rounded-md"
      >
        <p class="text-green-700 font-semibold">승인 완료</p>
        <p class="text-green-600">식권 사용이 승인되었습니다.</p>
      </div>
      <div
        v-else-if="approvalStatus === 'rejected'"
        class="mt-4 p-4 bg-red-100 border border-red-400 rounded-md"
      >
        <p class="text-red-700 font-semibold">승인 거절</p>
        <p class="text-red-600">{{ errorMessage }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRuntimeConfig } from '#app';
import { useRoute } from 'vue-router';
import QrScanner from '~/components/admin/ui/QrScanner.vue';

const route = useRoute();

onBeforeMount(() => {
  route.meta.title = '식권관리';
});

definePageMeta({
  layout: 'admin',
});

interface DecodedData {
  userId: string;
  ticketQuantity: number;
  storeId: number;
  type: string;
}

const config = useRuntimeConfig();
const baseUrl = config.public.baseApiUrl;

const isScanning = ref(false);
const scannerKey = ref(0);

const decodedData = ref<DecodedData | null>(null);
const approvalStatus = ref<'idle' | 'approved' | 'rejected'>('idle');
const errorMessage = ref<string | null>(null);

const storeId = Number(route.params.storeId);

// QR 코드 스캔 시작 함수
const scanQRCode = () => {
  console.log('QR 코드 스캔 시작 (Usage)');
  approvalStatus.value = 'idle';
  errorMessage.value = null;
  decodedData.value = null;
  isScanning.value = true;
};

// QRScanner의 onDecode 이벤트 처리 함수
const handleQRCodeDecode = async (decodedText: string) => {
  console.log('QR 코드 스캔 성공 (Usage):', decodedText);
  isScanning.value = false;

  // QR 데이터 파싱
  try {
    const qrData = JSON.parse(decodedText);
    decodedData.value = {
      userId: qrData.userId,
      ticketQuantity: qrData.ticketQuantity,
      storeId: qrData.storeId,
      type: qrData.type,
    };
  } catch (error) {
    console.error('QR 코드 데이터 파싱 실패 (Usage):', error);
    approvalStatus.value = 'rejected';
    errorMessage.value = 'QR 코드 데이터를 파싱하는 데 실패했습니다.';
    return;
  }

  // Store ID 검증
  if (decodedData.value.storeId !== storeId) {
    console.error(
      `Store ID 불일치 (Usage): QR 코드의 Store ID (${decodedData.value.storeId})와 현재 Store ID (${storeId})가 다릅니다.`,
    );
    approvalStatus.value = 'rejected';
    errorMessage.value = 'QR 코드의 Store ID가 현재 Store와 일치하지 않습니다.';
    return;
  }

  // QR 데이터 type 검증
  if (decodedData.value.type !== 'usage') {
    console.error(
      `QR 타입 불일치 (Usage): 사용 메뉴에서 사용하려면 QR 타입이 'usage'여야 합니다.`,
    );
    approvalStatus.value = 'rejected';
    errorMessage.value = '사용 메뉴에서 사용 가능한 QR 코드가 아닙니다.';
    return;
  }

  // API 요청 데이터 구성
  const requestData = {
    userId: decodedData.value.userId,
    storeId: decodedData.value.storeId,
    ticketQuantity: decodedData.value.ticketQuantity,
    type: decodedData.value.type,
  };

  // API 요청 보내기
  try {
    const response = await fetch(`${baseUrl}/api/v1/admin/ticket/usage`, {
      method: 'POST',
      body: JSON.stringify(requestData),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) throw new Error('API 요청 실패');

    approvalStatus.value = 'approved';
    console.log('Usage 요청 승인됨');
  } catch (error) {
    approvalStatus.value = 'rejected';
    errorMessage.value = '식권 사용 요청이 실패했습니다.';
    console.error('Usage 요청 실패:', error);
  } finally {
    // 스캐너 키 변경하여 재렌더링 유도 (필요 시)
    scannerKey.value += 1;
  }
};
</script>

<style scoped>
/* 추가적인 스타일이 필요하다면 여기에 작성하세요 */
</style>
