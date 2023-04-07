"use strict";
var utils_request = require("../utils/request.js");
async function query(data) {
  return utils_request.request("/home/home", { data });
}
async function queryGoodsList(data) {
  return utils_request.request("/goods/goodsZone", { data });
}
async function queryHotWordList(data) {
  return utils_request.request("/home/hotWord", { data });
}
var services_home = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  query,
  queryGoodsList,
  queryHotWordList
});
exports.query = query;
exports.services_home = services_home;
