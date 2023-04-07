"use strict";
var common_vendor = require("../common/vendor.js");
var piniaLoading = ({ store }) => {
  const loading = common_vendor.ref(false);
  store.loading = loading;
  store.$subscribe(() => {
  });
  store.$onAction(({
    name,
    store: store2,
    args,
    after,
    onError
  }) => {
    loading.value = true;
    after(() => {
      loading.value = false;
    });
    onError((error) => {
      console.log("\u9519\u8BEF\u6355\u83B7", error);
    });
  });
};
exports.piniaLoading = piniaLoading;
