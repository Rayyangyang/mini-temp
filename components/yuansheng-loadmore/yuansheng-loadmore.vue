<template>
  <uni-load-more
    @clickLoadMore="emitClickLoadMore('clickLoadMore',$event)"
    :contentText="contentText"
    :iconSize="14"
    :status="loading ? 'loading' : pagination.current * pagination.pageSize < pagination.total ? 'more' : 'no-more'"
  ></uni-load-more>
</template>

<script setup>
const emitClickLoadMore = defineEmits(['clickLoadMore'])
defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  pagination: {
    type: Object,
    default: {
      current: 1,
      pageSize: 10,
      total: 0
    }
  }
});
const contentText = {
  contentdown: '加载更多',
  contentrefresh: '正在加载...',
  contentnomore: '没有更多了'
};
</script>

<style></style>
