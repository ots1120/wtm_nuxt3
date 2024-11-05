<template>
  <div
    class="sliding-panel"
    :style="{ transform: `translateY(${translateY}px)` }"
    @touchstart="onTouchStart"
    @touchmove="onTouchMove"
    @touchend="onTouchEnd"
  >
    <div class="handle"></div>
    <!-- 마커 리스트 -->
    <ul>
      <li v-for="marker in markers" :key="marker.id">
        {{ marker.name }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const markers = ref([
  { id: 1, name: '마커 1' },
  { id: 2, name: '마커 2' },
  // 추가 마커 데이터
]);

const translateY = ref(window.innerHeight * 0.4); // 초기 위치

// 터치 이벤트 변수
let startY = 0;
let currentY = 0;
let isDragging = false;

// 터치 시작
function onTouchStart(event) {
  startY = event.touches[0].clientY;
  isDragging = true;
}

// 터치 이동
function onTouchMove(event) {
  if (!isDragging) return;
  currentY = event.touches[0].clientY;
  const deltaY = currentY - startY;
  translateY.value = Math.max(0, translateY.value + deltaY);
  startY = currentY;
}

// 터치 종료
function onTouchEnd() {
  isDragging = false;
  // 위치 스냅핑 또는 애니메이션 추가 가능
}
</script>
<style scoped>
.sliding-panel {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 80%;
  background-color: white;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  transition: transform 0.3s ease;
  will-change: transform;
}

.handle {
  width: 40px;
  height: 5px;
  background-color: #ccc;
  border-radius: 2.5px;
  margin: 10px auto;
}
</style>
