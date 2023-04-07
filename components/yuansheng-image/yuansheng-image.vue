<template>
  <view @click="$emit('click',$event)" :style="{ 'background-color': bgColor, width, height, 'min-width': width, 'border-radius': radius }">
    <image :style="{ 'border-radius': radius, width: '100%', height: '100%' }" :src="imageSrc" mode="aspectFill" lazy-load @error="error"></image>
  </view>
</template>

<script setup>
import { ref, watch, toRefs } from 'vue';
const props = defineProps({
  // 默认值
  src: {
    type: String,
    default: ''
  },
  radius: {
    type: String,
    default: '0rpx'
  },
  errorIcon: {
    type: String,
    default: '/static/images/icon_touxiang@2x.png'
  },
  width: {
    type: String,
    default: '300rpx'
  },
  height: {
    type: String,
    default: '225rpx'
  },
  bgColor: {
    type: String,
    default: '#f3f4f6'
  }
})
const { src, errorIcon } = toRefs(props);
const imageSrc = ref(src.value || errorIcon.value);
const error = e => (imageSrc.value = errorIcon.value);
watch(src,value => imageSrc.value = value || errorIcon.value)
</script>