"use strict";
var common_vendor = require("../common/vendor.js");
var stores_sys = require("../stores/sys.js");
require("../services/sys.js");
require("../utils/request.js");
require("../utils/config.js");
const _sfc_main = {
  __name: "richText",
  setup(__props) {
    const sysStore = stores_sys.useSysStore();
    const richText = common_vendor.ref("");
    common_vendor.onLoad(async ({ key }) => {
      if (key) {
        switch (key) {
          case "0":
            common_vendor.index.setNavigationBarTitle({ title: "\u7528\u6237\u534F\u8BAE" });
            break;
          case "1":
            common_vendor.index.setNavigationBarTitle({ title: "\u9690\u79C1\u653F\u7B56" });
            break;
          case "2":
            common_vendor.index.setNavigationBarTitle({ title: "\u5173\u4E8E\u6211\u4EEC" });
            break;
        }
        common_vendor.index.showLoading();
        const res = await sysStore.service({ service: "getSysParams", payload: { key } });
        common_vendor.index.hideLoading();
        if (res.code == 200) {
          richText.value = res.data.codeValue.replace(/<img/g, `<img style="max-width:100%;display:block"`);
        }
      } else {
        const { ctx } = common_vendor.getCurrentInstance();
        const eventChannel = ctx.getOpenerEventChannel();
        eventChannel.once("transportRichText", (data) => {
          richText.value = data == null ? void 0 : data.replace(/<img/g, `<img style="max-width:100%;display:block"`);
        });
      }
    });
    return (_ctx, _cache) => {
      return {
        a: richText.value
      };
    };
  }
};
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-f7aef5bc"], ["__file", "/Users/waner/Documents/Demos/uni_demo_vue3/pages/richText.vue"]]);
wx.createPage(MiniProgramPage);
