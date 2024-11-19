<!-- TicketUsage.vue -->
<template>
  <div class="container mx-auto p-4">
    <h1 class="text-3xl font-bold mb-6">식권 사용</h1>

    <div class="bg-white shadow-md rounded-lg p-4">
      <!-- 식권 종류 선택 드롭다운 -->
      <div class="mb-4">
        <label for="usageTicket" class="block text-sm font-medium text-gray-600"
          >식권 종류</label
        >
        <select
          v-model="selectedTicketId"
          class="w-full mt-1 px-4 py-2 border rounded-md focus:ring focus:ring-blue-200"
        >
          <option disabled hidden :value="null">식권 선택</option>
          <option
            v-for="ticket in ticketItems"
            :key="ticket.id"
            :value="ticket.id"
          >
            {{ ticket.name }}
          </option>
        </select>
      </div>

      <!-- QR 스캔 버튼 -->
      <div class="mb-4">
        <button
          class="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
          :disabled="!selectedTicketId"
          @click="scanQRCode"
        >
          QR 코드 스캔
        </button>
      </div>

      <!-- QrScanner 컴포넌트 -->
      <QrScanner
        v-if="isScanning"
        :key="scannerKey"
        :scanner-id="'scanner-usage-' + scannerKey"
        :on-decode="handleQRCodeDecode"
      />

      <!-- 스캔된 정보 및 승인 상태 표시 -->
      <div
        v-if="decodedData"
        class="mt-4 p-4 bg-gray-100 border border-gray-300 rounded-md"
      >
        <p class="text-gray-700 font-semibold">스캔된 정보 (Usage):</p>
        <p class="text-gray-600">사용자 ID: {{ decodedData.userId }}</p>
        <p class="text-gray-600">
          식권 금액: {{ decodedData.ticketQuantity }}원
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

interface TicketItem {
  id: number;
  name: string;
  price: number;
  categoryId: number;
}

interface DecodedData {
  userId: string;
  ticketQuantity: number;
  storeId: number;
  type: string;
}

const config = useRuntimeConfig();
const baseUrl = config.public.baseApiUrl;

const ticketItems = ref<TicketItem[]>([]);
const selectedTicketId = ref<number | null>(null);
const isScanning = ref(false);
const scannerKey = ref(0);

const decodedData = ref<DecodedData | null>(null);
const approvalStatus = ref<'idle' | 'approved' | 'rejected'>('idle');
const errorMessage = ref<string | null>(null);
const storeId = 1;

// 티켓 데이터 가져오기
const fetchTickets = async () => {
  try {
    const response = await fetch(
      `${baseUrl}/api/v1/admin/stores/${storeId}/tickets`,
    );
    if (!response.ok) {
      throw new Error('Failed to fetch tickets');
    }
    ticketItems.value = await response.json();
    console.log(ticketItems.value);
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error('Unknown error:', error);
    }
  }
};

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

  // 선택된 식권 ID 확인
  if (!selectedTicketId.value) {
    console.error('식권이 선택되지 않았습니다. (Usage)');
    approvalStatus.value = 'rejected';
    errorMessage.value = '식권이 선택되지 않았습니다.';
    return;
  }

  // API 요청 데이터 구성
  const requestData = {
    userId: decodedData.value.userId,
    storeId: decodedData.value.storeId,
    ticketId: selectedTicketId.value,
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

// 초기 데이터 로드
fetchTickets();
</script>

<style scoped>
/* 추가적인 스타일이 필요하다면 여기에 작성하세요 */
</style>
