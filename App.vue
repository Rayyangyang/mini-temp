<script setup>
import { getUnionuser } from '@/utils/config.js';
import { onShow, onHide, onLaunch } from '@dcloudio/uni-app';
import { ref } from 'vue';
onLaunch(() => {
	console.log('App Launch');
	// #ifdef MP-WEIXIN
	const updateManager = uni.getUpdateManager();
	updateManager.onUpdateReady(() => {
		uni.showModal({
			title: '更新提示',
			content: '新版本已经准备好，是否重启应用？',
			success: res => {
				if (res.confirm) {
					// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
					updateManager.applyUpdate();
				}
			}
		});
	});
	// #endif

	// #ifdef APP-PLUS
	// 极光推送
	const jpushModule = uni.requireNativePlugin('JG-JPush');
	jpushModule?.initJPushService(); //初始化极光
	jpushModule?.setLoggerEnable(true); //开启日志 false为不开启
	jpushModule?.addConnectEventListener(result => {
		//监听链接极光推送之后设置别名alias
		let connectEnable = result.connectEnable;
		console.log(result, plus.os.name);
		if (connectEnable == true) {
			console.log('已连接');
			// 设置别名一般写在登录成功之后，一般用userId作为别名推送消息
			// 退出登录/401之后需要deleteAlias，此部分代码开发者自行处理
			// 一台手机只要设置过alias都能接到推送，删除alias就收不到。
			jpushModule.setAlias({
				alias: plus.os.name, //Android 或者 iOS
				sequence: 1
			});
			// jpushModule.deleteAlias({ 'sequence': 1 })
		} else {
			console.log('未连接');
		}
	});
	// 监听收到的推送消息
	jpushModule?.addNotificationListener(result => {
		// notificationArrived为收到推送消息，notificationOpened为点击推送消息
		const notificationEventType = result.notificationEventType;
		const messageID = result.messageID;
		const title = result.title;
		const content = result.content;
		const extras = result.extras;
		// 以下自己写业务处理代码
		console.log(notificationEventType);
		uni.showToast({
			icon: 'none',
			title: JSON.stringify(result),
			duration: 3000
		});
	});
	// #endif
});
onShow(() => {
	console.log('App Show');
	// #ifdef APP-PLUS
	const jpushModule = uni.requireNativePlugin('JG-JPush');
	jpushModule?.setBadge(0); //清除极光推送的角标
	plus.runtime.setBadgeNumber(0); //清除本地的角标
	// #endif
});
onHide(() => {
	console.log('App Hide');
});
</script>

<style lang="scss">
// 引入 uview样式
@import "@/uni_modules/uview-plus/index.scss";
/*每个页面公共css */
/* #ifdef H5 || MP-WEIXIN || APP-VUE */
page {
	background-color: #f7f7f7;
	scroll-behavior: smooth;
	box-sizing: border-box;
	padding-bottom: constant(safe-area-inset-bottom); /* 兼容 iOS < 11.2 */
	padding-bottom: env(safe-area-inset-bottom); /* 兼容 iOS >= 11.2 */
	font-family: 黑体;
}
image {
	display: block;
}
view {
	box-sizing: border-box;
}

/* start--文本行数限制--start */
.u-line-1 {
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
}
.u-line-2 {
	-webkit-line-clamp: 2;
}
.u-line-3 {
	-webkit-line-clamp: 3;
}
.u-line-4 {
	-webkit-line-clamp: 4;
}
.u-line-5 {
	-webkit-line-clamp: 5;
}
.u-line-2,
.u-line-3,
.u-line-4,
.u-line-5 {
	overflow: hidden;
	word-break: break-all;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-box-orient: vertical;
}
/* end--文本行数限制--end */
/* #endif */
</style>
