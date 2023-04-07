<!-- 
 * 上传文件
 * @作者：郑超
 * @公司：四川源昇科技公司
 * @版本：v2.0.0
 -->
<template>
	<view>
		<view class="container">
			<template v-for="(item, index) in modelValue" :key="index">
				<view class="imgBox" :style="boxStyle">
					<image @click="handlePreview(item)" mode="aspectFill" class="uploadIcon" :src="handleMediaUrl(item)"></image>
					<uni-icons v-if="closeAble" @click="handleDelete(index)" class="deleteIcon" type="clear" color="#f50" :size="24"></uni-icons>
				</view>
			</template>

			<view v-if="modelValue.length < maxCount" @click="handleUploadChange()">
				<slot v-if="$slots.default"></slot>
				<view v-else class="imgBox" :style="boxStyle"><image class="uploadIcon" src="./icon_upload@2x.png"></image></view>
			</view>
		</view>
		<!-- #ifdef APP-PLUS -->
		<!-- 此容器解决ios下video仍然有高度占位的问题 -->
		<view style="width: 0;height: 0;,overflow: hidden;" v-if="fileType !== 'image'">
			<video @fullscreenchange="fullscreenchange" style="width: 1px; height: 1px;opacity: 0;" playsinline preload="auto" :src="videoSrc" id="myVideo" :autoplay="true"></video>
		</view>
		<!-- #endif -->
	</view>
</template>

<script setup>
import { ossHost, ossSuffix, getToken } from '@/utils/config.js';
import { getOSSData, getSuffix, randomString } from '@/utils/utils.js';
import { ref, onMounted } from 'vue';
const props = defineProps({
	// 默认值
	modelValue: {
		//文件数组由父级传值
		type: Array,
		default: []
	},
	maxCount: {
		//文件最大上传数量
		type: Number,
		default: 9
	},
	fileType: {
		type: String,
		default: 'image' //video为视频，默认image, *为所有(对应chooseMedia为 mix)
	},
	boxStyle: {
		type: String,
		default: ''
	},
	closeAble: {
		type: Boolean,
		default: true
	}
});
const handleMediaUrl = record => {
	const fileType = /.avi|.wmv|.mpeg|.mp4|.m4v|.mov|.asf|.flv|.f4v|.rmvb|.rm|.3gp|.vob/.test(getSuffix(record.url)) ? 'video' : 'image';
	return fileType == 'video' ? record.url + ossSuffix : record.url;
};
const formData = ref({});
const videoSrc = ref('');
// #ifdef APP-PLUS
const videoContext = uni.createVideoContext('myVideo'); //获取video实例
// #endif
onMounted(async () => {
	if (getToken()) {
		formData.value = await getOSSData();
	}
});
const emit = defineEmits(['update:modelValue']);
const handleDelete = index => {
	emit('update:modelValue', props.modelValue.filter((_, i) => index !== i));
};
const handleUploadChange = async fileType => {
	// #ifdef APP-PLUS || H5
	const type = fileType || props.fileType;
	switch (type) {
		case '*':
			const { tapIndex } = await uni.showActionSheet({ itemList: ['视频', '图片'] });
			handleUploadChange(['video', 'image'][tapIndex]);
			break;
		case 'image':
			const { tempFiles } = await uni.chooseImage({
				count: props.maxCount - props.modelValue.length, //最大值减去数组的长度,
				sourceType: ['album', 'camera'] // 可以指定来源是相册还是相机，默认二者都有
			});
			upload(tempFiles);
			break;
		case 'video':
			const { tempFilePath } = await uni.chooseVideo({ sourceType: ['camera', 'album'] });
			upload([{ path: tempFilePath }]);
			break;
		default:
			handleUploadChange('image');
			break;
	}
	// #endif
	
	// #ifdef MP-WEIXIN
	const { tempFiles } = await uni.chooseMedia({
		count: props.maxCount - props.modelValue.length, //最大值减去数组的长度,
		mediaType: { video: ['video'], '*': ['mix'], image: ['image'] }[props.fileType] || ['image'],
		sourceType: ['album', 'camera'] // 可以指定来源是相册还是相机，默认二者都有
	});
	upload(tempFiles);
	// #endif
};
const upload = files => {
	uni.showLoading({ title: '上传中...', mask: true });
	const promiseArr = files.map(item => {
		return new Promise((resolve, reject) => {
			// #ifdef MP-WEIXIN
			item.fileName = `uni/${randomString(10)}${getSuffix(item.tempFilePath)}`;
			// #endif
			// #ifdef APP-PLUS  ||  H5
			item.fileName = `uni/${randomString(10)}${getSuffix(item.path)}`;
			// #endif
			uni.uploadFile({
				url: ossHost, // 开发者服务器的URL。
				// #ifdef MP-WEIXIN
				filePath: item.tempFilePath,
				// #endif
				// #ifdef APP-PLUS || H5
				filePath: item.path,
				// #endif
				name: 'file', // 必须填file。
				formData: {
					key: item.fileName,
					...formData.value,
					success_action_status: '200'
				},
				success: res => {
					item.url = `${ossHost}/${item.fileName}`;
					if (res.statusCode === 200) {
						resolve(item);
					} else {
						reject(res);
					}
				}
			});
		});
	});
	Promise.all(promiseArr.filter(r => r))
		.then(res => {
			uni.hideLoading();
			emit('update:modelValue', props.modelValue.concat(res));
		})
		.catch(err => {
			uni.hideLoading();
			uni.showModal({
				title: `上传失败`,
				content: `OSS上传失败：${err.statusCode}`,
				showCancel: false,
				confirmText: '知道了'
			});
		});
};
// #ifdef APP-PLUS
const fullscreenchange = e => {
	if (e.detail.fullScreen) {
		//全屏时候播放
		videoContext.seek(0);
		videoContext.play();
	} else {
		videoContext.pause();
	}
};
// #endif
const handlePreview = record => {
	const fileType = /.avi|.wmv|.mpeg|.mp4|.m4v|.mov|.asf|.flv|.f4v|.rmvb|.rm|.3gp|.vob/.test(getSuffix(record.url)) ? 'video' : 'image';
	switch (fileType) {
		case 'video':
			// #ifdef APP-PLUS
			videoSrc.value = record.url;
			// 进入全屏状态
			videoContext.requestFullScreen({ direction: 0 });
			// #endif
			// #ifdef MP-WEIXIN
			wx.previewMedia({ sources: [{ url: record.url, type: 'video', poster: record.url + ossSuffix }] }); //设置封面第一次点击无法播放
			// #endif
			break;
		default:
			uni.previewImage({ urls: [record.url] });
			break;
	}
};
</script>

<style lang="scss" scoped>
.container {
	display: flex;
	flex-wrap: wrap;
	gap: 30rpx;
}

.imgBox {
	width: 200rpx;
	height: 200rpx;
	position: relative;
	border-radius: 10rpx;
	overflow: hidden;

	.deleteIcon {
		position: absolute;
		right: 0rpx;
		top: 0rpx;
	}
}

.uploadIcon {
	width: 100%;
	height: 100%;
	display: block;
}
</style>
