<template>
  <div class="container">
    <div class="bg-white shadow-md rounded-lg p-2">
      <div class="mb-4">
        <h1 class="text-2xl font-bold text-gray-800">식권 관리</h1>
      </div>
      <div class="flex space-x-2 mb-4">
        <div>
          <label for="category" class="block text-sm font-medium text-gray-600"
            >카테고리</label
          >
          <select
            v-model.number="newItemCategory"
            class="w-32 mt-1 px-4 py-2 border rounded-md focus:ring focus:ring-blue-200"
          >
            <option disabled hidden value="0">카테고리 선택</option>
            <option value="1">현금</option>
            <option value="2">카드</option>
          </select>
        </div>
        <div>
          <label for="name" class="block text-sm font-medium text-gray-600"
            >이름</label
          >
          <input
            v-model="newItemname"
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
      <table class="table-fixed w-full border-collapse border border-gray-200">
        <thead>
          <tr>
            <th class="border border-gray-200 px-4 py-2 text-left w-1/4">
              카테고리
            </th>
            <th class="border border-gray-200 px-4 py-2 text-left w-1/4">
              이름
            </th>
            <th class="border border-gray-200 px-4 py-2 text-left w-1/4">
              가격
            </th>
            <th class="border border-gray-200 px-4 py-2 text-left w-1/4">
              작업
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in ticketItems" :key="item.id">
            <td class="border border-gray-200 px-4 py-2">
              <template v-if="editingId === item.id">
                <select
                  v-model.number="newItemCategory"
                  class="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-200"
                >
                  <option disabled hidden value="0">카테고리 선택</option>
                  <option value="1">현금</option>
                  <option value="2">카드</option>
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
                  v-model="newItemname"
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
                  v-model="newItemPrice"
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
              </template>
              <template v-else>
                <button
                  class="px-2 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                  @click="startEditing(item.id)"
                >
                  수정
                </button>
              </template>
              <button
                class="px-2 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 ml-2"
                @click="deleteMenuItem(item.id)"
              >
                삭제
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from '#app';

onBeforeMount(() => {
  route.meta.title = '식권관리';
});

definePageMeta({
  layout: 'admin',
});

interface TicketItem {
  id: number;
  name: string;
  price: number;
  categoryId: number;
}

const route = useRoute();

const ticketItems = ref<TicketItem[]>([]);
const newItemname = ref('');
const newItemCategory = ref<number | null>(0);
const newItemPrice = ref<number | null>(null);
const editingId = ref<number | null>(null);
const storeId = 1;

// API 호출
const fetchTickets = async () => {
  try {
    const response = await fetch(
      `http://localhost:8080/api/admin/stores/${storeId}/tickets`,
    );
    if (!response.ok) {
      throw new Error('Failed to fetch tickets');
    }
    ticketItems.value = await response.json();
    console.log(ticketItems.value);
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error('Unknown error:', error);
    }
  }
};

const addTicketItem = async () => {
  if (newItemCategory.value && newItemPrice.value !== null) {
    try {
      const response = await fetch(
        `http://localhost:8080/api/admin/stores/${storeId}/tickets`,
        {
          method: 'POST',
          body: JSON.stringify({
            name: newItemname.value,
            categoryId: newItemCategory.value,
            price: newItemPrice.value,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      if (!response.ok) throw new Error('Failed to add ticket');
      const data = await response.json();
      ticketItems.value.push(data);
      newItemname.value = '';
      newItemCategory.value = null;
      newItemPrice.value = null;
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error('Unknown error:', error);
      }
    }
  }
};

const startEditing = (id: number) => {
  editingId.value = id;
  const ticket = ticketItems.value.find((item) => item.id === id);
  if (ticket) {
    newItemname.value = ticket.name;
    newItemCategory.value = ticket.categoryId;
    newItemPrice.value = ticket.price;
  }
};

const saveEdit = async (id: number) => {
  const ticket = ticketItems.value.find((item) => item.id === id);
  if (!ticket) return;

  const updatedName = newItemname.value || ticket.name;
  const updatedPrice = newItemPrice.value ?? ticket.price;
  const updatedCategoryId = newItemCategory.value || ticket.categoryId;

  try {
    const response = await fetch(
      `http://localhost:8080/api/admin/stores/${storeId}/tickets/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify({
          name: updatedName,
          price: updatedPrice,
          categoryId: updatedCategoryId,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    if (!response.ok) throw new Error('Failed to update ticket');
    const data = await response.json();
    ticketItems.value = ticketItems.value.map((item) =>
      item.id === id ? { ...item, name: data.name, price: data.price } : item,
    );
    editingId.value = null;
    newItemCategory.value = null;
    newItemname.value = '';
    newItemPrice.value = null;
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error('Unknown error:', error);
    }
  }
};

const deleteMenuItem = async (id: number) => {
  try {
    const response = await fetch(
      `http://localhost:8080/api/admin/stores/${storeId}/tickets/${id}`,
      {
        method: 'DELETE',
      },
    );
    if (!response.ok) throw new Error('Failed to delete ticket');
    ticketItems.value = ticketItems.value.filter((item) => item.id !== id);
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error('Unknown error:', error);
    }
  }
};

// Vue 컴포넌트가 마운트될 때 식권 목록 가져오기
onMounted(() => {
  fetchTickets();
});
</script>
