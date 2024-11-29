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
          {{ store.address.detailAddress || '' }}
          {{ store.address.extraAddress || '' }}
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
    <!-- SNS 링크 -->
    <div class="flex flex-col py-4 border-gray-200 relative">
      <div class="flex items-center gap-3">
        <!-- SNS 아이콘 -->
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

        <!-- SNS 링크 조건부 렌더링 -->
        <div v-if="store.storeSns?.url" class="flex items-center gap-1">
          <a
            :href="store.storeSns.url"
            target="_blank"
            rel="noopener noreferrer"
            class="text-blue-600 flex items-center gap-1"
          >
            <!-- Instagram SVG 아이콘 -->
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="url(#instagram-gradient)"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-instagram"
            >
              <!-- 그라디언트 정의 -->
              <defs>
                <linearGradient
                  id="instagram-gradient"
                  x1="0"
                  y1="0"
                  x2="1"
                  y2="1"
                >
                  <stop offset="0%" stop-color="#F58529" />
                  <stop offset="50%" stop-color="#DD2A7B" />
                  <stop offset="100%" stop-color="#8134AF" />
                </linearGradient>
              </defs>
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
            </svg>
          </a>
        </div>

        <!-- SNS 정보 없음 표시 -->
        <div v-else class="text-gray-800">SNS 정보 없음</div>
      </div>
    </div>

    <!-- 연락처 정보 -->
    <div class="flex flex-col gap-3 py-4">
      <div class="flex items-center gap-3">
        <svg
          class="w-4 h-4 text-gray-700"
          viewBox="0 0 24 24"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6.62 10.79a15.34 15.34 0 006.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.27 1.12.27 2.33.42 3.57.42.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-10.5 0-19-8.5-19-19 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.24.15 2.45.42 3.57.09.35 0 .74-.27 1.02l-2.2 2.2z"
          />
        </svg>
        <span class="text-gray-800">{{
          store.contact || '연락처 정보 없음'
        }}</span>

        <button class="text-blue-500 ml-2" @click="copyPhoneNumber">
          복사
        </button>
        <span v-if="copySuccess" class="text-green-500 text-sm"
          >전화번호가 복사되었습니다.</span
        >
      </div>
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
        {{ store.operatingHours || '운영 시간 정보 없음' }}
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
const props = defineProps({
  store: {
    type: Object,
    required: true,
  },
});

const copySuccess = ref(false);
const isAddressExpanded = ref(false);
const isAddressClamped = ref(false);
const addressContent = ref(null);

onMounted(() => {
  if (addressContent.value) {
    const contentHeight = addressContent.value.scrollHeight;
    const lineHeight = parseFloat(
      getComputedStyle(addressContent.value).lineHeight,
    );
    if (contentHeight > lineHeight * 1) isAddressClamped.value = true;
  }
});

function toggleAddressExpand() {
  isAddressExpanded.value = !isAddressExpanded.value;
}

function copyPhoneNumber() {
  if (!props.store.contact || typeof props.store.contact !== 'string') {
    console.error('전화번호가 유효하지 않습니다.');
    return;
  }

  navigator.clipboard
    .writeText(props.store.contact)
    .then(() => {
      console.log('전화번호 복사 성공');
      copySuccess.value = true;
      setTimeout(() => (copySuccess.value = false), 2000);
    })
    .catch((err) => {
      console.error('복사에 실패했습니다:', err);
    });
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
