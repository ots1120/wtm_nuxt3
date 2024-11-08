<template>
  <div>
    <div
      v-for="(notice, noticeIndex) in notices"
      :key="notice.noticeId"
      class="flex-col p-3"
    >
      <div class="mb-2 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div
            class="w-16 h-16 rounded-full border overflow-hidden flex items-center justify-center"
          >
            <img
              v-if="isDataLoaded"
              :src="notice.userProfilePicture"
              alt="Profile Image"
              class="w-full h-full object-cover"
              width="120"
              height="120"
            />
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              class="w-2/3 h-2/3"
              viewBox="0 0 16 16"
            />
          </div>
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
          class="text-xs text-blue-500"
          @click="goToEditForm(notice.noticeId)"
        >
          수정
        </button>
        <button
          class="text-xs text-red-500"
          @click="deleteNotice(notice.noticeId)"
        >
          삭제
        </button>
      </div>
    </div>
    <WriteButton :push-route="`/admin/stores/${storeId}/notices/regist`" />
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { differenceInDays } from 'date-fns';
import WriteButton from '~/components/admin/ui/WriteButton.vue';

// 타입 정의
interface Notice {
  noticeId: number;
  userName: string;
  userProfilePicture: string;
  content: string;
  title: string;
  noticeRegDate: string;
  dayDifference: string;
}

// 상태 정의
const notices = ref<Notice[]>([]);
const isExpanded = ref<boolean[]>([]); // 각 notice의 확장 상태

// 사진 로드 상태
const isDataLoaded = ref(false);

// 라우터 인스턴스 생성
const router = useRouter();
const route = useRoute();

// storeId 가져오기
const storeId = route.params.storeId;

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

// 데이터 가져오기 함수
const { data, error } = useFetch<Notice[]>(
  `/api/admin/stores/${storeId}/notices`,
  {
    baseURL: 'http://localhost:8080',
  },
);

// 데이터가 변경되면 notices와 isExpanded 설정
watchEffect(() => {
  if (data.value) {
    console.log(data.value);
    const fetchData = data.value as Notice[];
    notices.value = data.value.map((fetchData) => ({
      ...fetchData,
      dayDifference: formatDateDifference(fetchData.noticeRegDate),
      userProfilePicture: `http://localhost:8080${fetchData.userProfilePicture}`,
    }));
    isExpanded.value = new Array(data.value.length).fill(false);
    isDataLoaded.value = true;
  }
  if (error.value) {
    console.error('데이터 가져오기 실패:', error.value);
  }
});

// 더보기/접기 토글 함수
const toggleExpanded = (index: number) => {
  isExpanded.value[index] = !isExpanded.value[index];
};

// 수정 페이지로 이동
const goToEditForm = (noticeId: number) => {
  router.push(`/admin/stores/${storeId}/notices/${noticeId}/edit`);
};

// 삭제 기능
const deleteNotice = async (noticeId: number) => {
  try {
    await useFetch(`/api/admin/stores/${storeId}/notices/${noticeId}`, {
      baseURL: 'http://localhost:8080',
      method: 'DELETE',
    });
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
