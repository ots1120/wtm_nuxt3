<template>
  <div class="mt-4">
    <!-- 주소 정보 -->
    <div class="flex flex-col py-4 border-gray-200 relative">
      <div class="flex items-center gap-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="lucide lucide-map-pin"
        >
          <path
            d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"
          />
          <circle cx="12" cy="10" r="3" />
        </svg>
        <div
          ref="addressContent"
          :class="{ 'line-clamp-1': !isAddressExpanded }"
          class="text-gray-800 break-words whitespace-normal flex-1"
        >
          {{ store.address.address || '주소 정보 없음' }}
          {{ store.address.detailAddress }}
          {{ store.address.extraAddress }}
        </div>
        <button
          v-if="isAddressClamped"
          class="text-blue-600 hover:underline flex items-center"
          @click="toggleAddressExpand"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-chevron-down"
            :class="{ 'rotate-180': isAddressExpanded }"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
      </div>
    </div>

    <!-- SNS 링크 -->
    <div class="flex flex-col py-4 border-gray-200 relative">
      <div class="flex items-center gap-3">
        <svg
          class="w-6 h-6 text-gray-600 flex-shrink-0"
          viewBox="0 0 100 100"
          fill="currentColor"
        >
          <text
            x="50%"
            y="50%"
            dominant-baseline="middle"
            text-anchor="middle"
            font-family="Arial, sans-serif"
            font-size="50"
            font-weight="bold"
            fill="currentColor"
          >
            SNS
          </text>
        </svg>
        <div
          ref="snsContent"
          :class="{ 'line-clamp-1': !isSnsExpanded }"
          class="text-blue-600 break-all whitespace-normal flex-1"
        >
          <a :href="store.storeSns.url" target="_blank">{{
            store.storeSns.url
          }}</a>
        </div>
        <button
          v-if="isSnsClamped"
          class="text-blue-600 hover:underline flex items-center"
          @click="toggleSnsExpand"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-chevron-down"
            :class="{ 'rotate-180': isSnsExpanded }"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
      </div>
    </div>

    <!-- 연락처 정보 -->
    <div class="flex items-center gap-3 py-4 border-gray-200">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="lucide lucide-phone"
      >
        <path
          d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
        />
      </svg>
      <span class="text-gray-800">{{
        store.contact || '연락처 정보 없음'
      }}</span>
      <button
        class="ml-2 text-blue-600 font-medium focus:outline-none"
        @click="copyPhoneNumber"
      >
        복사
      </button>
    </div>

    <!-- 운영 시간 정보 -->
    <div class="flex items-center gap-3 py-4 border-gray-200">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="lucide lucide-clock"
      >
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
      <span class="text-gray-800">
        {{
          store.operatingHours && store.operatingHours.trim() !== 'null - null'
            ? store.operatingHours
            : '운영 시간 정보 없음'
        }}
      </span>
    </div>

    <!-- 가격 정보 -->
    <div class="flex items-center gap-3 py-4">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="lucide lucide-banknote"
      >
        <rect width="20" height="12" x="2" y="6" rx="2" />
        <circle cx="12" cy="12" r="2" />
        <path d="M6 12h.01M18 12h.01" />
      </svg>
      <span class="text-gray-800">{{
        store.ticket?.price ? `${store.ticket.price}원` : '가격 정보 없음'
      }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const props = defineProps({
  store: {
    type: Object,
    required: true,
  },
});

// 상태 관리
const isAddressExpanded = ref(false);
const isAddressClamped = ref(false);
const addressContent = ref(null);

const isSnsExpanded = ref(false);
const isSnsClamped = ref(false);
const snsContent = ref(null);

const showModal = ref(false);

// 잘림 여부 확인
onMounted(() => {
  if (addressContent.value) {
    const contentHeight = addressContent.value.scrollHeight;
    const lineHeight = parseFloat(
      getComputedStyle(addressContent.value).lineHeight,
    );
    if (contentHeight > lineHeight * 1) isAddressClamped.value = true;
  }

  if (snsContent.value) {
    const contentHeight = snsContent.value.scrollHeight;
    const lineHeight = parseFloat(
      getComputedStyle(snsContent.value).lineHeight,
    );
    if (contentHeight > lineHeight * 1) isSnsClamped.value = true;
  }
});

// 토글 기능
function toggleAddressExpand() {
  isAddressExpanded.value = !isAddressExpanded.value;
}
function toggleSnsExpand() {
  isSnsExpanded.value = !isSnsExpanded.value;
}
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
}
.rotate-180 {
  transform: rotate(180deg);
  transition: transform 0.3s ease;
}
</style>
