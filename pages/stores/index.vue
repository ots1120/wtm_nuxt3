<template>
  <div class="relative w-full h-screen bg-white dark:bg-gray-900">
    <!-- 네이버 지도 컨테이너 -->
    <div id="map" ref="mapElement" class="w-full h-full">
      <!-- 현재 위치로 돌아가는 버튼 -->
      <button
        class="absolute top-24 left-4 z-10 bg-white dark:bg-gray-800 p-3 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
        aria-label="현재 위치로 이동"
        @click="goToCurrentLocation"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6 text-blue-500 dark:text-blue-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="4" />
          <line x1="12" y1="2" x2="12" y2="6" />
          <line x1="12" y1="18" x2="12" y2="22" />
          <line x1="2" y1="12" x2="6" y2="12" />
          <line x1="18" y1="12" x2="22" y2="12" />
        </svg>
      </button>
    </div>

    <!-- 검색 바 컴포넌트 -->
    <div
      class="absolute top-4 left-1/2 transform -translate-x-1/2 z-20 w-11/12 max-w-md"
    >
      <SearchBar
        v-model="searchText"
        placeholder="먹고 싶은 메뉴나 가게를 찾아보세요"
        class="bg-white dark:bg-gray-800 rounded-full shadow-lg px-4 py-0.1"
        @search="fetchStores"
      />
    </div>

    <!-- 하단 시트: 식당 목록 또는 선택된 식당 상세 표시 -->
    <transition name="slide-up">
      <div
        v-if="isSheetOpen"
        class="fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 rounded-t-lg shadow-lg overflow-hidden transition-all duration-300 w-full max-w-lg z-30"
        :style="{ height: selectedStore ? '30%' : sheetHeight }"
        @touchstart="startTouch"
        @touchmove="onTouchMove"
        @touchend="endTouch"
      >
        <!-- 드래그 핸들 영역 -->
        <div
          class="h-8 bg-gray-200 dark:bg-gray-700 flex justify-center items-center cursor-pointer"
          @click="toggleSheet"
        >
          <span
            class="w-12 h-1 bg-gray-400 dark:bg-gray-500 rounded-full"
          ></span>
        </div>

        <!-- 선택된 식당이 있을 때 상세 정보 표시 -->
        <div v-if="selectedStore" class="p-4 overflow-y-auto">
          <button
            class="mb-4 px-3 py-1.5 text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-md shadow-md hover:from-blue-600 hover:to-blue-700 transition-all duration-200 ease-in-out transform hover:scale-105"
            @click="clearSelection"
          >
            전체 목록 보기
          </button>
          <div
            class="flex items-start space-x-4 border-b border-gray-200 dark:border-gray-700 pb-4"
          >
            <!-- 식당 이미지 섹션 -->
            <div
              class="bg-gray-200 dark:bg-gray-700 w-24 h-24 rounded-lg overflow-hidden"
            >
              <img
                :src="selectedStore.profilePicture"
                alt="Store Image"
                class="w-full h-full object-cover"
                loading="lazy"
              />
            </div>

            <!-- 식당 정보 섹션 -->
            <div class="flex-1">
              <h2
                class="text-lg md:text-xl font-semibold text-gray-800 dark:text-gray-200"
              >
                {{ selectedStore.name }}
                <span class="text-yellow-500"
                  >⭐ {{ selectedStore.rating }}</span
                >
              </h2>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                운영시간 : {{ selectedStore.operatingHours }}
              </p>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                가격 : {{ selectedStore.price }}원
              </p>
              <button
                class="mt-2 px-4 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
                @click="goToStoreDetail(selectedStore.storeId)"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
                <span>상세 보기</span>
              </button>
            </div>

            <!-- 북마크 버튼 -->
            <button
              class="p-2 text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200 rounded-full"
              aria-label="북마크 토글"
              @click.stop="toggleBookmark(selectedStore, selectedStoreIndex)"
            >
              <svg
                v-if="selectedStore.isBookmarked"
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6 text-blue-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M5 3a2 2 0 00-2 2v12l7-5 7 5V5a2 2 0 00-2-2H5z" />
              </svg>
              <svg
                v-else
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6 text-gray-400 dark:text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 3a2 2 0 00-2 2v12l7-5 7 5V5a2 2 0 00-2-2H5z"
                />
              </svg>
            </button>
          </div>
        </div>

        <!-- 식당 목록 섹션 -->
        <div
          v-else
          class="overflow-y-auto"
          :style="{ maxHeight: 'calc(100vh - 100px)' }"
        >
          <!-- 로딩 스피너 -->
          <div v-if="isLoading" class="flex justify-center items-center h-full">
            <svg
              class="animate-spin h-8 w-8 text-blue-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              />
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
              />
            </svg>
          </div>

          <!-- 검색 결과가 없을 때 표시되는 메시지 -->
          <div
            v-if="!isLoading && filteredStores.length === 0"
            class="m-4 text-center text-gray-500 dark:text-gray-400"
          >
            검색 결과가 없습니다.
          </div>

          <!-- `filteredStores` 배열을 순회하며 각 식당을 표시 -->
          <div
            v-for="(store, index) in filteredStores"
            :key="store.storeId"
            ref="el => storeRefs.value[store.storeId] = el"
            class="m-3 flex items-start space-x-4 border-b border-gray-200 dark:border-gray-700 pb-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            :class="{
              'bg-gray-100 dark:bg-gray-700': store.storeId === selectedStoreId,
            }"
            tabindex="0"
            @click="goToStoreDetail(store.storeId)"
            @keyup.enter="goToStoreDetail(store.storeId)"
          >
            <!-- 식당 이미지 섹션 -->
            <div
              class="bg-gray-200 dark:bg-gray-700 w-16 h-16 rounded-lg overflow-hidden"
            >
              <img
                :src="store.profilePicture"
                alt="Store Image"
                class="w-full h-full object-cover"
                loading="lazy"
              />
            </div>

            <!-- 식당 정보 섹션 -->
            <div class="flex-1">
              <h2
                class="text-base md:text-lg font-semibold text-gray-800 dark:text-gray-200"
              >
                {{ store.name }}
                <span class="text-yellow-500">⭐ {{ store.rating }}</span>
              </h2>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                운영시간 : {{ store.operatingHours }}
              </p>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                가격 : {{ store.price }}원
              </p>
            </div>

            <!-- 북마크 버튼 -->
            <button
              class="p-2 text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200"
              aria-label="북마크 토글"
              @click.stop="toggleBookmark(store, index)"
            >
              <svg
                v-if="store.isBookmarked"
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6 text-blue-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M5 3a2 2 0 00-2 2v12l7-5 7 5V5a2 2 0 00-2-2H5z" />
              </svg>
              <svg
                v-else
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6 text-gray-400 dark:text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 3a2 2 0 00-2 2v12l7-5 7 5V5a2 2 0 00-2-2H5z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useHead, useRuntimeConfig } from '#imports';

// 런타임 설정을 사용하여 네이버 지도 클라이언트 ID를 가져옵니다.
const config = useRuntimeConfig();
const clientId = config.public.naverMapClientId;

// 지도 요소 참조 및 지도 인스턴스, 마커 목록, 식당 목록, 검색어 상태 등을 정의합니다.
const mapElement = ref(null);
const map = ref(null); // 지도 인스턴스를 저장할 ref
const markers = ref([]); // 마커 인스턴스를 저장할 ref
const stores = ref([]); // 식당 목록을 저장할 ref
const searchText = ref(''); // 검색어를 저장할 ref
const isSheetOpen = ref(true); // 시트의 열림 상태를 저장할 ref
const sheetHeight = ref('40%'); // 시트의 높이를 저장할 ref
const router = useRouter(); // 라우터 사용을 위한 변수

// 터치 이벤트 처리를 위한 변수들
let startY = 0;
let currentY = 0;

// 선택된 식당 ID 및 정보 창을 추적하기 위한 변수
const selectedStoreId = ref(null);
const selectedStore = ref(null);
const selectedStoreIndex = ref(null);
const infoWindow = ref(null);

// 식당 목록의 각 항목에 대한 참조를 저장하기 위한 객체
const storeRefs = ref({});

// 로딩 상태
const isLoading = ref(false);

// 필터링된 식당 목록을 계산하는 computed 속성
const filteredStores = computed(() => {
  if (selectedStoreId.value) {
    return stores.value.filter(
      (store) => store.storeId === selectedStoreId.value,
    );
  }
  return stores.value;
});

// 현재 위치 관련 변수
const currentPosition = ref(null); // 사용자의 현재 위치를 저장할 ref
const userMarker = ref(null); // 사용자의 위치를 표시할 마커
const userCircle = ref(null); // 사용자 위치 반경을 표시할 원

// 식당 데이터와 주소 데이터를 가져오는 함수
const fetchStores = async () => {
  isLoading.value = true;
  try {
    // 검색어가 있을 경우 쿼리 파라미터로 추가하여 식당 데이터를 가져옵니다.
    const [storesResponse, addressesResponse] = await Promise.all([
      fetch(
        `http://localhost:8080/api/v1/stores${searchText.value ? `?query=${encodeURIComponent(searchText.value)}` : ''}`,
      ),
      fetch('http://localhost:8080/api/v1/stores/address'),
    ]);

    if (!storesResponse.ok) {
      throw new Error('Failed to fetch stores');
    }

    if (!addressesResponse.ok) {
      throw new Error('Failed to fetch store addresses');
    }

    const storeData = await storesResponse.json();
    const addressData = await addressesResponse.json();
    console.log('Address Data:', addressData);

    // storeId를 기준으로 주소 데이터를 빠르게 조회할 수 있도록 맵을 생성합니다.
    const addressMap = {};
    addressData.forEach((address) => {
      addressMap[address.storeId] = address;
    });

    // 식당 데이터와 주소 데이터를 병합합니다.
    const mergedStores = storeData.map((store) => ({
      ...store,
      profilePicture: `http://localhost:8080${store.img}`,
      latitude: addressMap[store.storeId]?.latitude || null,
      longitude: addressMap[store.storeId]?.longitude || null,
      isBookmarked: store.isBookmarked || false, // 북마크 상태 초기화
    }));

    stores.value = mergedStores;
    console.log('Merged Stores:', stores.value);

    // 지도의 마커를 업데이트합니다.
    plotMarkers();
  } catch (error) {
    console.error('Failed to fetch stores or addresses:', error);
    stores.value = [];
    // 오류 발생 시 사용자에게 알릴 수 있습니다.
    alert('식당 데이터를 불러오는 중 오류가 발생했습니다.');
  } finally {
    isLoading.value = false;
  }
};

// 지도에 마커를 표시하고 지도의 중심을 조정하는 함수
const plotMarkers = () => {
  if (!map.value) {
    console.error('Map is not initialized.');
    return;
  }

  // 기존 마커를 모두 제거합니다.
  markers.value.forEach((marker) => marker.setMap(null));
  markers.value = [];

  // 기존 정보 창을 닫습니다.
  if (infoWindow.value) {
    infoWindow.value.close();
    infoWindow.value = null;
  }

  // 지도 범위를 설정하기 위한 LatLngBounds 객체 생성
  const bounds = new naver.maps.LatLngBounds();
  let hasValidStore = false;

  // 식당 목록을 순회하며 마커를 추가하고, 범위에 위치를 추가합니다.
  stores.value.forEach((store, index) => {
    if (store.latitude && store.longitude) {
      console.log(
        `Adding marker for store: ${store.name} at (${store.latitude}, ${store.longitude})`,
      );
      const position = new naver.maps.LatLng(store.latitude, store.longitude);
      const marker = new naver.maps.Marker({
        position,
        map: map.value,
        title: store.name,
      });

      // 마커 클릭 시 상세 정보 표시
      naver.maps.Event.addListener(marker, 'click', () => {
        console.log(`${store.name} 마커 클릭됨`);
        selectedStoreId.value = store.storeId;
        selectedStore.value = store;
        selectedStoreIndex.value = index;

        if (infoWindow.value) {
          infoWindow.value.close();
        }

        infoWindow.value = new naver.maps.InfoWindow({
          content: generateInfoWindowContent(store),
          anchorSize: new naver.maps.Size(30, 30),
          anchorSkew: true,
          borderWidth: 1,
          disableAnchor: true,
          pixelOffset: new naver.maps.Point(0, -30),
        });
        infoWindow.value.open(map.value, marker);

        if (!isSheetOpen.value) {
          isSheetOpen.value = true;
        }

        scrollToStore(store.storeId);
      });

      markers.value.push(marker);
      bounds.extend(position); // 범위에 위치 추가
      hasValidStore = true;
    }
  });

  // 지도의 중심을 조정합니다.
  if (hasValidStore) {
    const storeCount = markers.value.length;
    if (storeCount === 1) {
      // 식당이 하나인 경우 해당 위치로 중심 이동 및 줌 설정
      map.value.setCenter(markers.value[0].getPosition());
      map.value.setZoom(16);
      console.log('Map centered to single store location.');
    } else {
      // 여러 식당이 있는 경우 모든 마커를 포함하는 범위로 지도 맞추기
      map.value.fitBounds(bounds);
      console.log('Map bounds adjusted to include all store locations.');
    }
  } else {
    console.warn('No valid store locations to plot on the map.');
  }
};

// InfoWindow의 콘텐츠를 생성하는 함수
const generateInfoWindowContent = (store) => {
  return `
    <div class="info-window p-2 rounded-lg shadow-lg bg-white dark:bg-gray-800" style="width: 200px;">
      <div class="flex items-center space-x-2">
        <img src="${store.profilePicture}" alt="${store.name}" class="w-12 h-12 rounded-full object-cover">
        <div>
          <h3 class="text-sm font-semibold text-gray-800 dark:text-gray-200">${store.name}</h3>
          <p class="text-xs text-yellow-500">⭐ ${store.rating}</p>
        </div>
      </div>
      <div class="mt-2">
        <p class="text-xs text-gray-600 dark:text-gray-400">운영시간: ${store.operatingHours}</p>
        <p class="text-xs text-gray-600 dark:text-gray-400">가격: ${store.price}원</p>
      </div>
    </div>
  `;
};

// 선택된 식당을 목록에서 하이라이트하고 스크롤하는 함수
const scrollToStore = async (storeId) => {
  await nextTick(); // DOM 업데이트를 기다립니다.
  const storeElement = storeRefs.value[storeId];
  if (storeElement) {
    storeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
};

// 네이버 지도 API 스크립트를 헤드에 추가합니다.
useHead({
  script: [
    {
      src: `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${clientId}`,
      async: true,
      defer: true,
      onload: () => {
        console.log('네이버 지도 API 로드 완료');
        getUserLocation();
      },
      onerror: () => {
        console.error('네이버 지도 API 로드 실패');
      },
    },
  ],
});

// 현재 위치로 이동하는 함수
const goToCurrentLocation = () => {
  console.log('goToCurrentLocation 함수 호출됨');
  if (!currentPosition.value || !map.value) {
    alert('현재 위치를 찾을 수 없습니다.');
    return;
  }

  const { latitude, longitude } = currentPosition.value;
  const position = new naver.maps.LatLng(latitude, longitude);

  // 지도 중심 이동
  map.value.setCenter(position);
  map.value.setZoom(16);

  // 사용자 위치 마커 표시
  if (userMarker.value) {
    userMarker.value.setPosition(position);
    console.log('기존 userMarker 업데이트');
  } else {
    userMarker.value = new naver.maps.Marker({
      position,
      map: map.value,
      icon: {
        content: '<div class="user-location-marker"></div>',
        anchor: new naver.maps.Point(12, 12),
      },
    });
    console.log('새로운 userMarker 생성');
  }

  // 사용자 위치 반경 표시
  if (userCircle.value) {
    userCircle.value.setCenter(position);
    console.log('기존 userCircle 업데이트');
  } else {
    userCircle.value = new naver.maps.Circle({
      map: map.value,
      center: position,
      radius: 100, // 반경 100m로 증가
      fillColor: 'rgba(51, 136, 255, 0.3)', // 반투명 파란색
      fillOpacity: 0.5,
      strokeColor: '#3388ff',
      strokeWeight: 2,
    });
    console.log('새로운 userCircle 생성');
  }
};

// 현재 위치를 가져오는 함수
const getUserLocation = () => {
  if (!navigator.geolocation) {
    alert('GPS를 지원하지 않는 브라우저입니다.');
    // 기본 위치로 지도를 초기화합니다.
    initMap(37.498095, 127.02761);
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      currentPosition.value = { latitude, longitude };
      console.log('사용자 위치 가져옴:', currentPosition.value);
      initMap(latitude, longitude);
    },
    (error) => {
      console.error('GPS 에러:', error);
      // 위치를 가져오지 못할 경우 기본 위치로 지도를 초기화합니다.
      initMap(37.498095, 127.02761);
    },
  );
};

// 지도를 초기화하는 함수
const initMap = (latitude, longitude) => {
  if (!mapElement.value) return;

  const center = new naver.maps.LatLng(latitude, longitude);

  // 네이버 지도 인스턴스를 생성합니다.
  map.value = new naver.maps.Map(mapElement.value, {
    center,
    zoom: 16,
  });

  console.log('지도 생성 완료:', map.value);

  // 사용자 위치 마커 및 원 표시
  if (currentPosition.value) {
    goToCurrentLocation();
  }

  // 지도를 초기화한 후 식당 데이터를 가져옵니다.
  fetchStores();
};

// 북마크 상태를 토글하는 함수
const toggleBookmark = async (store, index) => {
  try {
    const url = `http://localhost:8080/api/v1/stores/${store.storeId}/bookmark`;
    const method = store.isBookmarked ? 'DELETE' : 'POST';

    const response = await fetch(url, { method });

    if (!response.ok) {
      throw new Error('Failed to toggle bookmark');
    }

    // 북마크 상태를 반전시킵니다.
    stores.value[index].isBookmarked = !store.isBookmarked;
    console.log(
      store.isBookmarked
        ? '북마크가 추가되었습니다.'
        : '북마크가 삭제되었습니다.',
    );

    // 선택된 식당일 경우 업데이트
    if (selectedStoreId.value === store.storeId) {
      selectedStore.value.isBookmarked = stores.value[index].isBookmarked;
    }
  } catch (error) {
    console.error('북마크 요청 중 오류가 발생했습니다:', error);
    // 오류 발생 시 사용자에게 알릴 수 있습니다.
    alert('북마크를 변경하는 중 오류가 발생했습니다.');
  }
};

// 식당 상세 페이지로 이동하는 함수
const goToStoreDetail = (storeId) => {
  router.push(`/stores/${storeId}/home`);
};

// 터치 시작 시 호출되는 함수
const startTouch = (event) => {
  startY = event.touches[0].clientY;
  currentY = startY;
};

// 터치 이동 시 호출되는 함수
const onTouchMove = (event) => {
  currentY = event.touches[0].clientY;
  const diffY = startY - currentY;

  if (diffY > 0) {
    // 시트를 확장합니다. 최대 90%
    sheetHeight.value = Math.min(90, 40 + diffY / 5) + '%';
  } else {
    // 시트를 축소합니다. 최소 20%
    sheetHeight.value = Math.max(20, 40 + diffY / 5) + '%';
  }
};

// 터치 종료 시 호출되는 함수
const endTouch = () => {
  const diffY = startY - currentY;
  if (diffY > 50) {
    // 시트를 최대화
    sheetHeight.value = '90%';
  } else if (diffY < -50) {
    // 시트를 최소화
    sheetHeight.value = '20%';
  } else {
    // 시트를 기본 크기로 되돌림
    sheetHeight.value = '40%';
  }
};

// 시트의 열림 상태를 토글하는 함수
const toggleSheet = () => {
  isSheetOpen.value = !isSheetOpen.value;
};

// 선택된 식당을 초기화하는 함수
const clearSelection = () => {
  selectedStoreId.value = null;
  selectedStore.value = null;
  selectedStoreIndex.value = null;
};

// 페이지 메타 데이터를 정의합니다.
definePageMeta({ layout: 'search' });

// Watcher: 선택된 식당 ID가 변경되면 목록에서 해당 식당을 하이라이트하고 스크롤합니다.
watch(selectedStoreId, (newStoreId) => {
  if (newStoreId) {
    scrollToStore(newStoreId);
  }
});
</script>

<style scoped>
/* 선택된 식당 항목에 대한 하이라이트 스타일 */
.bg-gray-100 {
  background-color: #f3f4f6; /* Tailwind의 gray-100 색상 */
}

.dark .bg-gray-700 {
  background-color: #374151; /* Tailwind의 gray-700 색상 */
}

.info-window {
  font-family: 'Arial', sans-serif;
}

.info-window h3 {
  margin: 0;
}

.info-window p {
  margin: 2px 0;
}

/* 사용자 위치 마커 스타일 */
.user-location-marker {
  width: 24px;
  height: 24px;
  background-color: red; /* 빨간색 원 */
  border: 2px solid white;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

/* 애니메이션: 시트 슬라이드 업/다운 */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
}

/* 다크 모드 */
.dark .text-gray-800 {
  color: #f3f4f6; /* Tailwind의 gray-100 */
}

.dark .text-gray-600 {
  color: #9ca3af; /* Tailwind의 gray-400 */
}

.dark .text-gray-500 {
  color: #6b7280; /* Tailwind의 gray-500 */
}

.dark .text-blue-500 {
  color: #60a5fa; /* Tailwind의 blue-400 */
}

.dark .text-blue-400 {
  color: #93c5fd; /* Tailwind의 blue-300 */
}

.dark .hover\:bg-gray-700:hover {
  background-color: #4b5563; /* Tailwind의 gray-700 */
}

.dark .border-gray-700 {
  border-color: #374151; /* Tailwind의 gray-700 */
}
</style>
