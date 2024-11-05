<template>
  <div>
    <ul>
      <li v-for="(menu, index) in menuList" :key="index" class="border-b-2">
        <a :href="menu.link" class="">
          <div class="flex justify-between my-3 mx-8">
            <span>{{ menu.title }}</span>
            <span>&gt;</span>
            <!-- <img :src="menu.icon" alt="icon" /> -->
          </div>
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'CommonMenuList',
  props: {
    menuList: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style scoped></style>
