<template>
  <view class="container">
    <avatar-cropper
      selWidth="600rpx"
      selHeight="600rpx"
      stretch="short"
      :inner="true"
      @upload="myUpload"
      :avatarSrc="avatarUrl"
      avatarStyle="width: 200rpx; height: 200rpx; border-radius: 0;"
    ></avatar-cropper>

    <yuansheng-loadmore
      :loading="loading"
      :pagination="pagination"
    ></yuansheng-loadmore>

    <button @click="toInfo">123</button>
    <u-button type="primary" text="确定"></u-button>
  </view>
</template>

<script setup>
  import { onShow, onLoad, onReachBottom } from '@dcloudio/uni-app';
  import { onMounted, ref } from 'vue';
  import useHomeStore from '@/stores/index/home';
  import useGlobalStore from '@/stores/global';
  import { storeToRefs } from 'pinia'
  const myUpload = rsp => {
    // this.url = rsp.path; //更新头像方式一
    //rsp.avatar.imgSrc = rsp.path; //更新头像方式二
    console.log(rsp);
    avatarUrl.value = rsp.path
  };
  const avatarUrl = ref('/static/tabbar/icon_home_click@2x.png');

  const homeStore = useHomeStore()
  // const { pagination, loading } = homeStore  // ❌ 这不起作用，因为它会破坏响应式 // 这和从 props 解构是一样的
  const { pagination, loading } = storeToRefs(homeStore)
  const globalStore = useGlobalStore()

  const toInfo = ()=>{
    uni.navigateTo({
       url: 'info?id=1&name=sunny'
    });
  }

  onShow(() => {
    console.log('onShow');
  });
  onLoad(() => {
    console.log('onLoad');
  });

  onMounted(()=>{
  	console.log(123111)
  })

  onReachBottom(() => {
    const { current, pageSize, total } = pagination.value;
    if (current * pageSize < total) {
      // homeStore.query({ pageNum: current + 1 })
    }
  });
</script>

<style>
  page {
    padding-bottom: 0;
  }
</style>
<style scoped lang="less">
  .container {
  }
</style>
