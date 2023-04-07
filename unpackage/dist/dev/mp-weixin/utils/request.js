"use strict";
var common_vendor = require("../common/vendor.js");
var utils_config = require("./config.js");
let isShowModal = false;
async function request(url, { data, method, requestType }) {
  Object.keys(data).forEach((key) => [void 0, null].includes(data[key]) && delete data[key]);
  if (url.substr(0, 4) != "http")
    url = utils_config.requestUrl + url;
  console.log(url, data);
  const timestamp = new Date().getTime();
  const rand = Math.floor(Math.random() * 100);
  const response = await common_vendor.index.request({
    url,
    data,
    method: (method == null ? void 0 : method.toUpperCase()) || "GET",
    header: {
      "Content-Type": requestType == "json" ? "application/json" : "application/x-www-form-urlencoded",
      "token": utils_config.getToken() || "",
      "api-version": 1,
      timestamp,
      rand,
      apiSecret: common_vendor.md5(common_vendor.md5(timestamp + "ccys" + rand))
    }
  }).then((res) => {
    if (res.statusCode == 200) {
      return res.data;
    } else if (res.statusCode == 401) {
      common_vendor.index.removeStorageSync("unionuser");
      common_vendor.index.removeStorageSync("token");
      common_vendor.index.hideLoading();
      common_vendor.index.hideToast();
      if (!isShowModal) {
        isShowModal = true;
        common_vendor.index.showModal({
          title: "\u6CE8\u610F",
          content: "\u60A8\u7684\u767B\u5F55\u4FE1\u606F\u5DF2\u8FC7\u671F\uFF0C\u8BF7\u91CD\u65B0\u767B\u5F55\uFF01",
          showCancel: false,
          success: (res2) => {
            if (res2.confirm) {
              console.log("\u7528\u6237\u70B9\u51FB\u786E\u5B9A");
              isShowModal = false;
            }
          }
        });
      }
      throw res;
    } else {
      if (!isShowModal) {
        isShowModal = true;
        common_vendor.index.showModal({
          title: String(res.data.status),
          content: res.data.error,
          showCancel: false,
          confirmText: "\u77E5\u9053\u4E86",
          success: (res2) => {
            if (res2.confirm) {
              isShowModal = false;
            }
          }
        });
      }
    }
  }).catch((res) => {
    console.log(res, "catchRes");
    if (!isShowModal && !res.statusCode) {
      isShowModal = true;
      common_vendor.index.showModal({
        title: "\u7F51\u7EDC\u9519\u8BEF",
        content: "net::ERR_FAILED",
        showCancel: false,
        confirmText: "\u77E5\u9053\u4E86",
        success: (res2) => {
          if (res2.confirm) {
            isShowModal = false;
          }
        }
      });
    }
    throw res;
  });
  return response;
}
exports.request = request;
