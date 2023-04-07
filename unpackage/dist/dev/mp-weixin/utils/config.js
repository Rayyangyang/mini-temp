"use strict";
var common_vendor = require("../common/vendor.js");
const requestUrl = "http://47.106.228.230:8080/yijie";
const getToken = () => {
  try {
    return common_vendor.index.getStorageSync("token");
  } catch (e) {
  }
  return null;
};
const setToken = (token) => {
  try {
    return common_vendor.index.setStorageSync("token", token);
  } catch (e) {
  }
  return null;
};
const getUnionuser = () => {
  try {
    return common_vendor.index.getStorageSync("unionuser");
  } catch (e) {
  }
  return null;
};
const setUnionuser = (unionuser) => {
  try {
    return common_vendor.index.setStorageSync("unionuser", unionuser);
  } catch (e) {
  }
  return null;
};
exports.getToken = getToken;
exports.getUnionuser = getUnionuser;
exports.requestUrl = requestUrl;
exports.setToken = setToken;
exports.setUnionuser = setUnionuser;
