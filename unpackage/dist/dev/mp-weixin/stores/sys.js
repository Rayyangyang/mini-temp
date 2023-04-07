"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var common_vendor = require("../common/vendor.js");
var services_sys = require("../services/sys.js");
var utils_config = require("../utils/config.js");
var useSysStore = common_vendor.defineStore("sys", {
  actions: {
    async login(payload) {
      const response = await services_sys.login(__spreadValues({}, payload));
      if ((response == null ? void 0 : response.code) == 200) {
        utils_config.setUnionuser(response.data);
        utils_config.setToken(response.data.token);
        common_vendor.index.navigateBack();
      } else {
        common_vendor.index.showToast({ title: response.msg, icon: "none", mask: true });
      }
      return response;
    },
    async service({ payload, service }) {
      const response = await services_sys.services_sys[service](__spreadValues({}, payload));
      return response;
    }
  }
});
exports.useSysStore = useSysStore;
