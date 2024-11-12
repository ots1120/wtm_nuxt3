import { ref, onMounted, onUnmounted, watch } from 'vue';

export default function useInfiniteScroll(loadMore) {
  const isBottom = ref(false);

  const handleScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    isBottom.value = scrollTop + clientHeight >= scrollHeight - 10;
  };

  onMounted(() => {
    window.addEventListener('scroll', handleScroll);
  });

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
  });

  watch(isBottom, (value) => {
    if (value) {
      loadMore();
      isBottom.value = false;
    }
  });
}
