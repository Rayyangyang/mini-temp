"use strict";
var common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_uni_load_more2 = common_vendor.resolveComponent("uni-load-more");
  _easycom_uni_load_more2();
}
const _easycom_uni_load_more = () => "../../uni_modules/uni-load-more/components/uni-load-more/uni-load-more.js";
if (!Math) {
  _easycom_uni_load_more();
}
const _sfc_main = {
  __name: "yuansheng-loadmore",
  props: {
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
  },
  emits: ["clickLoadMore"],
  setup(__props, { emit: emitClickLoadMore }) {
    const contentText = {
      contentdown: "\u52A0\u8F7D\u66F4\u591A",
      contentrefresh: "\u6B63\u5728\u52A0\u8F7D...",
      contentnomore: "\u6CA1\u6709\u66F4\u591A\u4E86"
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(($event) => emitClickLoadMore("clickLoadMore", $event)),
        b: common_vendor.p({
          contentText,
          iconSize: 14,
          status: __props.loading ? "loading" : __props.pagination.current * __props.pagination.pageSize < __props.pagination.total ? "more" : "no-more"
        })
      };
    };
  }
};
var Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "/Users/waner/Documents/Demos/uni_demo_vue3/components/yuansheng-loadmore/yuansheng-loadmore.vue"]]);
wx.createComponent(Component);
