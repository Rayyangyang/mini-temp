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
var common_vendor = require("../../common/vendor.js");
var services_home = require("../../services/home.js");
var useHomeStore = common_vendor.defineStore("home", {
  state: () => ({
    list: [],
    pagination: {
      current: 1,
      pageSize: 10,
      total: 0
    }
  }),
  actions: {
    async query(payload) {
      this.pagination;
      const response = await services_home.query(__spreadValues({}, payload));
      if ((response == null ? void 0 : response.code) == 200) {
        this.list = (payload == null ? void 0 : payload.pageNum) > 1 ? this.list.concat(response.data.list) : response.data.list;
        this.pagination = {
          current: response.data.pageNum,
          pageSize: response.data.pageSize,
          total: response.data.total
        };
      }
      return response;
    },
    async service({ payload, service }) {
      const response = await services_home.services_home[service](__spreadValues({}, payload));
      return response;
    }
  }
});
exports.useHomeStore = useHomeStore;
