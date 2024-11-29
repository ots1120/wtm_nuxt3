<template>
  <div class="max-w-lg mx-auto">
    <div class="flex items-center p-6 border-b border-gray-200">
      <div class="w-20 h-20 rounded-full flex-shrink-0 mr-6">
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
              xmlns="http://www.w3.org/2000/svg"
              class="h-20 w-20 text-gray-400"
              viewBox="0 0 16 16"
            >
              <path
                fill="#BDBDBD"
                d="M8 16A8 8 0 1 1 8 0a8 8 0 0 1 0 16m.847-8.145a2.502 2.502 0 1 0-1.694 0C5.471 8.261 4 9.775 4 11c0 .395.145.995 1 .995h6c.855 0 1-.6 1-.995c0-1.224-1.47-2.74-3.153-3.145"
              />
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
