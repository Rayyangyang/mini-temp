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
var useGlobalStore = common_vendor.defineStore("global", {
  state: () => ({
    apkInfo: {},
    haveNew: false
  }),
  actions: {
    async checkAndroidUpdate(payload) {
      const response = await services_sys.checkAndroidUpdate(__spreadValues({}, payload));
      if (response.id) {
        this.apkInfo = response;
        plus.runtime.getProperty(plus.runtime.appid, (res) => {
          if (res.version != response.newVersion) {
            setTimeout(() => common_vendor.index.getSubNVueById("appUpdate").show(), 500);
            this.haveNew = true;
          }
        });
      }
      return response;
    }
  }
});
exports.useGlobalStore = useGlobalStore;
