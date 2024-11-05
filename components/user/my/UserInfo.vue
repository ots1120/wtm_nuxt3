<template>
  <div class="flex text-left border-b-2">
    <div class="flex mx-8 items-center">
      <img
        :src="user.profileImage"
        alt="프로필 사진"
        class=""
        style="width: 100px; height: 100px"
      />
      <div class="flex-row">
        <span class="block font-bold text-2xl">{{ user.userName }}</span>
        <span class="block">{{ user.userId }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserInfoComponents',
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style scoped></style>
