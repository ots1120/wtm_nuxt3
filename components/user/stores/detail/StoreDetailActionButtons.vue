<template>
  <div class="w-full">
    <div class="flex justify-evenly border-b-2 p-1 text-center text-xs w-full">
      <div>
        <button @click="navigateToPath">
          <svg
            class="w-9"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="SVGRepo_bgCarrier" stroke-width="0" />
            <g
              id="SVGRepo_tracerCarrier"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <g id="SVGRepo_iconCarrier">
              <path
                d="M6.14214 6.14214C8.90356 3.38071 10.2843 2 12 2C13.7157 2 15.0964 3.38071 17.8579 6.14214C20.6193 8.90356 22 10.2843 22 12C22 13.7157 20.6193 15.0964 17.8579 17.8579C15.0964 20.6193 13.7157 22 12 22C10.2843 22 8.90356 20.6193 6.14214 17.8579C3.38071 15.0964 2 13.7157 2 12C2 10.2843 3.38071 8.90356 6.14214 6.14214Z"
                stroke="#1C274C"
                stroke-width="1.5"
              />
              <path
                d="M16 11.5L13.3333 9M16 11.5L13.3333 14M16 11.5L10.6667 11.5C9.77778 11.5 8 12 8 14"
                stroke="#1C274C"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </g>
          </svg>
          경로
        </button>
      </div>

      <div>
        <button @click="saveAction">
          <svg
            class="w-9"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="SVGRepo_bgCarrier" stroke-width="0" />
            <g
              id="SVGRepo_tracerCarrier"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <g id="SVGRepo_iconCarrier">
              <path
                d="M5 6.2C5 5.07989 5 4.51984 5.21799 4.09202C5.40973 3.71569 5.71569 3.40973 6.09202 3.21799C6.51984 3 7.07989 3 8.2 3H15.8C16.9201 3 17.4802 3 17.908 3.21799C18.2843 3.40973 18.5903 3.71569 18.782 4.09202C19 4.51984 19 5.07989 19 6.2V21L12 16L5 21V6.2Z"
                :stroke="isBookmarked ? '#1C274C' : '#000000'"
                stroke-width="2"
                stroke-linejoin="round"
                :fill="isBookmarked ? '#1C274C' : 'none'"
              />
            </g>
          </svg>
          저장
        </button>
      </div>

      <div>
        <button @click="shareContent">
          <svg
            class="w-9"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="SVGRepo_bgCarrier" stroke-width="0" />
            <g
              id="SVGRepo_tracerCarrier"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <g id="SVGRepo_iconCarrier">
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M16.5 2.25C14.7051 2.25 13.25 3.70507 13.25 5.5C13.25 5.69591 13.2673 5.88776 13.3006 6.07412L8.56991 9.38558C8.54587 9.4024 8.52312 9.42038 8.50168 9.43939C7.94993 9.00747 7.25503 8.75 6.5 8.75C4.70507 8.75 3.25 10.2051 3.25 12C3.25 13.7949 4.70507 15.25 6.5 15.25C7.25503 15.25 7.94993 14.9925 8.50168 14.5606C8.52312 14.5796 8.54587 14.5976 8.56991 14.6144L13.3006 17.9259C13.2673 18.1122 13.25 18.3041 13.25 18.5C13.25 20.2949 14.7051 21.75 16.5 21.75C18.2949 21.75 19.75 20.2949 19.75 18.5C19.75 16.7051 18.2949 15.25 16.5 15.25C15.4472 15.25 14.5113 15.7506 13.9174 16.5267L9.43806 13.3911C9.63809 12.9694 9.75 12.4978 9.75 12C9.75 11.5022 9.63809 11.0306 9.43806 10.6089L13.9174 7.4733C14.5113 8.24942 15.4472 8.75 16.5 8.75C18.2949 8.75 19.75 7.29493 19.75 5.5C19.75 3.70507 18.2949 2.25 16.5 2.25ZM14.75 5.5C14.75 4.5335 15.5335 3.75 16.5 3.75C17.4665 3.75 18.25 4.5335 18.25 5.5C18.25 6.4665 17.4665 7.25 16.5 7.25C15.5335 7.25 14.75 6.4665 14.75 5.5ZM6.5 10.25C5.5335 10.25 4.75 11.0335 4.75 12C4.75 12.9665 5.5335 13.75 6.5 13.75C7.4665 13.75 8.25 12.9665 8.25 12C8.25 11.0335 7.4665 10.25 6.5 10.25ZM16.5 16.75C15.5335 16.75 14.75 17.5335 14.75 18.5C14.75 19.4665 15.5335 20.25 16.5 20.25C17.4665 20.25 18.25 19.4665 18.25 18.5C18.25 17.5335 17.4665 16.75 16.5 16.75Z"
                fill="#1C274C"
              />
            </g>
          </svg>
          공유
        </button>
      </div>
    </div>

    <!-- Bookmark Modal -->
    <BookmarkModal
      v-if="bookmarkModalVisible"
      :visible="bookmarkModalVisible"
      :store-id="selectedStoreId"
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

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import BookmarkModal from '~/components/user/modal/BookmarkModal.vue';
import LoginPromptModal from '~/components/user/modal/LoginPromptModal.vue';
import { useAuthStore } from '~/stores/auth'; // Pinia 스토어 임포트

// 라우터 및 라우트 인스턴스
const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

// Pinia에서 username과 인증 상태 가져오기
const username = computed(() => authStore.user?.username);
const isAuthenticated = computed(() => authStore.isAuthenticated);

// 북마크 모달 상태
const bookmarkModalVisible = ref(false);
const selectedStoreId = ref<number | null>(null);

// 로그인 요청 모달 상태
const loginModalVisible = ref(false);

// 현재 북마크 상태
const isBookmarked = ref(false);

// 스토어 ID 가져오기
const storeId = Number(route.params.storeId);

// 현재 북마크 상태 조회 함수
const fetchBookmarkStatus = async () => {
  try {
    const response = await fetch(
      `http://localhost:8080/api/v1/stores/${storeId}/bookmark`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Username': username.value || 'default-username', // username 기본값 설정
        },
      },
    );

    if (!response.ok) {
      throw new Error('북마크 상태를 가져오는 데 실패했습니다.');
    }

    const data = await response.json();
    isBookmarked.value = data.isBookmarked;
  } catch (error) {
    console.error('북마크 상태 조회 중 오류 발생:', error);
    console.log('북마크 상태를 가져오는 데 문제가 발생했습니다.');
  }
};

// 컴포넌트 마운트 시 북마크 상태 조회
onMounted(() => {
  fetchBookmarkStatus();
});

// 위치 정보 가져오기 함수
function getCurrentPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('사용자의 브라우저에서 위치 정보를 지원하지 않습니다.'));
    } else {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    }
  });
}

// 경로 네비게이션 함수
async function navigateToPath() {
  try {
    // 사용자 위치 가져오기
    const position = await getCurrentPosition();
    const { latitude, longitude } = position.coords;

    // 백엔드 API 호출
    const response = await fetch(
      `http://localhost:8080/api/v1/stores/${storeId}/directions?userLatitude=${latitude}&userLongitude=${longitude}`,
    );

    if (!response.ok) {
      throw new Error('경로 정보를 가져오는 데 실패했습니다.');
    }

    const naverMapsUrl = await response.text();

    // 네이버 지도 URL로 이동
    window.open(naverMapsUrl, '_blank');
  } catch (error) {
    console.error('경로 API 호출 중 오류 발생:', error);
  }
}

// 북마크 추가 함수
const addBookmark = async (storeId: number) => {
  try {
    const response = await fetch(
      `http://localhost:8080/api/v1/stores/${storeId}/bookmark`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Username': username.value || '', // 기본값 설정
        },
      },
    );

    if (!response.ok) {
      throw new Error('북마크 추가에 실패했습니다.');
    }

    isBookmarked.value = true;
    console.log('북마크가 추가되었습니다.');
  } catch (error) {
    console.error('북마크 추가에 실패했습니다:', error);
  }
};

// 북마크 삭제 함수
const deleteBookmark = async (storeId: number) => {
  try {
    const response = await fetch(
      `http://localhost:8080/api/v1/stores/${storeId}/bookmark`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-Username': username.value || '', // 기본값 설정
        },
      },
    );

    if (!response.ok) {
      throw new Error('북마크 삭제에 실패했습니다.');
    }

    isBookmarked.value = false;
    console.log('북마크가 삭제되었습니다.');
  } catch (error) {
    console.error('북마크 삭제에 실패했습니다:', error);
    alert('북마크를 삭제하는 데 실패했습니다.');
  } finally {
    closeBookmarkModal();
  }
};

// 북마크 토글 처리 함수
const handleBookmarkToggle = async () => {
  if (isBookmarked.value) {
    // 북마크가 되어 있는 경우 삭제 확인 모달 열기
    openBookmarkModal(storeId);
  } else {
    // 북마크가 되어 있지 않은 경우 바로 추가
    await addBookmark(storeId);
  }
};

// 저장 버튼 클릭 시 동작
const saveAction = () => {
  if (isAuthenticated.value) {
    // 인증된 사용자라면 북마크 토글 처리
    handleBookmarkToggle();
  } else {
    // 인증되지 않은 사용자라면 로그인 요청 모달 열기
    openLoginModal();
  }
};

// 북마크 모달 열기 함수
const openBookmarkModal = (storeId: number) => {
  selectedStoreId.value = storeId;
  bookmarkModalVisible.value = true;
};

// 북마크 모달 닫기 함수
const closeBookmarkModal = () => {
  bookmarkModalVisible.value = false;
  selectedStoreId.value = null;
};

// 로그인 요청 모달 열기 함수
const openLoginModal = () => {
  loginModalVisible.value = true;
};

// 로그인 요청 모달 닫기 함수
const closeLoginModal = () => {
  loginModalVisible.value = false;
};

// 로그인 페이지로 리디렉션 함수
const redirectToLogin = () => {
  router.push(`/signIn`); // 라우터 설정에 따라 경로 또는 이름 변경
};

// 모달에서 삭제 확인 시 동작
const confirmDelete = async () => {
  if (selectedStoreId.value !== null) {
    await deleteBookmark(selectedStoreId.value);
  }
};

// 공유 버튼 동작
const shareContent = () => {
  if (navigator.share) {
    navigator
      .share({
        title: 'WTM 공유하기',
        text: '이 페이지를 친구와 공유하세요!',
        url: window.location.href, // 현재 페이지 URL
      })
      .then(() => {
        console.log('공유 성공!');
      })
      .catch((error) => {
        console.error('공유 실패:', error);
      });
  } else {
    console.log('이 브라우저에서는 공유 기능을 지원하지 않습니다.');
  }
};
</script>

<style scoped>
/* 스타일 추가 */
button {
  background: none;
  border: none;
  cursor: pointer;
}

button:focus {
  outline: none;
}

.text-blue-500 {
  color: #1c274c;
}

.text-gray-500 {
  color: #a0a0a0;
}
</style>
