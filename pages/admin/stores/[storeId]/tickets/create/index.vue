<template>
  <div class="container mx-auto p-4">
    <h1 class="text-3xl font-bold mb-6">식권 생성</h1>

    <!-- 식권 생성 폼 -->
    <div class="flex space-x-2 mb-4">
      <div>
        <label for="category" class="block text-sm font-medium text-gray-600"
          >카테고리</label
        >
        <select
          v-model="newItemCategory"
          class="w-32 mt-1 px-4 py-2 border rounded-md focus:ring focus:ring-blue-200"
        >
          <option disabled hidden :value="0">카테고리 선택</option>
          <option :value="1">현금</option>
          <option :value="2">카드</option>
        </select>
      </div>
      <div>
        <label for="name" class="block text-sm font-medium text-gray-600"
          >이름</label
        >
        <input
          v-model="newItemName"
          type="text"
          placeholder="이름"
          class="w-24 px-4 py-2 border rounded-md focus:ring focus:ring-blue-200"
        />
      </div>
      <div>
        <label for="price" class="block text-sm font-medium text-gray-600"
          >가격</label
        >
        <input
          v-model="newItemPrice"
          type="number"
          placeholder="가격"
          class="w-24 px-4 py-2 border rounded-md focus:ring focus:ring-blue-200"
        />
      </div>
      <button
        class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 mt-auto"
        @click="addTicketItem"
      >
        추가
      </button>
    </div>

    <!-- 식권 목록 테이블 -->
    <table class="table-fixed w-full border-collapse border border-gray-200">
      <thead>
        <tr>
          <th class="border border-gray-200 px-4 py-2 text-left w-1/4">
            카테고리
          </th>
          <th class="border border-gray-200 px-4 py-2 text-left w-1/4">이름</th>
          <th class="border border-gray-200 px-4 py-2 text-left w-1/4">가격</th>
          <th class="border border-gray-200 px-4 py-2 text-left w-1/4">작업</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in ticketItems" :key="item.id">
          <td class="border border-gray-200 px-4 py-2">
            <template v-if="editingId === item.id">
              <select
                v-model="editItemCategory"
                class="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-200"
              >
                <option disabled hidden :value="0">카테고리 선택</option>
                <option :value="1">현금</option>
                <option :value="2">카드</option>
              </select>
            </template>
            <template v-else>
              <span v-if="item.categoryId === 1">현금</span>
              <span v-else-if="item.categoryId === 2">카드</span>
            </template>
          </td>
          <td class="border border-gray-200 px-4 py-2">
            <template v-if="editingId === item.id">
              <input
                v-model="editItemName"
                type="text"
                placeholder="메뉴 이름"
                class="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-200"
              />
            </template>
            <template v-else>
              {{ item.name }}
            </template>
          </td>
          <td class="border border-gray-200 px-4 py-2">
            <template v-if="editingId === item.id">
              <input
                v-model="editItemPrice"
                type="number"
                placeholder="가격"
                class="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-200"
              />
            </template>
            <template v-else> {{ item.price }}원 </template>
          </td>
          <td class="border border-gray-200 px-4 py-2 whitespace-nowrap">
            <template v-if="editingId === item.id">
              <button
                class="px-2 py-1 bg-green-600 text-white rounded-md hover:bg-green-700"
                @click="saveEdit(item.id)"
              >
                저장
              </button>
              <button
                class="px-2 py-1 bg-gray-500 text-white rounded-md hover:bg-gray-600 ml-2"
                @click="cancelEdit"
              >
                취소
              </button>
            </template>
            <template v-else>
              <button
                class="px-2 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                @click="startEditing(item)"
              >
                수정
              </button>
              <button
                class="px-2 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 ml-2"
                @click="deleteTicketItem(item.id)"
              >
                삭제
              </button>
            </template>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeMount } from 'vue';
import { useRuntimeConfig } from '#app';
import { useRoute } from 'vue-router';

// 라우트와 메타 설정
const route = useRoute();

onBeforeMount(() => {
  route.meta.title = '식권관리';
});

definePageMeta({
  layout: 'admin',
});

// 인터페이스 정의
interface TicketItem {
  id: number;
  name: string;
  price: number | null;
  categoryId: number;
}

// 설정 및 상태 변수
const config = useRuntimeConfig();
const baseUrl = config.public.baseApiUrl;

const ticketItems = ref<TicketItem[]>([]);
const newItemName = ref<string>('');
const newItemCategory = ref<number>(0);
const newItemPrice = ref<number | null>(null);

const editingId = ref<number | null>(null);
const editItemName = ref<string>('');
const editItemCategory = ref<number>(0);
const editItemPrice = ref<number | null>(null);

const storeId = 1;

// 티켓 데이터 가져오기
const fetchTickets = async () => {
  try {
    const response = await fetch(
      `${baseUrl}/api/v1/admin/stores/${storeId}/tickets`,
    );
    if (!response.ok) {
      throw new Error('Failed to fetch tickets');
    }
    const data: TicketItem[] = await response.json();
    ticketItems.value = data;
    console.log('Fetched tickets:', ticketItems.value);
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error fetching tickets:', error.message);
    } else {
      console.error('Unknown error fetching tickets:', error);
    }
  }
};

// 티켓 추가 함수
const addTicketItem = async () => {
  if (
    newItemCategory.value &&
    newItemPrice.value !== null &&
    newItemName.value.trim() !== ''
  ) {
    try {
      const response = await fetch(
        `${baseUrl}/api/v1/admin/stores/${storeId}/tickets`,
        {
          method: 'POST',
          body: JSON.stringify({
            name: newItemName.value,
            categoryId: newItemCategory.value,
            price: newItemPrice.value,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      if (!response.ok) throw new Error('Failed to add ticket');

      // API 응답 타입 단언
      const data: TicketItem = await response.json();

      // 데이터 검증
      if (
        typeof data.name === 'string' &&
        typeof data.price === 'number' &&
        typeof data.categoryId === 'number' &&
        typeof data.id === 'number'
      ) {
        ticketItems.value.push(data);
        console.log('Added ticket:', data);
      } else {
        throw new TypeError('Invalid data format received from API');
      }

      // 입력 필드 초기화
      newItemName.value = '';
      newItemCategory.value = 0;
      newItemPrice.value = null;
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error adding ticket:', error.message);
      } else {
        console.error('Unknown error adding ticket:', error);
      }
    }
  } else {
    alert('모든 필드를 입력해주세요.');
  }
};

// 티켓 수정 시작 함수
const startEditing = (ticket: TicketItem) => {
  editingId.value = ticket.id;
  editItemName.value = ticket.name;
  editItemCategory.value = ticket.categoryId;
  editItemPrice.value = ticket.price;
};

// 티켓 수정 취소 함수
const cancelEdit = () => {
  editingId.value = null;
  editItemName.value = '';
  editItemCategory.value = 0;
  editItemPrice.value = null;
};

// 티켓 수정 저장 함수
const saveEdit = async (id: number) => {
  if (
    editItemCategory.value &&
    editItemPrice.value !== null &&
    editItemName.value.trim() !== ''
  ) {
    try {
      const response = await fetch(
        `${baseUrl}/api/v1/admin/stores/${storeId}/tickets/${id}`,
        {
          method: 'PUT',
          body: JSON.stringify({
            name: editItemName.value,
            price: editItemPrice.value,
            categoryId: editItemCategory.value,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      if (!response.ok) throw new Error('Failed to update ticket');

      // API 응답 타입 단언
      const data: TicketItem = await response.json();

      // 데이터 검증
      if (
        typeof data.name === 'string' &&
        typeof data.price === 'number' &&
        typeof data.categoryId === 'number' &&
        typeof data.id === 'number'
      ) {
        ticketItems.value = ticketItems.value.map((item) =>
          item.id === id
            ? {
                ...item,
                name: data.name,
                price: data.price,
                categoryId: data.categoryId,
              }
            : item,
        );
        console.log('Updated ticket:', data);
      } else {
        // API 응답에 name 또는 categoryId가 없을 경우, 클라이언트 측 데이터로 업데이트
        ticketItems.value = ticketItems.value.map((item) =>
          item.id === id
            ? {
                ...item,
                name: editItemName.value,
                price: editItemPrice.value as number, // 이미 null이 아님을 확인
                categoryId: editItemCategory.value,
              }
            : item,
        );
        console.warn(
          'API 응답에 name 또는 categoryId가 없어 로컬 데이터로 업데이트했습니다.',
        );
      }

      // 수정 상태 초기화
      editingId.value = null;
      editItemName.value = '';
      editItemCategory.value = 0;
      editItemPrice.value = null;
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error updating ticket:', error.message);
      } else {
        console.error('Unknown error updating ticket:', error);
      }
    }
  } else {
    alert('모든 필드를 입력해주세요.');
  }
};

// 티켓 삭제 함수
const deleteTicketItem = async (id: number) => {
  if (confirm('정말로 삭제하시겠습니까?')) {
    try {
      const response = await fetch(
        `${baseUrl}/api/v1/admin/stores/${storeId}/tickets/${id}`,
        {
          method: 'DELETE',
        },
      );
      if (!response.ok) throw new Error('Failed to delete ticket');
      ticketItems.value = ticketItems.value.filter((item) => item.id !== id);
      console.log(`Deleted ticket with id: ${id}`);
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error deleting ticket:', error.message);
      } else {
        console.error('Unknown error deleting ticket:', error);
      }
    }
  }
};

// 초기 데이터 로드
onMounted(() => {
  fetchTickets();
});
</script>

<style scoped>
/* 추가적인 스타일이 필요하다면 여기에 작성하세요 */
</style>
