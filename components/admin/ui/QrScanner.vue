<!-- QrScanner.vue -->
<template>
  <div>
    <div :id="scannerId" style="width: 500px"></div>
    <p v-if="decodedText">{{ decodedText }}</p>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { Html5Qrcode } from 'html5-qrcode';

// Props 정의
const props = defineProps<{
  onDecode: (decodedText: string) => void; // 스캔된 데이터를 부모 컴포넌트로 전달
  scannerId: string; // QRScanner 고유 ID
}>();

// Reactive 상태
const decodedText = ref<string | null>(null);
let html5Qrcode: Html5Qrcode | null = null;

// QR 스캐너 성공 콜백
const onDecodeSuccess = (decodedTextValue: string) => {
  console.log(`QR 스캔 성공: ${decodedTextValue}`);
  decodedText.value = decodedTextValue;
  props.onDecode(decodedTextValue); // 부모 컴포넌트에 데이터 전달
  stopScanner(); // 데이터 처리 후 자동으로 스캐너 종료
};

// QR 스캐너 시작 및 중지
const startScanner = () => {
  if (!props.scannerId) {
    console.error('scannerId prop이 필요합니다.');
    return;
  }
  console.log(`Starting scanner with ID: ${props.scannerId}`);
  html5Qrcode = new Html5Qrcode(props.scannerId);
  html5Qrcode
    .start(
      { facingMode: 'environment' }, // 카메라 설정
      { fps: 10, qrbox: 250 }, // 설정값
      onDecodeSuccess, // 성공 콜백
      (errorMessage) => {
        console.warn(`QR 인식 오류: ${errorMessage}`); // 에러 처리
      },
    )
    .catch((err) => {
      console.error(`QR 스캐너 시작 실패: ${err}`);
    });
};

const stopScanner = async () => {
  if (html5Qrcode) {
    try {
      await html5Qrcode.stop(); // 스캐너 종료
      await html5Qrcode.clear(); // DOM 정리
      html5Qrcode = null; // 객체 초기화
      console.log(`Scanner with ID: ${props.scannerId} stopped.`);
    } catch (err) {
      console.error('QR 스캐너 종료 실패:', err);
    }
  }
};

// Lifecycle Hooks
onMounted(() => {
  startScanner();
});

onBeforeUnmount(() => {
  stopScanner();
});
</script>

<style scoped>
/* 필요에 따라 스타일 추가 */
</style>
