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
        <!-- SVG 아이콘 -->
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

        <!-- 선택된 식당 상세 정보 -->
        <div v-if="selectedStore" class="p-4 overflow-y-auto">
          <button
            class="mb-4 px-3 py-1.5 text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-md shadow-md hover:from-blue-600 hover:to-blue-700 transition-all duration-200 ease-in-out transform hover:scale-105"
            @click="clearSelection"
          >
            전체 목록 보기
          </button>
          <!-- 식당 상세 정보 표시 -->
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
              @click.stop="
                attemptToggleBookmark(selectedStore, selectedStoreIndex)
              "
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

        <!-- 식당 목록 -->
        <div
          v-else
          class="overflow-y-auto"
          :style="{ maxHeight: 'calc(100vh - 100px)' }"
        >
          <!-- 로딩 스피너 -->
          <div v-if="isLoading" class="flex justify-center items-center h-full">
            <!-- 스피너 아이콘 -->
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

          <!-- 검색 결과 없음 메시지 -->
          <div
            v-if="!isLoading && filteredStores.length === 0"
            class="m-4 text-center text-gray-500 dark:text-gray-400"
          >
            검색 결과가 없습니다.
          </div>

          <!-- 식당 목록 표시 -->
          <div
            v-for="(store, index) in filteredStores"
            :key="store.storeId"
            :ref="(el) => (storeRefs[store.storeId] = el)"
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
              @click.stop="attemptToggleBookmark(store, index)"
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

    <!-- 북마크 모달 -->
    <BookmarkModal
      v-if="bookmarkModalVisible"
      :visible="bookmarkModalVisible"
      :store-id="selectedStoreIdForBookmark"
      @cancel="closeBookmarkModal"
      @confirm="confirmDelete"
    />

    <!-- 로그인 요청 모달 -->
    <LoginPromptModal
      v-if="loginModalVisible"
      @cancel="closeLoginModal"
      @confirm="redirectToLogin"
    />
  </div>
</template>

<script setup>
// Vue와 Nuxt 관련 함수 및 컴포넌트 임포트
import { ref, computed, watch, nextTick } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useHead, useRuntimeConfig } from '#imports';
import { useAuthStore } from '~/stores/auth'; // Pinia 스토어 임포트
import BookmarkModal from '~/components/user/modal/BookmarkModal.vue';
import LoginPromptModal from '~/components/user/modal/LoginPromptModal.vue';
import SearchBar from '~/components/SearchBar.vue'; // SearchBar 컴포넌트 임포트

// 인증 관련 스토어 사용
const authStore = useAuthStore();
const username = computed(() => authStore.user?.username);
const isAuthenticated = computed(() => authStore.isAuthenticated);

// 런타임 설정 가져오기 (네이버 지도 API 키 등)
const config = useRuntimeConfig();
const clientId = config.public.naverMapClientId;

// 상태 변수들 정의
const mapElement = ref(null); // 지도 엘리먼트 참조
const map = ref(null); // 지도 인스턴스
const markers = ref([]); // 마커 목록
const stores = ref([]); // 식당 목록
const searchText = ref(''); // 검색어
const isSheetOpen = ref(true); // 시트 열림 상태
const sheetHeight = ref('40%'); // 시트 높이
const router = useRouter(); // 라우터
const route = useRoute(); // 현재 경로

let startY = 0;
let currentY = 0;

const selectedStoreId = ref(null); // 선택된 식당 ID
const selectedStore = ref(null); // 선택된 식당 정보
const selectedStoreIndex = ref(null); // 선택된 식당 인덱스
const infoWindow = ref(null); // 정보 창

const storeRefs = ref({}); // 식당 목록 엘리먼트 참조

const isLoading = ref(false); // 로딩 상태

// 필터링된 식당 목록
const filteredStores = computed(() => {
  if (selectedStoreId.value) {
    return stores.value.filter(
      (store) => store.storeId === selectedStoreId.value,
    );
  }
  return stores.value;
});

const currentPosition = ref(null); // 현재 위치
const userMarker = ref(null); // 사용자 위치 마커
const userCircle = ref(null); // 사용자 위치 반경

// 북마크 모달 상태
const bookmarkModalVisible = ref(false);
const selectedStoreIdForBookmark = ref(null);

// 로그인 요청 모달 상태
const loginModalVisible = ref(false);

// 식당 데이터 및 주소 데이터 가져오기
const fetchStores = async () => {
  isLoading.value = true;
  try {
    // 검색어에 따라 API 호출
    const [storesResponse, addressesResponse] = await Promise.all([
      fetch(
        `http://localhost:8080/api/v1/stores${
          searchText.value
            ? `?query=${encodeURIComponent(searchText.value)}`
            : ''
        }`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-Username': username.value || 'default-username', // 헤더에 username 추가
          },
        },
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

    // 주소 데이터를 맵으로 변환
    const addressMap = {};
    addressData.forEach((address) => {
      addressMap[address.storeId] = address;
    });

    // 식당 데이터와 주소 데이터 병합
    const mergedStores = storeData.map((store) => ({
      ...store,
      profilePicture: `http://localhost:8080${store.img}`,
      latitude: addressMap[store.storeId]?.latitude || null,
      longitude: addressMap[store.storeId]?.longitude || null,
      isBookmarked: store.isBookmarked || false,
    }));

    stores.value = mergedStores;

    // 마커 표시
    plotMarkers();
  } catch (error) {
    console.error('Failed to fetch stores or addresses:', error);
    stores.value = [];
    alert('식당 데이터를 불러오는 중 오류가 발생했습니다.');
  } finally {
    isLoading.value = false;
  }
};

// 지도에 마커 표시 및 중심 조정
const plotMarkers = () => {
  if (!map.value) {
    console.error('Map is not initialized.');
    return;
  }

  // 기존 마커 제거
  markers.value.forEach((marker) => marker.setMap(null));
  markers.value = [];

  // 기존 정보 창 닫기
  if (infoWindow.value) {
    infoWindow.value.close();
    infoWindow.value = null;
  }

  // 지도 범위 설정
  const bounds = new naver.maps.LatLngBounds();
  let hasValidStore = false;

  // 식당 목록 순회하여 마커 추가
  stores.value.forEach((store, index) => {
    if (store.latitude && store.longitude) {
      const position = new naver.maps.LatLng(store.latitude, store.longitude);
      const marker = new naver.maps.Marker({
        position,
        map: map.value,
        title: store.name,
      });

      // 마커 클릭 이벤트
      naver.maps.Event.addListener(marker, 'click', () => {
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
      bounds.extend(position);
      hasValidStore = true;
    }
  });

  // 지도 중심 조정
  if (hasValidStore) {
    const storeCount = markers.value.length;
    if (storeCount === 1) {
      map.value.setCenter(markers.value[0].getPosition());
      map.value.setZoom(16);
    } else {
      map.value.fitBounds(bounds);
    }
  } else {
    console.warn('No valid store locations to plot on the map.');
  }
};

// InfoWindow 내용 생성
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

// 선택된 식당으로 스크롤
const scrollToStore = async (storeId) => {
  await nextTick();
  const storeElement = storeRefs.value[storeId];
  if (storeElement) {
    storeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
};

// 네이버 지도 API 스크립트 추가
useHead({
  script: [
    {
      src: `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${clientId}`,
      async: true,
      defer: true,
      onload: () => {
        getUserLocation();
      },
      onerror: () => {
        console.error('네이버 지도 API 로드 실패');
      },
    },
  ],
});

// 현재 위치로 이동
const goToCurrentLocation = () => {
  if (!currentPosition.value || !map.value) {
    alert('현재 위치를 찾을 수 없습니다.');
    return;
  }

  const { latitude, longitude } = currentPosition.value;
  const position = new naver.maps.LatLng(latitude, longitude);

  map.value.setCenter(position);
  map.value.setZoom(16);

  // 사용자 위치 마커 및 원 표시
  if (userMarker.value) {
    userMarker.value.setPosition(position);
  } else {
    userMarker.value = new naver.maps.Marker({
      position,
      map: map.value,
      icon: {
        content: '<div class="user-location-marker"></div>',
        anchor: new naver.maps.Point(12, 12),
      },
    });
  }

  if (userCircle.value) {
    userCircle.value.setCenter(position);
  } else {
    userCircle.value = new naver.maps.Circle({
      map: map.value,
      center: position,
      radius: 100,
      fillColor: 'rgba(51, 136, 255, 0.3)',
      fillOpacity: 0.5,
      strokeColor: '#3388ff',
      strokeWeight: 2,
    });
  }
};

// 사용자 위치 가져오기
const getUserLocation = () => {
  if (!navigator.geolocation) {
    alert('GPS를 지원하지 않는 브라우저입니다.');
    initMap(37.498095, 127.02761);
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      currentPosition.value = { latitude, longitude };
      initMap(latitude, longitude);
    },
    (error) => {
      console.error('GPS 에러:', error);
      initMap(37.498095, 127.02761);
    },
  );
};

// 지도 초기화
const initMap = (latitude, longitude) => {
  if (!mapElement.value) return;

  const center = new naver.maps.LatLng(latitude, longitude);

  map.value = new naver.maps.Map(mapElement.value, {
    center,
    zoom: 16,
  });

  if (currentPosition.value) {
    goToCurrentLocation();
  }

  fetchStores();
};

// 북마크 토글
const toggleBookmark = async (store, index) => {
  try {
    const url = `http://localhost:8080/api/v1/stores/${store.storeId}/bookmark`;
    const method = store.isBookmarked ? 'DELETE' : 'POST';

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'X-Username': username.value || 'default-username',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to toggle bookmark');
    }

    stores.value[index].isBookmarked = !store.isBookmarked;

    if (selectedStoreId.value === store.storeId) {
      selectedStore.value.isBookmarked = stores.value[index].isBookmarked;
    }
  } catch (error) {
    console.error('북마크 요청 중 오류가 발생했습니다:', error);
    alert('북마크를 토글하는 데 실패했습니다.');
  }
};

// 북마크 시도 및 인증 확인
const attemptToggleBookmark = (store, index) => {
  if (isAuthenticated.value) {
    toggleBookmark(store, index);
  } else {
    selectedStoreIdForBookmark.value = store.storeId;
    loginModalVisible.value = true;
  }
};

// 식당 상세 페이지로 이동
const goToStoreDetail = (storeId) => {
  router.push(`/stores/${storeId}/home`);
};

// 터치 이벤트 핸들러
const startTouch = (event) => {
  startY = event.touches[0].clientY;
  currentY = startY;
};

const onTouchMove = (event) => {
  currentY = event.touches[0].clientY;
  const diffY = startY - currentY;

  if (diffY > 0) {
    sheetHeight.value = Math.min(90, 40 + diffY / 5) + '%';
  } else {
    sheetHeight.value = Math.max(20, 40 + diffY / 5) + '%';
  }
};

const endTouch = () => {
  const diffY = startY - currentY;
  if (diffY > 50) {
    sheetHeight.value = '90%';
  } else if (diffY < -50) {
    sheetHeight.value = '20%';
  } else {
    sheetHeight.value = '40%';
  }
};

// 시트 토글
const toggleSheet = () => {
  isSheetOpen.value = !isSheetOpen.value;
};

// 선택된 식당 초기화
const clearSelection = () => {
  selectedStoreId.value = null;
  selectedStore.value = null;
  selectedStoreIndex.value = null;
};

// 페이지 메타 데이터 설정
useHead({
  title: 'Your Page Title',
});

// 선택된 식당 ID 변경 시 스크롤
watch(selectedStoreId, (newStoreId) => {
  if (newStoreId) {
    scrollToStore(newStoreId);
  }
});

// 북마크 모달 열기
const openBookmarkModal = (storeId) => {
  selectedStoreIdForBookmark.value = storeId;
  bookmarkModalVisible.value = true;
};

// 북마크 모달 닫기
const closeBookmarkModal = () => {
  bookmarkModalVisible.value = false;
  selectedStoreIdForBookmark.value = null;
};

// 북마크 삭제 확인
const confirmDelete = async () => {
  if (selectedStoreIdForBookmark.value !== null) {
    const storeIndex = stores.value.findIndex(
      (store) => store.storeId === selectedStoreIdForBookmark.value,
    );
    if (storeIndex !== -1) {
      await toggleBookmark(stores.value[storeIndex], storeIndex);
    }
  }
};

// 로그인 모달 닫기
const closeLoginModal = () => {
  loginModalVisible.value = false;
  selectedStoreIdForBookmark.value = null;
};

// 로그인 페이지로 리디렉션
const redirectToLogin = () => {
  if (process.client) {
    const currentPath = route.fullPath;
    localStorage.setItem('redirectPath', currentPath);
  }
  router.push('/signIn');
};
</script>

<style scoped>
/* 선택된 식당 항목에 대한 하이라이트 스타일 */
.bg-gray-100 {
  background-color: #f3f4f6; /* Tailwind의 gray-100 색상 */
}

.dark .bg-gray-700 {
  background-color: #374151; /* Tailwind의 gray-700 색상 */
}

/* 정보 창 스타일 */
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

/* 사용자 위치 마커 커스터마이징 */
.user-location-marker {
  width: 24px;
  height: 24px;
  background-color: red; /* 빨간색 원 */
  border: 2px solid white;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}
</style>
