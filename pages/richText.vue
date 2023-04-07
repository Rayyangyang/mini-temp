<template>
	<view class="container braft-output-content">
		<rich-text :nodes="richText" space="nbsp"></rich-text>
	</view>
</template>

<script setup>
import { ref, getCurrentInstance } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import useSysStore from '@/stores/sys';
const sysStore = useSysStore();
const richText = ref('');
const outputRich = html => {
	// 美化图片
	html = html.replace(/<(img).*?(\/>|<\/img>)/g, mats => {
		if (mats.indexOf('style') < 0) {
			return mats.replace(/<\s*img/, '<img style="max-width:100%;display:block;"');
		} else {
			return mats.replace(/style=("|')/, ' style=$1max-width:100%;display:block;');
		}
	})
	// 美化p标签（留白间距）
	html = html.replace(/<(p).*?(\/>|<\/p>)/g, mats => {
		if (mats.indexOf('style') < 0) {
			return mats.replace(/<\s*p/, '<p style="min-height: 1em;"');
		} else {
			return mats.replace(/style=("|')/, ' style=$1min-height: 1em;');
		}
	})
	return html
};
onLoad(async ({ key }) => {
	if (key) {
		switch (key) {
			case '0':
				uni.setNavigationBarTitle({ title: '用户协议' });
				break;
			case '1':
				uni.setNavigationBarTitle({ title: '隐私政策' });
				break;
			case '2':
				uni.setNavigationBarTitle({ title: '关于我们' });
				break;
			default:
				break;
		}
		uni.showLoading();
		const res = await sysStore.service({ service: 'getSysParams', payload: { key } });
		// console.log(res)
		uni.hideLoading();
		if (res.code == 200) {
			richText.value = outputRich(res.data.codeValue)
		}
	} else {
		const { ctx } = getCurrentInstance();
		const eventChannel = ctx.getOpenerEventChannel();
		// 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
		eventChannel.once('transportRichText', data => richText.value = outputRich(data));
	}
});
</script>
<style scoped lang="less">
.container {
	padding: 0 30rpx;
	box-sizing: border-box;
}
</style>
