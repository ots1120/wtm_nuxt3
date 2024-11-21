<template>
  <div
    class="flex-grow mt-4 mb-16 overflow-y-auto w-full max-w-lg mx-auto px-4"
  >
    <AdminNoticesNoticeRegistForm
      :initial-data="notice"
      :is-edit-mode="isEditMode"
      @open-modal="handleOpenModal"
    />
    <ConfirmModal
      v-if="isModalVisible"
      :visible="isModalVisible"
      message-title="공지 등록"
      message-body="입력하신 공지를 등록하시겠습니까?"
      cancel-message="취소"
      confirm-message="등록"
      @confirm="handleConfirm"
      @cancel="handleCancel"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useRuntimeConfig } from '#app';
import AdminNoticesNoticeRegistForm from '~/components/admin/notices/NoticeRegistForm.vue';
import ConfirmModal from '~/components/modal/BasicModal.vue';

const config = useRuntimeConfig();
const baseUrl = config.public.baseApiUrl;

const authstore = useAuthStore();
const adminId = Number(authstore.user?.userId);

onBeforeMount(() => {
  route.meta.title = '공지등록';
});

definePageMeta({
  layout: 'admin',
});

interface NoticeData {
  title: string;
  content: string;
  userId?: number;
}

// 라우트 설정
const route = useRoute();
const router = useRouter();
const storeId = route.params.storeId;

// 상태 관리
const isEditMode = ref<boolean>(false);
const isModalVisible = ref<boolean>(false);
const notice = ref<NoticeData>({
  title: '',
  content: '',
});
const userId = adminId; // 등록 userId는 실제 로그인한 사용자의 id를 가져와야 함.

// 모달 열기 핸들러
const handleOpenModal = (data: NoticeData) => {
  notice.value = { ...data, userId };
  isModalVisible.value = true;
};

// 공지 등록 API 호출
const handleConfirm = async (): Promise<void> => {
  if (!storeId) {
    console.error('스토어 ID가 없습니다.');
    return;
  }

  try {
    const response = await fetch(
      `${baseUrl}/api/v1/admin/stores/${storeId}/notices`,
      {
        method: 'POST',
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
      console.log('공지 등록 완료');
      isModalVisible.value = false; // 모달 닫기

      router.push(`/admin/stores/${storeId}/notices`);
    } else {
      console.error('공지 등록 실패:', await response.text());
    }
  } catch (err) {
    console.error('공지 등록 중 오류 발생:', err);
  }
};

// 모달 취소 핸들러
const handleCancel = (): void => {
  isModalVisible.value = false;
};
</script>
