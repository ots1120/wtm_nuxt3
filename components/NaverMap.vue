<template>
  <div
    id="map"
    ref="mapElement"
    class="max-w-lg w-full h-[45rem] relative"
  ></div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useHead, useRuntimeConfig } from '#imports';

const config = useRuntimeConfig();
const clientId = config.public.naverMapClientId;

const mapElement = ref<HTMLElement | null>(null);

useHead({
  script: [
    {
      src: `https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${clientId}&callback=initMap,`,
      async: true,
      defer: true,
    },
  ],
});

onMounted(() => {
  const initMap = () => {
    if (!mapElement.value) return;
    const center: naver.maps.LatLng = new naver.maps.LatLng(
      37.498095,
      127.02761,
    );
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const map = new naver.maps.Map(mapElement.value as HTMLElement, {
      center,
      zoom: 16,
    });
  };

  if ((window as any).naver?.maps) {
    // 'as any'로 타입 단언
    initMap();
  } else {
    window.addEventListener('load', initMap);
  }
});
</script>

<style scoped></style>
