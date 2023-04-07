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
import { ref, openBlock, createElementBlock, createElementVNode, toDisplayString, unref, Fragment, createVNode, createCommentVNode } from "vue";
import { defineStore, storeToRefs } from "pinia";
function getCurrentSubNVue() {
  return uni.getSubNVueById(plus.webview.currentWebview().id);
}
function formatAppLog(type, filename, ...args) {
  if (uni.__log__) {
    uni.__log__(type, filename, ...args);
  } else {
    console[type].apply(console, [...args, filename]);
  }
}
var _imports_0 = "/static/app-plus/lib_update_app_top_bg.png";
var _imports_1 = "/static/app-plus/lib_update_app_close.png";
const requestUrl = "http://47.106.228.230:8080/yijie";
const getToken = () => {
  try {
    return uni.getStorageSync("token");
  } catch (e) {
  }
  return null;
};
var md5$1 = { exports: {} };
var crypt = { exports: {} };
(function() {
  var base64map = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", crypt$1 = {
    rotl: function(n, b) {
      return n << b | n >>> 32 - b;
    },
    rotr: function(n, b) {
      return n << 32 - b | n >>> b;
    },
    endian: function(n) {
      if (n.constructor == Number) {
        return crypt$1.rotl(n, 8) & 16711935 | crypt$1.rotl(n, 24) & 4278255360;
      }
      for (var i = 0; i < n.length; i++)
        n[i] = crypt$1.endian(n[i]);
      return n;
    },
    randomBytes: function(n) {
      for (var bytes = []; n > 0; n--)
        bytes.push(Math.floor(Math.random() * 256));
      return bytes;
    },
    bytesToWords: function(bytes) {
      for (var words = [], i = 0, b = 0; i < bytes.length; i++, b += 8)
        words[b >>> 5] |= bytes[i] << 24 - b % 32;
      return words;
    },
    wordsToBytes: function(words) {
      for (var bytes = [], b = 0; b < words.length * 32; b += 8)
        bytes.push(words[b >>> 5] >>> 24 - b % 32 & 255);
      return bytes;
    },
    bytesToHex: function(bytes) {
      for (var hex = [], i = 0; i < bytes.length; i++) {
        hex.push((bytes[i] >>> 4).toString(16));
        hex.push((bytes[i] & 15).toString(16));
      }
      return hex.join("");
    },
    hexToBytes: function(hex) {
      for (var bytes = [], c = 0; c < hex.length; c += 2)
        bytes.push(parseInt(hex.substr(c, 2), 16));
      return bytes;
    },
    bytesToBase64: function(bytes) {
      for (var base64 = [], i = 0; i < bytes.length; i += 3) {
        var triplet = bytes[i] << 16 | bytes[i + 1] << 8 | bytes[i + 2];
        for (var j = 0; j < 4; j++)
          if (i * 8 + j * 6 <= bytes.length * 8)
            base64.push(base64map.charAt(triplet >>> 6 * (3 - j) & 63));
          else
            base64.push("=");
      }
      return base64.join("");
    },
    base64ToBytes: function(base64) {
      base64 = base64.replace(/[^A-Z0-9+\/]/ig, "");
      for (var bytes = [], i = 0, imod4 = 0; i < base64.length; imod4 = ++i % 4) {
        if (imod4 == 0)
          continue;
        bytes.push((base64map.indexOf(base64.charAt(i - 1)) & Math.pow(2, -2 * imod4 + 8) - 1) << imod4 * 2 | base64map.indexOf(base64.charAt(i)) >>> 6 - imod4 * 2);
      }
      return bytes;
    }
  };
  crypt.exports = crypt$1;
})();
var charenc = {
  utf8: {
    stringToBytes: function(str) {
      return charenc.bin.stringToBytes(unescape(encodeURIComponent(str)));
    },
    bytesToString: function(bytes) {
      return decodeURIComponent(escape(charenc.bin.bytesToString(bytes)));
    }
  },
  bin: {
    stringToBytes: function(str) {
      for (var bytes = [], i = 0; i < str.length; i++)
        bytes.push(str.charCodeAt(i) & 255);
      return bytes;
    },
    bytesToString: function(bytes) {
      for (var str = [], i = 0; i < bytes.length; i++)
        str.push(String.fromCharCode(bytes[i]));
      return str.join("");
    }
  }
};
var charenc_1 = charenc;
/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
var isBuffer_1 = function(obj) {
  return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer);
};
function isBuffer(obj) {
  return !!obj.constructor && typeof obj.constructor.isBuffer === "function" && obj.constructor.isBuffer(obj);
}
function isSlowBuffer(obj) {
  return typeof obj.readFloatLE === "function" && typeof obj.slice === "function" && isBuffer(obj.slice(0, 0));
}
(function() {
  var crypt$1 = crypt.exports, utf8 = charenc_1.utf8, isBuffer2 = isBuffer_1, bin = charenc_1.bin, md52 = function(message, options) {
    if (message.constructor == String)
      if (options && options.encoding === "binary")
        message = bin.stringToBytes(message);
      else
        message = utf8.stringToBytes(message);
    else if (isBuffer2(message))
      message = Array.prototype.slice.call(message, 0);
    else if (!Array.isArray(message) && message.constructor !== Uint8Array)
      message = message.toString();
    var m = crypt$1.bytesToWords(message), l = message.length * 8, a = 1732584193, b = -271733879, c = -1732584194, d = 271733878;
    for (var i = 0; i < m.length; i++) {
      m[i] = (m[i] << 8 | m[i] >>> 24) & 16711935 | (m[i] << 24 | m[i] >>> 8) & 4278255360;
    }
    m[l >>> 5] |= 128 << l % 32;
    m[(l + 64 >>> 9 << 4) + 14] = l;
    var FF = md52._ff, GG = md52._gg, HH = md52._hh, II = md52._ii;
    for (var i = 0; i < m.length; i += 16) {
      var aa = a, bb = b, cc = c, dd = d;
      a = FF(a, b, c, d, m[i + 0], 7, -680876936);
      d = FF(d, a, b, c, m[i + 1], 12, -389564586);
      c = FF(c, d, a, b, m[i + 2], 17, 606105819);
      b = FF(b, c, d, a, m[i + 3], 22, -1044525330);
      a = FF(a, b, c, d, m[i + 4], 7, -176418897);
      d = FF(d, a, b, c, m[i + 5], 12, 1200080426);
      c = FF(c, d, a, b, m[i + 6], 17, -1473231341);
      b = FF(b, c, d, a, m[i + 7], 22, -45705983);
      a = FF(a, b, c, d, m[i + 8], 7, 1770035416);
      d = FF(d, a, b, c, m[i + 9], 12, -1958414417);
      c = FF(c, d, a, b, m[i + 10], 17, -42063);
      b = FF(b, c, d, a, m[i + 11], 22, -1990404162);
      a = FF(a, b, c, d, m[i + 12], 7, 1804603682);
      d = FF(d, a, b, c, m[i + 13], 12, -40341101);
      c = FF(c, d, a, b, m[i + 14], 17, -1502002290);
      b = FF(b, c, d, a, m[i + 15], 22, 1236535329);
      a = GG(a, b, c, d, m[i + 1], 5, -165796510);
      d = GG(d, a, b, c, m[i + 6], 9, -1069501632);
      c = GG(c, d, a, b, m[i + 11], 14, 643717713);
      b = GG(b, c, d, a, m[i + 0], 20, -373897302);
      a = GG(a, b, c, d, m[i + 5], 5, -701558691);
      d = GG(d, a, b, c, m[i + 10], 9, 38016083);
      c = GG(c, d, a, b, m[i + 15], 14, -660478335);
      b = GG(b, c, d, a, m[i + 4], 20, -405537848);
      a = GG(a, b, c, d, m[i + 9], 5, 568446438);
      d = GG(d, a, b, c, m[i + 14], 9, -1019803690);
      c = GG(c, d, a, b, m[i + 3], 14, -187363961);
      b = GG(b, c, d, a, m[i + 8], 20, 1163531501);
      a = GG(a, b, c, d, m[i + 13], 5, -1444681467);
      d = GG(d, a, b, c, m[i + 2], 9, -51403784);
      c = GG(c, d, a, b, m[i + 7], 14, 1735328473);
      b = GG(b, c, d, a, m[i + 12], 20, -1926607734);
      a = HH(a, b, c, d, m[i + 5], 4, -378558);
      d = HH(d, a, b, c, m[i + 8], 11, -2022574463);
      c = HH(c, d, a, b, m[i + 11], 16, 1839030562);
      b = HH(b, c, d, a, m[i + 14], 23, -35309556);
      a = HH(a, b, c, d, m[i + 1], 4, -1530992060);
      d = HH(d, a, b, c, m[i + 4], 11, 1272893353);
      c = HH(c, d, a, b, m[i + 7], 16, -155497632);
      b = HH(b, c, d, a, m[i + 10], 23, -1094730640);
      a = HH(a, b, c, d, m[i + 13], 4, 681279174);
      d = HH(d, a, b, c, m[i + 0], 11, -358537222);
      c = HH(c, d, a, b, m[i + 3], 16, -722521979);
      b = HH(b, c, d, a, m[i + 6], 23, 76029189);
      a = HH(a, b, c, d, m[i + 9], 4, -640364487);
      d = HH(d, a, b, c, m[i + 12], 11, -421815835);
      c = HH(c, d, a, b, m[i + 15], 16, 530742520);
      b = HH(b, c, d, a, m[i + 2], 23, -995338651);
      a = II(a, b, c, d, m[i + 0], 6, -198630844);
      d = II(d, a, b, c, m[i + 7], 10, 1126891415);
      c = II(c, d, a, b, m[i + 14], 15, -1416354905);
      b = II(b, c, d, a, m[i + 5], 21, -57434055);
      a = II(a, b, c, d, m[i + 12], 6, 1700485571);
      d = II(d, a, b, c, m[i + 3], 10, -1894986606);
      c = II(c, d, a, b, m[i + 10], 15, -1051523);
      b = II(b, c, d, a, m[i + 1], 21, -2054922799);
      a = II(a, b, c, d, m[i + 8], 6, 1873313359);
      d = II(d, a, b, c, m[i + 15], 10, -30611744);
      c = II(c, d, a, b, m[i + 6], 15, -1560198380);
      b = II(b, c, d, a, m[i + 13], 21, 1309151649);
      a = II(a, b, c, d, m[i + 4], 6, -145523070);
      d = II(d, a, b, c, m[i + 11], 10, -1120210379);
      c = II(c, d, a, b, m[i + 2], 15, 718787259);
      b = II(b, c, d, a, m[i + 9], 21, -343485551);
      a = a + aa >>> 0;
      b = b + bb >>> 0;
      c = c + cc >>> 0;
      d = d + dd >>> 0;
    }
    return crypt$1.endian([a, b, c, d]);
  };
  md52._ff = function(a, b, c, d, x, s, t) {
    var n = a + (b & c | ~b & d) + (x >>> 0) + t;
    return (n << s | n >>> 32 - s) + b;
  };
  md52._gg = function(a, b, c, d, x, s, t) {
    var n = a + (b & d | c & ~d) + (x >>> 0) + t;
    return (n << s | n >>> 32 - s) + b;
  };
  md52._hh = function(a, b, c, d, x, s, t) {
    var n = a + (b ^ c ^ d) + (x >>> 0) + t;
    return (n << s | n >>> 32 - s) + b;
  };
  md52._ii = function(a, b, c, d, x, s, t) {
    var n = a + (c ^ (b | ~d)) + (x >>> 0) + t;
    return (n << s | n >>> 32 - s) + b;
  };
  md52._blocksize = 16;
  md52._digestsize = 16;
  md5$1.exports = function(message, options) {
    if (message === void 0 || message === null)
      throw new Error("Illegal argument " + message);
    var digestbytes = crypt$1.wordsToBytes(md52(message, options));
    return options && options.asBytes ? digestbytes : options && options.asString ? bin.bytesToString(digestbytes) : crypt$1.bytesToHex(digestbytes);
  };
})();
var md5 = md5$1.exports;
let isShowModal = false;
async function request(url, { data, method, requestType }) {
  Object.keys(data).forEach((key) => [void 0, null].includes(data[key]) && delete data[key]);
  if (url.substr(0, 4) != "http")
    url = requestUrl + url;
  formatAppLog("log", "at utils/request.js:8", url, data);
  const timestamp = new Date().getTime();
  const rand = Math.floor(Math.random() * 100);
  const response = await uni.request({
    url,
    data,
    method: (method == null ? void 0 : method.toUpperCase()) || "GET",
    header: {
      "Content-Type": requestType == "json" ? "application/json" : "application/x-www-form-urlencoded",
      "token": getToken() || "",
      "api-version": 1,
      timestamp,
      rand,
      apiSecret: md5(md5(timestamp + "ccys" + rand))
    }
  }).then((res) => {
    if (res.statusCode == 200) {
      return res.data;
    } else if (res.statusCode == 401) {
      uni.removeStorageSync("unionuser");
      uni.removeStorageSync("token");
      uni.hideLoading();
      uni.hideToast();
      if (!isShowModal) {
        isShowModal = true;
        uni.showModal({
          title: "\u6CE8\u610F",
          content: "\u60A8\u7684\u767B\u5F55\u4FE1\u606F\u5DF2\u8FC7\u671F\uFF0C\u8BF7\u91CD\u65B0\u767B\u5F55\uFF01",
          showCancel: false,
          success: (res2) => {
            if (res2.confirm) {
              formatAppLog("log", "at utils/request.js:40", "\u7528\u6237\u70B9\u51FB\u786E\u5B9A");
              isShowModal = false;
            }
          }
        });
      }
      throw res;
    } else {
      if (!isShowModal) {
        isShowModal = true;
        uni.showModal({
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
    formatAppLog("log", "at utils/request.js:64", res, "catchRes");
    if (!isShowModal && !res.statusCode) {
      isShowModal = true;
      uni.showModal({
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
async function checkAndroidUpdate(data) {
  return request("/common/checkUpdate", { data });
}
var useGlobalStore = defineStore("global", {
  state: () => ({
    apkInfo: {},
    haveNew: false
  }),
  actions: {
    async checkAndroidUpdate(payload) {
      const response = await checkAndroidUpdate(__spreadValues({}, payload));
      if (response.id) {
        this.apkInfo = response;
        plus.runtime.getProperty(plus.runtime.appid, (res) => {
          if (res.version != response.newVersion) {
            setTimeout(() => uni.getSubNVueById("appUpdate").show(), 500);
            this.haveNew = true;
          }
        });
      }
      return response;
    }
  }
});
var _style_0 = { "container": { "": { "position": "relative", "flex": 1, "justifyContent": "center", "alignItems": "center" } }, "updateWrap": { "": { "alignItems": "center" } }, "topIcon": { ".updateWrap ": { "width": "640rpx" } }, "updateContent": { ".updateWrap ": { "width": "640rpx", "backgroundColor": "#ffffff", "paddingTop": "30rpx", "paddingRight": "30rpx", "paddingBottom": "30rpx", "paddingLeft": "30rpx" } }, "updateTitleText": { ".updateWrap .updateContent ": { "fontSize": "32rpx", "color": "#333333" } }, "updateDescText": { ".updateWrap .updateContent ": { "fontSize": "28rpx", "color": "#666666", "marginTop": "10rpx" } }, "downloadProgress": { ".updateWrap .updateContent ": { "marginTop": "20rpx" } }, "downLoadText": { ".updateWrap .updateContent ": { "fontSize": "28rpx", "color": "#666666", "marginTop": "10rpx", "textAlign": "center" } }, "updateBtnText": { ".updateWrap .updateContent ": { "width": "580rpx", "height": "80rpx", "textAlign": "center", "backgroundColor": "#e84339", "color": "#ffffff", "lineHeight": "80rpx", "borderRadius": "20rpx", "fontSize": "34rpx", "marginTop": "20rpx" } }, "line": { ".updateWrap ": { "borderLeftWidth": 1, "borderLeftStyle": "solid", "borderLeftColor": "#ffffff", "width": 0, "height": "100rpx" } }, "closeIcon": { ".updateWrap ": { "width": "60rpx" } } };
var _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _sfc_main = {
  __name: "appUpdate",
  setup(__props) {
    const globalStore = useGlobalStore();
    const { apkInfo } = storeToRefs(globalStore);
    const downloading = ref(false);
    const progress = ref(0);
    let downloadTask;
    const handleClose = () => {
      getCurrentSubNVue().hide();
      downloadTask == null ? void 0 : downloadTask.abort();
    };
    const handleUpdate = () => {
      downloading.value = true;
      downloadTask = uni.downloadFile({
        url: apkInfo.value.apkFileUrl,
        success: (res) => {
          plus.runtime.install(res.tempFilePath, { force: true }, () => plus.runtime.restart());
        }
      });
      downloadTask.onProgressUpdate((res) => progress.value = res.progress);
    };
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("scroll-view", {
        scrollY: true,
        showScrollbar: true,
        enableBackToTop: true,
        bubble: "true",
        style: { flexDirection: "column" }
      }, [
        createElementVNode("view", { class: "container" }, [
          createElementVNode("view", { class: "updateWrap" }, [
            createElementVNode("u-image", {
              class: "topIcon",
              mode: "widthFix",
              src: _imports_0
            }),
            createElementVNode("view", { class: "updateContent" }, [
              createElementVNode("u-text", { class: "updateTitleText" }, "\u68C0\u6D4B\u5230\u6709\u65B0\u7684\u7248\u672Cv." + toDisplayString(unref(apkInfo).newVersion) + " \u662F\u5426\u66F4\u65B0\uFF1F", 1),
              createElementVNode("u-text", { class: "updateDescText" }, toDisplayString(unref(apkInfo).updateLog), 1),
              downloading.value ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
                createVNode(unref(progress), {
                  percent: progress.value,
                  "show-info": "",
                  class: "downloadProgress",
                  activeColor: "#E84339"
                }, null, 8, ["percent"]),
                createElementVNode("u-text", { class: "downLoadText" }, "\u8D44\u6E90\u4E0B\u8F7D\u4E2D\uFF0C\u8BF7\u7A0D\u540E...")
              ], 64)) : (openBlock(), createElementBlock("u-text", {
                key: 1,
                onClick: handleUpdate,
                class: "updateBtnText"
              }, "\u7ACB\u5373\u5347\u7EA7"))
            ]),
            !unref(apkInfo).isConstraint ? (openBlock(), createElementBlock("view", {
              key: 0,
              class: "line"
            })) : createCommentVNode("", true),
            !unref(apkInfo).isConstraint ? (openBlock(), createElementBlock("u-image", {
              key: 1,
              onClick: handleClose,
              class: "closeIcon",
              mode: "widthFix",
              src: _imports_1
            })) : createCommentVNode("", true)
          ])
        ])
      ]);
    };
  }
};
var appUpdate = /* @__PURE__ */ _export_sfc(_sfc_main, [["styles", [_style_0]]]);
export { appUpdate as default };
