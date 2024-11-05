<template>
  <header class="px-4 py-4 flex items-center border-b-2 pb-3">
    <button @click="goBack" type="button">
      <svg
        class="w-8"
        viewBox="0 0 1024 1024"
        xmlns="http://www.w3.org/2000/svg"
        fill="#000000"
        stroke="#000000"
        stroke-width="20.48"
      >
        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
        <g
          id="SVGRepo_tracerCarrier"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></g>
        <g id="SVGRepo_iconCarrier">
          <path
            fill="#000000"
            d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z"
          ></path>
          <path
            fill="#000000"
            d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z"
          ></path>
        </g>
      </svg>
    </button>

    <div class="m-auto text-3xl font-semibold">
      <h1>{{ title }}</h1>
    </div>
  </header>
</template>
<script>
export default {
  name: 'TheHeaderComponents',
  props: {
    title: {
      type: String,
      default: '제목',
    },
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
  },
};
</script>
<style></style>
