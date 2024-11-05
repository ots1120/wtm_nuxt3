<template>
  <div>
    <div
      v-for="(notice, noticeIndex) in notices"
      :key="notice.noticeId"
      class="flex-col p-3"
    >
      <div class="mb-2 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <svg
            class="w-9"
            viewBox="0 0 16 16"
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
              <circle cx="8" cy="8" r="8" fill="#d9d9d9" />
            </g>
          </svg>
          <span class="text-xl font-medium">{{ notice.userName }}</span>
          <!-- store 이름을 notice 객체에서 직접 가져오기 -->
        </div>
        <div>
          <span class="text-xs text-gray-400">{{ notice.dayDifference }}</span>
        </div>
      </div>
      <div class="flex-col">
        <!-- 내용이 길면 더보기/접기 버튼을 표시 -->
        <span class="font-semibold">{{ notice.title }}</span>
        <p
          class="text-xs"
          :style="
            isExpanded[noticeIndex]
              ? 'height:auto;'
              : 'height:4.5rem; overflow:hidden;'
          "
        >
          {{ notice.content }}
        </p>
        <button
          v-if="notice.content.length > 100"
          class="text-xs text-blue-500"
          @click="toggleExpanded(noticeIndex)"
        >
          {{ isExpanded[noticeIndex] ? '접기' : '더보기' }}
        </button>
      </div>
      <div class="flex justify-end gap-4">
        <button
          class="text-xs text-red-500"
          @click="deleteNotice(notice.noticeId)"
        >
          삭제
        </button>
        <button
          class="text-xs text-blue-500"
          @click="goToEditForm(notice.noticeId)"
        >
          수정
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';
import { differenceInDays } from 'date-fns';

// 타입 정의
interface Notice {
  noticeId: number;
  userName: string;
  content: string;
  title: string;
  noticeRegDate: string;
  dayDifference: string;
}

// 상태 정의
const notices = ref<Notice[]>([]);
const isExpanded = ref<boolean[]>([]); // 각 notice의 확장 상태

// 라우터 인스턴스 생성
const router = useRouter();
const route = useRoute();

// storeId 가져오기
const storeId = route.params.storeId;

// 데이터 가져오기 함수
const fetchNotices = async () => {
  try {
    const response = await axios.get(
      `http://localhost:8080/api/admin/stores/${storeId}/notices`,
    );
    notices.value = response.data.map((notice: Notice) => {
      return {
        ...notice,
        dayDifference: formatDateDifference(notice.noticeRegDate),
      };
    });
    console.log(response);
    // 각 notice에 대해 초기 확장 상태 설정
    isExpanded.value = new Array(response.data.length).fill(false);
  } catch (error) {
    console.error('데이터 가져오기 실패:', error);
  }
};

// 등록일자 계산
const formatDateDifference = (regDate: string) => {
  const date = new Date(regDate);
  if (isNaN(date.getTime())) {
    console.error('유효하지 않은 날짜 형식:', regDate);
    return '유효하지 않은 날짜';
  }
  const daysDifference = differenceInDays(new Date(), date);
  return `${daysDifference}일 전`;
};

// 컴포넌트가 마운트되면 데이터 로드
onMounted(fetchNotices);

// 더보기/접기 토글 함수
const toggleExpanded = (index: number) => {
  isExpanded.value[index] = !isExpanded.value[index];
};

// 수정 페이지로 이동
const goToEditForm = (noticeId: number) => {
  router.push(`/admin/${storeId}/notice/edit/${noticeId}`);
};

// 삭제 기능
const deleteNotice = async (noticeId: number) => {
  try {
    await axios.delete(
      `http://localhost:8080/api/admin/stores/${storeId}/notices/${noticeId}`,
    );
    // 삭제 후 notices 배열 업데이트
    notices.value = notices.value.filter(
      (notice) => notice.noticeId !== noticeId,
    );
  } catch (error) {
    console.error('삭제 실패:', error);
  }
};
</script>

<style scoped></style>
