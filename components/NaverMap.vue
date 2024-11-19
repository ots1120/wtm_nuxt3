<template>
  <div
    id="map"
    ref="mapElement"
    class="max-w-lg w-full h-[45rem] relative"
  ></div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useHead, useRuntimeConfig } from '#imports';

// 환경 변수에서 네이버 지도 API Client ID 가져오기
const config = useRuntimeConfig();
const clientId = config.public.naverMapClientId;

const mapElement = ref(null);

useHead({
  script: [
    {
      src: `https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${clientId}`,
      async: true,
      defer: true,
    },
  ],
});

onMounted(() => {
  // 사용자 위치를 가져와 지도 중심 설정
  const initMap = (latitude, longitude) => {
    if (!mapElement.value) return;

    const center = new naver.maps.LatLng(latitude, longitude);

    const map = new naver.maps.Map(mapElement.value, {
      center,
      zoom: 16,
    });

    // 필요 시 지도 마커 추가
    new naver.maps.Marker({
      position: center,
      map,
    });

    console.log('지도 생성 완료:', map);
  };

  // 사용자 위치 요청
  const getUserLocation = () => {
    if (!navigator.geolocation) {
      alert('GPS를 지원하지 않는 브라우저입니다.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        initMap(latitude, longitude);
      },
      (error) => {
        console.error('GPS 에러:', error);
        // 기본 위치로 설정 (예: 서울 강남)
        initMap(37.498095, 127.02761);
      },
    );
  };

  // 네이버 지도 API가 로드되었는지 확인
  if (typeof naver !== 'undefined' && naver.maps) {
    getUserLocation();
  } else {
    window.onload = () => {
      if (typeof naver !== 'undefined' && naver.maps) {
        getUserLocation();
      }
    };
  }
});
</script>

<style scoped>
/* 지도 스타일 추가 가능 */
</style>
