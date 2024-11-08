<template>
  <div>
    <AdminNoticesNoticeRegistForm
      :initial-data="notice"
      :is-edit-mode="isEditMode"
      @open-modal="handleOpenModal"
    />
    <ConfirmationModal
      v-if="isModalVisible"
      :visible="isModalVisible"
      message-title="공지 수정"
      message-body="입력하신 공지를 수정하시겠습니까?"
      cancel-message="취소"
      confirm-message="수정"
      @confirm="handleConfirm"
      @cancel="handleCancel"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AdminNoticesNoticeRegistForm from '~/components/admin/notices/NoticeRegistForm.vue';
import ConfirmationModal from '~/components/modal/BasicModal.vue';

interface NoticeData {
  title: string;
  content: string;
  userId?: number;
}

// 라우트 설정
const route = useRoute();
const router = useRouter();
const storeId = route.params.storeId;
const noticeId = route.params.noticeId;

// 상태 관리
const isEditMode = ref<boolean>(true);
const isModalVisible = ref<boolean>(false);
const notice = ref<NoticeData>({
  title: '',
  content: '',
});
const userId = 1; // 등록 userId는 실제 로그인한 사용자의 id를 가져와야 함.

// 공지 데이터 로드
const loadNoticeData = async (): Promise<void> => {
  try {
    const response = await fetch(
      `http://localhost:8080/api/admin/stores/${storeId}/notices/${noticeId}`,
    );

    if (response.ok) {
      const data = await response.json();
      notice.value = {
        title: data.title,
        content: data.content,
        userId: data.userId,
      };
    } else {
      console.error(
        '공지 데이터를 불러오지 못했습니다:',
        await response.text(),
      );
    }
  } catch (err) {
    console.error('공지 데이터 로드 중 오류 발생:', err);
  }
};

// 모달 열기 핸들러
const handleOpenModal = (data: NoticeData) => {
  notice.value = { ...data, userId };
  isModalVisible.value = true;
};

// 공지 수정 API 호출
const handleConfirm = async (): Promise<void> => {
  if (!storeId) {
    console.error('스토어 ID가 없습니다.');
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:8080/api/admin/stores/${storeId}/notices/${noticeId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: notice.value.title,
          content: notice.value.content,
          userId: notice.value.userId,
        }),
      },
    );

    if (response.ok) {
      console.log('공지 수정 완료');
      isModalVisible.value = false; // 모달 닫기

      router.push(`/admin/stores/${storeId}/notices`);
    } else {
      console.error('공지 수정 실패:', await response.text());
    }
  } catch (err) {
    console.error('공지 수정 중 오류 발생:', err);
  }
};

// 모달 취소 핸들러
const handleCancel = (): void => {
  isModalVisible.value = false;
};

// 컴포넌트가 마운트될 때 데이터 로드
onMounted(() => {
  if (!storeId || !noticeId) {
    console.error('스토어 ID 또는 공지 ID가 제공되지 않았습니다.');
    return;
  }
  loadNoticeData();
});
</script>
