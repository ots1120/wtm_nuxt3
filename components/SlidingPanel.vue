<template>
  <div
    class="sliding-panel"
    :style="{ transform: `translateY(${translateY}px)` }"
    @touchstart="onTouchStart"
    @touchmove="onTouchMove"
    @touchend="onTouchEnd"
    @mousedown="startDrag"
    @mousemove="onDrag"
    @mouseup="endDrag"
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
import { ref, onMounted } from 'vue';

const translateY = ref(0); // 초기 값은 0으로 설정하고 onMounted에서 실제 높이로 설정
const targetTranslateY = ref(0);

let startY = 0;
let isDragging = false;
let animationFrameId = null;

// 마운트 시에만 window.innerHeight 사용
onMounted(() => {
  translateY.value = window.innerHeight * 0.5; // 화면의 절반 위치로 설정
  targetTranslateY.value = translateY.value;
});

// 마우스 및 터치 이벤트 시작
function startDrag(event) {
  isDragging = true;
  startY = event.touches ? event.touches[0].clientY : event.clientY;

  document.addEventListener('mousemove', onDrag);
  document.addEventListener('mouseup', endDrag);
}

// 마우스 및 터치 이동 중
function onDrag(event) {
  if (!isDragging) return;

  const currentY = event.touches ? event.touches[0].clientY : event.clientY;
  const deltaY = currentY - startY;

  targetTranslateY.value = Math.max(0, translateY.value + deltaY);
  startY = currentY;

  if (!animationFrameId) animate();
}

// 애니메이션 함수
function animate() {
  const distance = targetTranslateY.value - translateY.value;
  translateY.value += distance * 0.2;

  if (Math.abs(distance) > 0.5) {
    animationFrameId = requestAnimationFrame(animate);
  } else {
    translateY.value = targetTranslateY.value;
    animationFrameId = null;
  }
}

// 마우스 및 터치 이벤트 종료
function endDrag() {
  isDragging = false;

  document.removeEventListener('mousemove', onDrag);
  document.removeEventListener('mouseup', endDrag);

  if (targetTranslateY.value < window.innerHeight * 0.25) {
    targetTranslateY.value = 0;
  } else {
    targetTranslateY.value = window.innerHeight * 0.5;
  }

  if (!animationFrameId) animate();
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
