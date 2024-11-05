<template>
  <div>
    <!-- 탭 헤더 -->

    <ul class="flex justify-around border-b-2 p-2 text-center">
      <li v-for="(tab, index) in tabs" :key="index">
        <a
          class="w-20 duration-300 ease-in-out hover:bg-slate-300"
          href="#"
          @click.prevent="activeTab = index"
          :class="{ active: activeTab === index }"
        >
          {{ tab }}
        </a>
      </li>
    </ul>

    <!-- 탭 콘텐츠 -->
    <div class="p-4 border border-t-0">
      <slot :name="'tab' + activeTab"></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    tabs: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      activeTab: 0,
    };
  },
};
</script>
