<template>
  <div class="max-w-lg mx-auto">
    <div class="flex items-center p-6 border-b border-gray-200">
      <div class="w-20 h-20 bg-gray-200 rounded-full flex-shrink-0 mr-6">
        <!-- 프로필 사진 미리보기 -->
            <!-- 프로필 사진이 있는 경우 보여줌 -->
            <img
              v-if="profilePicture"
              :src="profilePicture"
              alt="프로필 사진"
              class="w-20 h-20 object-cover rounded-full"
            /> 
            <!-- 프로필 사진이 없는 경우 SVG 아이콘을 보여줌 -->
            <svg
              v-else
              width="80px"
              height="80px"
              viewBox="0 0 64 64"
              xmlns="http://www.w3.org/2000/svg"
              stroke-width="3"
              stroke="#000000"
              fill="none"
              class="block stroke-white rounded-full"
            >
              <g id="SVGRepo_bgCarrier" stroke-width="0" />
              <g
                id="SVGRepo_tracerCarrier"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <g id="SVGRepo_iconCarrier">
                <circle cx="32" cy="18.14" r="11.14" />
                <path
                  d="M54.55,56.85A22.55,22.55,0,0,0,32,34.3h0A22.55,22.55,0,0,0,9.45,56.85Z"
                />
              </g>
            </svg>
      </div>
      <div class="flex flex-col">
        <span class="text-2xl font-bold text-gray-900 mb-1">{{
          name || '사용자'
        }}</span>
        <span class="text-gray-600">{{ email || 'email@example.com' }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  name: String,
  email: String,
  profilePicture: String | null
});
</script>
