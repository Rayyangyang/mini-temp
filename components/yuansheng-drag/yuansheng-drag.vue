<template>
	<view class="fixedWrap" :style="[customStyle,innerStyle]" @touchmove.stop="touchmove" @touchstart="touchstart">
		<slot v-if="$slots.default"></slot>
	</view>
</template>

<script setup>
import { ref, getCurrentInstance } from 'vue';
const currentInstance = getCurrentInstance()
const props = defineProps({
	customStyle: { //自定义样式
		type: [Object, String],
		default: {
			right: '30rpx',
			bottom: 'calc(env(safe-area-inset-bottom) + 200rpx)',
		}
	}, 
})
const { windowWidth, windowHeight } = uni.getWindowInfo()
const innerStyle = ref({})
let startOffsetLeft //初始left
let startOffsetTop //初始top
let startPageX //初始x
let startPageY //初始y
let wrapWidth //容器宽度
let wrapHeight //容器高度
const touchstart = e => {
	const { offsetLeft, offsetTop } = e.currentTarget
	startOffsetLeft = offsetLeft
	startOffsetTop = offsetTop
	const { pageX, pageY } = e.touches[0]
	startPageX = pageX
	startPageY = pageY
	if(!wrapWidth && !wrapHeight) {
		uni.createSelectorQuery()
			.in(currentInstance)
		  .select('.fixedWrap')
		  .boundingClientRect(data => {
				wrapWidth = data.width
				wrapHeight = data.height
			})
		  .exec()
	}
}
const touchmove = e => {
	const { pageX: endPageX, pageY: endPageY } = e.touches[0]
	// console.log(endPageX, endPageY)
	let left = endPageX - startPageX + startOffsetLeft
	if(left <= 0) { //左边界
		left = 0
	}
	if(left >= windowWidth - wrapWidth) { //右边界
		left = windowWidth - wrapWidth
	}
	
	let top = endPageY - startPageY + startOffsetTop
	if(top <= 0) { //上边界
		top = 0
	}
	if(top >= windowHeight - wrapHeight) { //下边界
		top = windowHeight - wrapHeight
	}
	
	innerStyle.value = { left: left + 'px', top: top + 'px', right: 'auto', bottom: 'auto' }
}
</script>

<style scoped lang="less">
.fixedWrap{
	position: fixed;
	z-index: 100;
}
</style>