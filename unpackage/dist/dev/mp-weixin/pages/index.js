"use strict";
var common_vendor = require("../common/vendor.js");
var stores_index_home = require("../stores/index/home.js");
var stores_global = require("../stores/global.js");
require("../services/home.js");
require("../utils/request.js");
require("../utils/config.js");
require("../services/sys.js");
if (!Array) {
  const _easycom_avatar_cropper2 = common_vendor.resolveComponent("avatar-cropper");
  const _easycom_yuansheng_loadmore2 = common_vendor.resolveComponent("yuansheng-loadmore");
  (_easycom_avatar_cropper2 + _easycom_yuansheng_loadmore2)();
}
const _easycom_avatar_cropper = () => "../components/avatar-cropper/avatar-cropper.js";
const _easycom_yuansheng_loadmore = () => "../components/yuansheng-loadmore/yuansheng-loadmore.js";
if (!Math) {
  (_easycom_avatar_cropper + _easycom_yuansheng_loadmore)();
}
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const myUpload = (rsp) => {
      console.log(rsp);
      avatarUrl.value = rsp.path;
    };
    const avatarUrl = common_vendor.ref("/static/tabbar/icon_home_click@2x.png");
    const homeStore = stores_index_home.useHomeStore();
    const { pagination, loading } = common_vendor.storeToRefs(homeStore);
    stores_global.useGlobalStore();
    common_vendor.onShow(() => {
      console.log("onShow");
    });
    common_vendor.onLoad(() => {
      console.log("onLoad");
    });
    common_vendor.onReachBottom(() => {
      pagination.value;
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(myUpload),
        b: common_vendor.p({
          selWidth: "600rpx",
          selHeight: "600rpx",
          stretch: "short",
          inner: true,
          avatarSrc: avatarUrl.value,
          avatarStyle: "width: 200rpx; height: 200rpx; border-radius: 0;"
        }),
        c: common_vendor.p({
          loading: common_vendor.unref(loading),
          pagination: common_vendor.unref(pagination)
        })
      };
    };
  }
};
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-2a183b29"], ["__file", "/Users/waner/Documents/Demos/uni_demo_vue3/pages/index.vue"]]);
wx.createPage(MiniProgramPage);
