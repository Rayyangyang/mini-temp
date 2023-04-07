"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports[Symbol.toStringTag] = "Module";
var common_vendor = require("./common/vendor.js");
var stores_piniaLoading = require("./stores/pinia-loading.js");
var utils_config = require("./utils/config.js");
if (!Math) {
  "./pages/index.js";
  "./pages/drive.js";
  "./pages/mine.js";
  "./pages/richText.js";
}
const _sfc_main = {
  __name: "App",
  setup(__props) {
    common_vendor.onLaunch(() => {
      console.log("App Launch");
      const updateManager = common_vendor.index.getUpdateManager();
      updateManager.onUpdateReady(() => {
        common_vendor.index.showModal({
          title: "\u66F4\u65B0\u63D0\u793A",
          content: "\u65B0\u7248\u672C\u5DF2\u7ECF\u51C6\u5907\u597D\uFF0C\u662F\u5426\u91CD\u542F\u5E94\u7528\uFF1F",
          success: (res) => {
            if (res.confirm) {
              updateManager.applyUpdate();
            }
          }
        });
      });
    });
    common_vendor.onShow(() => {
      console.log("App Show");
    });
    common_vendor.onHide(() => {
      console.log("App Hide");
    });
    return () => {
    };
  }
};
var App = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "/Users/waner/Documents/Demos/uni_demo_vue3/App.vue"]]);
const app = common_vendor.createSSRApp(App);
const pinia = common_vendor.createPinia();
pinia.use(stores_piniaLoading.piniaLoading);
app.use(pinia);
app.config.globalProperties.$isLogin = () => {
  if (!utils_config.getUnionuser()) {
    common_vendor.index.showModal({
      title: "\u6E29\u99A8\u63D0\u793A",
      content: "\u8BF7\u5148\u767B\u5F55/\u6CE8\u518C\uFF01",
      confirmText: "\u786E\u5B9A",
      success: (res) => {
        if (res.confirm) {
          common_vendor.index.navigateTo({ url: "/pages/login" });
        }
      }
    });
    return true;
  }
};
app.config.globalProperties.$format = (value, format = "YYYY-MM-DD") => value ? common_vendor.dayjs(value).format(format) : "";
app.config.globalProperties.$distance = (value) => Number(value) > 1e3 ? (Number(value) / 1e3).toFixed(2) + "km" : Number(value) + "m";
app.config.globalProperties.$decimal = (value, precision = 2) => Number(value).toFixed(precision);
function createApp() {
  return {
    app,
    Pinia: common_vendor.Pinia
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
