"use strict";
var utils_request = require("../utils/request.js");
async function getSysParams(data) {
  return utils_request.request("/common/getCode", { data });
}
async function getTimestamp(data) {
  return utils_request.request("/user/getCurSysTimestamp", { data });
}
async function getMsgCode(data) {
  return utils_request.request("/user/msgCode", { data });
}
async function login(data) {
  return utils_request.request("/user/login", { data });
}
async function feedback(data) {
  return utils_request.request("/user/feedback", { data, method: "POST" });
}
async function contact(data) {
  return utils_request.request("/user/staff", { data });
}
async function changePhone(data) {
  return utils_request.request("/user/updateAccount", { data, method: "POST" });
}
async function checkAndroidUpdate(data) {
  return utils_request.request("/common/checkUpdate", { data });
}
var services_sys = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  getSysParams,
  getTimestamp,
  getMsgCode,
  login,
  feedback,
  contact,
  changePhone,
  checkAndroidUpdate
});
exports.checkAndroidUpdate = checkAndroidUpdate;
exports.login = login;
exports.services_sys = services_sys;
