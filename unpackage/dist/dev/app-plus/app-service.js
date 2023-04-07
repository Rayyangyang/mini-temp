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
if (typeof Promise !== "undefined" && !Promise.prototype.finally) {
  Promise.prototype.finally = function(callback) {
    const promise = this.constructor;
    return this.then((value) => promise.resolve(callback()).then(() => value), (reason) => promise.resolve(callback()).then(() => {
      throw reason;
    }));
  };
}
;
if (typeof uni !== "undefined" && uni && uni.requireGlobal) {
  const global2 = uni.requireGlobal();
  ArrayBuffer = global2.ArrayBuffer;
  Int8Array = global2.Int8Array;
  Uint8Array = global2.Uint8Array;
  Uint8ClampedArray = global2.Uint8ClampedArray;
  Int16Array = global2.Int16Array;
  Uint16Array = global2.Uint16Array;
  Int32Array = global2.Int32Array;
  Uint32Array = global2.Uint32Array;
  Float32Array = global2.Float32Array;
  Float64Array = global2.Float64Array;
  BigInt64Array = global2.BigInt64Array;
  BigUint64Array = global2.BigUint64Array;
}
;
if (uni.restoreGlobal) {
  uni.restoreGlobal(Vue, weex, plus, setTimeout, clearTimeout, setInterval, clearInterval);
}
(function(vue, shared) {
  "use strict";
  const ON_SHOW = "onShow";
  const ON_HIDE = "onHide";
  const ON_LAUNCH = "onLaunch";
  const ON_LOAD = "onLoad";
  const ON_REACH_BOTTOM = "onReachBottom";
  function requireNativePlugin(name) {
    return weex.requireModule(name);
  }
  function formatAppLog(type, filename, ...args) {
    if (uni.__log__) {
      uni.__log__(type, filename, ...args);
    } else {
      console[type].apply(console, [...args, filename]);
    }
  }
  function resolveEasycom(component, easycom) {
    return shared.isString(component) ? easycom : component;
  }
  const createHook = (lifecycle) => (hook, target = vue.getCurrentInstance()) => {
    !vue.isInSSRComponentSetup && vue.injectHook(lifecycle, hook, target);
  };
  const onShow = /* @__PURE__ */ createHook(ON_SHOW);
  const onHide = /* @__PURE__ */ createHook(ON_HIDE);
  const onLaunch = /* @__PURE__ */ createHook(ON_LAUNCH);
  const onLoad = /* @__PURE__ */ createHook(ON_LOAD);
  const onReachBottom = /* @__PURE__ */ createHook(ON_REACH_BOTTOM);
  var _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const tH = 50;
  const _sfc_main$8 = {
    name: "app-cropper",
    data() {
      return {
        csH: "0px",
        sD: "none",
        sT: "-10000px",
        pT: "-10000px",
        iS: {},
        sS: {},
        sO: true,
        bW: "19%",
        bD: "flex",
        tp: 0,
        imgSrc: {
          imgSrc: ""
        }
      };
    },
    watch: {
      avatarSrc() {
        this.imgSrc.imgSrc = this.avatarSrc;
      }
    },
    props: {
      avatarSrc: "",
      avatarStyle: "",
      selWidth: "",
      selHeight: "",
      expWidth: "",
      expHeight: "",
      minScale: "",
      maxScale: "",
      canScale: "",
      canRotate: "",
      lockWidth: "",
      lockHeight: "",
      stretch: "",
      lock: "",
      fileType: "",
      noTab: "",
      inner: "",
      quality: "",
      index: "",
      bgImage: ""
    },
    created() {
      this.cc = uni.createCanvasContext("avatar-canvas", this);
      this.cco = uni.createCanvasContext("oper-canvas", this);
      this.ccp = uni.createCanvasContext("prv-canvas", this);
      this.qlty = parseFloat(this.quality) || 1;
      this.imgSrc.imgSrc = this.avatarSrc;
      this.letRotate = this.canRotate === false || this.inner === true || this.inner === "true" || this.canRotate === "false" ? 0 : 1;
      this.letScale = this.canScale === false || this.canScale === "false" ? 0 : 1;
      this.isin = this.inner === true || this.inner === "true" ? 1 : 0;
      this.indx = this.index || void 0;
      this.mnScale = parseFloat(this.minScale) || 0.3;
      this.mxScale = parseFloat(this.maxScale) || 4;
      this.noBar = this.noTab === true || this.noTab === "true" ? 1 : 0;
      this.stc = this.stretch;
      this.lck = this.lock;
      this.fType = this.fileType === "jpg" ? "jpg" : "png";
      if (this.isin || !this.letRotate) {
        this.bW = "24%";
        this.bD = "none";
      } else {
        this.bW = "19%";
        this.bD = "flex";
      }
      if (this.noBar) {
        this.fWindowResize();
      } else {
        uni.showTabBar({
          fail: () => {
            this.noBar = 1;
          },
          success: () => {
            this.noBar = 0;
          },
          complete: (res) => {
            this.fWindowResize();
          }
        });
      }
    },
    methods: {
      fWindowResize() {
        let sysInfo = uni.getSystemInfoSync();
        this.platform = sysInfo.platform;
        this.wW = sysInfo.windowWidth;
        this.drawTop = 0;
        this.wH = sysInfo.windowHeight;
        if (!this.noBar)
          this.wH += tH;
        this.csH = this.wH - tH + "px";
        this.tp = this.csH;
        this.pxRatio = this.wW / 750;
        let style = this.avatarStyle;
        if (style && style !== true && (style = style.trim())) {
          style = style.split(";");
          let obj = {};
          for (let v of style) {
            if (!v)
              continue;
            v = v.trim().split(":");
            if (v[1].toString().indexOf("rpx") >= 0) {
              let arr = v[1].trim().split(" ");
              for (let k in arr) {
                if (!arr[k])
                  continue;
                if (arr[k].toString().indexOf("rpx") >= 0) {
                  arr[k] = parseFloat(arr[k]) * this.pxRatio + "px";
                }
              }
              v[1] = arr.join(" ");
            }
            obj[v[0].trim()] = v[1].trim();
          }
          this.iS = obj;
        }
        this.expWidth && (this.eW = this.expWidth.toString().indexOf("rpx") >= 0 ? parseInt(this.expWidth) * this.pxRatio : parseInt(this.expWidth));
        this.expHeight && (this.eH = this.expHeight.toString().indexOf("rpx") >= 0 ? parseInt(this.expHeight) * this.pxRatio : parseInt(this.expHeight));
        if (this.sD === "flex") {
          this.fDrawInit(true);
        }
        this.fHideImg();
      },
      fSelect() {
        if (this.fSelecting)
          return;
        this.fSelecting = true;
        setTimeout(() => {
          this.fSelecting = false;
        }, 500);
        uni.chooseImage({
          count: 1,
          sizeType: ["original", "compressed"],
          sourceType: ["album", "camera"],
          success: (r) => {
            uni.showLoading({
              title: "\u52A0\u8F7D\u4E2D...",
              mask: true
            });
            let path = this.imgPath = r.tempFilePaths[0];
            uni.getImageInfo({
              src: path,
              success: (r2) => {
                this.imgWidth = r2.width;
                this.imgHeight = r2.height;
                this.path = path;
                if (!this.hasSel) {
                  let style = this.sS || {};
                  if (this.selWidth && this.selHeight) {
                    let sW = this.selWidth.toString().indexOf("rpx") >= 0 ? parseInt(this.selWidth) * this.pxRatio : parseInt(this.selWidth), sH = this.selHeight.toString().indexOf("rpx") >= 0 ? parseInt(this.selHeight) * this.pxRatio : parseInt(this.selHeight);
                    style.width = sW + "px";
                    style.height = sH + "px";
                    style.top = (this.wH - sH - tH | 0) / 2 + "px";
                    style.left = (this.wW - sW | 0) / 2 + "px";
                  } else {
                    uni.showModal({
                      title: "\u88C1\u526A\u6846\u7684\u5BBD\u6216\u9AD8\u6CA1\u6709\u8BBE\u7F6E",
                      showCancel: false
                    });
                    return;
                  }
                  this.sS = style;
                }
                if (this.noBar) {
                  this.fDrawInit(true);
                } else {
                  uni.hideTabBar({
                    complete: () => {
                      this.fDrawInit(true);
                    }
                  });
                }
              },
              fail: () => {
                uni.showToast({
                  title: "\u8BF7\u9009\u62E9\u6B63\u786E\u56FE\u7247",
                  duration: 2e3
                });
              },
              complete() {
                uni.hideLoading();
              }
            });
          }
        });
      },
      fUpload() {
        if (this.fUploading)
          return;
        this.fUploading = true;
        setTimeout(() => {
          this.fUploading = false;
        }, 1e3);
        let style = this.sS, x = parseInt(style.left), y = parseInt(style.top), width = parseInt(style.width), height = parseInt(style.height), expWidth = this.eW || width * this.pixelRatio, expHeight = this.eH || height * this.pixelRatio;
        uni.showLoading({
          title: "\u52A0\u8F7D\u4E2D...",
          mask: true
        });
        this.sD = "none";
        this.sT = "-10000px";
        this.hasSel = false;
        this.fHideImg();
        uni.canvasToTempFilePath({
          x,
          y,
          width,
          height,
          destWidth: expWidth,
          destHeight: expHeight,
          canvasId: "avatar-canvas",
          fileType: this.fType,
          quality: this.qlty,
          success: (r) => {
            r = r.tempFilePath;
            this.$emit("upload", {
              avatar: this.imgSrc,
              path: r,
              index: this.indx,
              data: this.rtn,
              base64: this.base64 || null
            });
          },
          fail: (res) => {
            uni.showToast({
              title: "error1",
              duration: 2e3
            });
          },
          complete: () => {
            uni.hideLoading();
            this.noBar || uni.showTabBar();
            this.$emit("end");
          }
        }, this);
      },
      fPrvUpload() {
        if (this.fPrvUploading)
          return;
        this.fPrvUploading = true;
        setTimeout(() => {
          this.fPrvUploading = false;
        }, 1e3);
        let style = this.sS;
        parseInt(style.width);
        parseInt(style.height);
        let prvX = this.prvX, prvY = this.prvY, prvWidth = this.prvWidth, prvHeight = this.prvHeight, expWidth = this.eW || parseInt(style.width) * this.pixelRatio, expHeight = this.eH || parseInt(style.height) * this.pixelRatio;
        uni.showLoading({
          title: "\u52A0\u8F7D\u4E2D...",
          mask: true
        });
        this.sD = "none";
        this.sT = "-10000px";
        this.hasSel = false;
        this.fHideImg();
        uni.canvasToTempFilePath({
          x: prvX,
          y: prvY,
          width: prvWidth,
          height: prvHeight,
          destWidth: expWidth,
          destHeight: expHeight,
          canvasId: "prv-canvas",
          fileType: this.fType,
          quality: this.qlty,
          success: (r) => {
            r = r.tempFilePath;
            this.$emit("upload", {
              avatar: this.imgSrc,
              path: r,
              index: this.indx,
              data: this.rtn,
              base64: this.base64 || null
            });
          },
          fail: () => {
            uni.showToast({
              title: "error_prv",
              duration: 2e3
            });
          },
          complete: () => {
            uni.hideLoading();
            this.noBar || uni.showTabBar();
            this.$emit("end");
          }
        }, this);
      },
      fDrawInit(ini = false) {
        let allWidth = this.wW, allHeight = this.wH, imgWidth = this.imgWidth, imgHeight = this.imgHeight, imgRadio = imgWidth / imgHeight, useWidth = allWidth - 40, useHeight = allHeight - tH - 80, useRadio = useWidth / useHeight, sW = parseInt(this.sS.width), sH = parseInt(this.sS.height);
        this.fixWidth = 0;
        this.fixHeight = 0;
        this.lckWidth = 0;
        this.lckHeight = 0;
        switch (this.stc) {
          case "x":
            this.fixWidth = 1;
            break;
          case "y":
            this.fixHeight = 1;
            break;
          case "long":
            if (imgRadio > 1)
              this.fixWidth = 1;
            else
              this.fixHeight = 1;
            break;
          case "short":
            if (imgRadio > 1)
              this.fixHeight = 1;
            else
              this.fixWidth = 1;
            break;
          case "longSel":
            if (sW > sH)
              this.fixWidth = 1;
            else
              this.fixHeight = 1;
            break;
          case "shortSel":
            if (sW > sH)
              this.fixHeight = 1;
            else
              this.fixWidth = 1;
            break;
        }
        switch (this.lck) {
          case "x":
            this.lckWidth = 1;
            break;
          case "y":
            this.lckHeight = 1;
            break;
          case "long":
            if (imgRadio > 1)
              this.lckWidth = 1;
            else
              this.lckHeight = 1;
            break;
          case "short":
            if (imgRadio > 1)
              this.lckHeight = 1;
            else
              this.lckWidth = 1;
            break;
          case "longSel":
            if (sW > sH)
              this.lckWidth = 1;
            else
              this.lckHeight = 1;
            break;
          case "shortSel":
            if (sW > sH)
              this.lckHeight = 1;
            else
              this.lckWidth = 1;
            break;
        }
        if (this.fixWidth) {
          useWidth = sW;
          useHeight = useWidth / imgRadio;
        } else if (this.fixHeight) {
          useHeight = sH;
          useWidth = useHeight * imgRadio;
        } else if (imgRadio < useRadio) {
          if (imgHeight < useHeight) {
            useWidth = imgWidth;
            useHeight = imgHeight;
          } else {
            useWidth = useHeight * imgRadio;
          }
        } else {
          if (imgWidth < useWidth) {
            useWidth = imgWidth;
            useHeight = imgHeight;
          } else {
            useHeight = useWidth / imgRadio;
          }
        }
        if (this.isin) {
          if (useWidth < sW) {
            useWidth = sW;
            useHeight = useWidth / imgRadio;
            this.lckHeight = 0;
          }
          if (useHeight < sH) {
            useHeight = sH;
            useWidth = useHeight * imgRadio;
            this.lckWidth = 0;
          }
        }
        this.scaleSize = 1;
        this.rotateDeg = 0;
        this.posWidth = (allWidth - useWidth) / 2 | 0;
        this.posHeight = (allHeight - useHeight - tH) / 2 | 0;
        this.useWidth = useWidth | 0;
        this.useHeight = useHeight | 0;
        this.centerX = this.posWidth + useWidth / 2;
        this.centerY = this.posHeight + useHeight / 2;
        this.focusX = 0;
        this.focusY = 0;
        let style = this.sS, left = parseInt(style.left), top = parseInt(style.top), width = parseInt(style.width), height = parseInt(style.height);
        this.canvas;
        this.canvasOper;
        this.cc;
        let cco = this.cco;
        cco.beginPath();
        cco.setLineWidth(3);
        cco.setGlobalAlpha(1);
        cco.setStrokeStyle("white");
        cco.strokeRect(left, top, width, height);
        cco.setFillStyle("black");
        cco.setGlobalAlpha(0.5);
        cco.fillRect(0, 0, this.wW, top);
        cco.fillRect(0, top, left, height);
        cco.fillRect(0, top + height, this.wW, this.wH - height - top - tH);
        cco.fillRect(left + width, top, this.wW - width - left, height);
        cco.setGlobalAlpha(1);
        cco.setStrokeStyle("red");
        cco.moveTo(left + 15, top);
        cco.lineTo(left, top);
        cco.lineTo(left, top + 15);
        cco.moveTo(left + width - 15, top);
        cco.lineTo(left + width, top);
        cco.lineTo(left + width, top + 15);
        cco.moveTo(left + 15, top + height);
        cco.lineTo(left, top + height);
        cco.lineTo(left, top + height - 15);
        cco.moveTo(left + width - 15, top + height);
        cco.lineTo(left + width, top + height);
        cco.lineTo(left + width, top + height - 15);
        cco.stroke();
        cco.draw(false, () => {
          if (ini) {
            this.sD = "flex";
            this.sT = this.drawTop + "px";
            this.fDrawImage(true);
          }
        });
        this.$emit("init");
      },
      fDrawImage(ini = false) {
        let tm_now = Date.now();
        if (tm_now - this.drawTm < 20)
          return;
        this.drawTm = tm_now;
        let cc = this.cc, imgWidth = this.useWidth * this.scaleSize, imgHeight = this.useHeight * this.scaleSize;
        if (this.bgImage) {
          cc.drawImage(this.bgImage, 0, 0, this.wW, this.wH - tH);
        } else {
          cc.fillRect(0, 0, this.wW, this.wH - tH);
        }
        if (this.isin) {
          let cx = this.focusX * (this.scaleSize - 1), cy = this.focusY * (this.scaleSize - 1);
          cc.translate(this.centerX, this.centerY);
          cc.rotate(this.rotateDeg * Math.PI / 180);
          cc.drawImage(this.imgPath, this.posWidth - this.centerX - cx, this.posHeight - this.centerY - cy, imgWidth, imgHeight);
        } else {
          cc.translate(this.posWidth + imgWidth / 2, this.posHeight + imgHeight / 2);
          cc.rotate(this.rotateDeg * Math.PI / 180);
          cc.drawImage(this.imgPath, -imgWidth / 2, -imgHeight / 2, imgWidth, imgHeight);
        }
        cc.draw(false);
      },
      fPreview() {
        if (this.fPreviewing)
          return;
        this.fPreviewing = true;
        setTimeout(() => {
          this.fPreviewing = false;
        }, 1e3);
        let style = this.sS, x = parseInt(style.left), y = parseInt(style.top), width = parseInt(style.width), height = parseInt(style.height);
        uni.showLoading({
          title: "\u52A0\u8F7D\u4E2D...",
          mask: true
        });
        uni.canvasToTempFilePath({
          x,
          y,
          width,
          height,
          expWidth: width * this.pixelRatio,
          expHeight: height * this.pixelRatio,
          canvasId: "avatar-canvas",
          fileType: this.fType,
          quality: this.qlty,
          success: (r) => {
            this.prvImgTmp = r = r.tempFilePath;
            let ccp = this.ccp, prvX = this.wW, prvY = parseInt(this.csH);
            if (this.platform === "android") {
              prvY += tH;
            }
            let prvWidth = parseInt(this.sS.width), prvHeight = parseInt(this.sS.height), useWidth = prvX - 40, useHeight = prvY - 80, radio = useWidth / prvWidth, rHeight = prvHeight * radio;
            if (rHeight < useHeight) {
              prvWidth = useWidth;
              prvHeight = rHeight;
            } else {
              radio = useHeight / prvHeight;
              prvWidth *= radio;
              prvHeight = useHeight;
            }
            ccp.fillRect(0, 0, prvX, prvY);
            this.prvX = prvX = (prvX - prvWidth) / 2 | 0;
            this.prvY = prvY = (prvY - prvHeight) / 2 | 0;
            this.prvWidth = prvWidth = prvWidth | 0;
            this.prvHeight = prvHeight = prvHeight | 0;
            ccp.drawImage(r, prvX, prvY, prvWidth, prvHeight);
            ccp.draw(false);
            this.sO = false;
            this.pT = this.drawTop + "px";
          },
          fail: () => {
            uni.showToast({
              title: "error2",
              duration: 2e3
            });
          },
          complete: () => {
            uni.hideLoading();
          }
        }, this);
      },
      fChooseImg(index = void 0, params = void 0, data = void 0) {
        if (params) {
          let sW = params.selWidth, sH = params.selHeight, expWidth = params.expWidth, expHeight = params.expHeight, quality = params.quality, canRotate = params.canRotate, canScale = params.canScale, minScale = params.minScale, maxScale = params.maxScale, stretch = params.stretch, fileType = params.fileType, inner = params.inner, lock = params.lock;
          expWidth && (this.eW = expWidth.toString().indexOf("rpx") >= 0 ? parseInt(expWidth) * this.pxRatio : parseInt(expWidth));
          expHeight && (this.eH = expHeight.toString().indexOf("rpx") >= 0 ? parseInt(expHeight) * this.pxRatio : parseInt(expHeight));
          this.letRotate = canRotate === false || inner === true || inner === "true" || canRotate === "false" ? 0 : 1;
          this.letScale = canScale === false || canScale === "false" ? 0 : 1;
          this.qlty = parseFloat(quality) || 1;
          this.mnScale = parseFloat(minScale) || 0.3;
          this.mxScale = parseFloat(maxScale) || 4;
          this.stc = stretch;
          this.isin = inner === true || inner === "true" ? 1 : 0;
          this.fType = fileType === "jpg" ? "jpg" : "png";
          this.lck = lock;
          if (this.isin || !this.letRotate) {
            this.bW = "24%";
            this.bD = "none";
          } else {
            this.bW = "19%";
            this.bD = "flex";
          }
          if (sW && sH) {
            sW = sW.toString().indexOf("rpx") >= 0 ? parseInt(sW) * this.pxRatio : parseInt(sW);
            sH = sH.toString().indexOf("rpx") >= 0 ? parseInt(sH) * this.pxRatio : parseInt(sH);
            this.sS.width = sW + "px";
            this.sS.height = sH + "px";
            this.sS.top = (this.wH - sH - tH | 0) / 2 + "px";
            this.sS.left = (this.wW - sW | 0) / 2 + "px";
            this.hasSel = true;
          }
        }
        this.rtn = data;
        this.indx = index;
        this.fSelect();
      },
      fRotate() {
        this.rotateDeg += 90 - this.rotateDeg % 90;
        this.fDrawImage();
      },
      fStart(e) {
        let touches = e.touches, touch0 = touches[0], touch1 = touches[1];
        this.touch0 = touch0;
        this.touch1 = touch1;
        if (touch1) {
          let x = touch1.x - touch0.x, y = touch1.y - touch0.y;
          this.fgDistance = Math.sqrt(x * x + y * y);
        }
      },
      fMove(e) {
        let touches = e.touches, touch0 = touches[0], touch1 = touches[1];
        if (touch1) {
          let x = touch1.x - touch0.x, y = touch1.y - touch0.y, fgDistance = Math.sqrt(x * x + y * y), scaleSize = 5e-3 * (fgDistance - this.fgDistance), beScaleSize = this.scaleSize + scaleSize;
          do {
            if (!this.letScale)
              break;
            if (beScaleSize < this.mnScale)
              break;
            if (beScaleSize > this.mxScale)
              break;
            let growX = this.useWidth * scaleSize / 2, growY = this.useHeight * scaleSize / 2;
            if (this.isin) {
              let imgWidth = this.useWidth * beScaleSize, imgHeight = this.useHeight * beScaleSize;
              this.posWidth - growX;
              this.posHeight - growY;
              let left = parseInt(this.sS.left), top = parseInt(this.sS.top), width = parseInt(this.sS.width), height = parseInt(this.sS.height), right = left + width, bottom = top + height, cx, cy;
              if (imgWidth <= width || imgHeight <= height)
                break;
              this.cx = cx = this.focusX * beScaleSize - this.focusX, this.cy = cy = this.focusY * beScaleSize - this.focusY;
              this.posWidth -= growX;
              this.posHeight -= growY;
              if (this.posWidth - cx > left) {
                this.posWidth = left + cx;
              }
              if (this.posWidth + imgWidth - cx < right) {
                this.posWidth = right - imgWidth + cx;
              }
              if (this.posHeight - cy > top) {
                this.posHeight = top + cy;
              }
              if (this.posHeight + imgHeight - cy < bottom) {
                this.posHeight = bottom - imgHeight + cy;
              }
            } else {
              this.posWidth -= growX;
              this.posHeight -= growY;
            }
            this.scaleSize = beScaleSize;
          } while (0);
          this.fgDistance = fgDistance;
          if (touch1.x !== touch0.x && this.letRotate) {
            x = (this.touch1.y - this.touch0.y) / (this.touch1.x - this.touch0.x);
            y = (touch1.y - touch0.y) / (touch1.x - touch0.x);
            this.rotateDeg += Math.atan((y - x) / (1 + x * y)) * 180 / Math.PI;
            this.touch0 = touch0;
            this.touch1 = touch1;
          }
          this.fDrawImage();
        } else if (this.touch0) {
          let x = touch0.x - this.touch0.x, y = touch0.y - this.touch0.y, beX = this.posWidth + x, beY = this.posHeight + y;
          if (this.isin) {
            let imgWidth = this.useWidth * this.scaleSize, imgHeight = this.useHeight * this.scaleSize, l = beX, t2 = beY, r = l + imgWidth, b = t2 + imgHeight, left = parseInt(this.sS.left), top = parseInt(this.sS.top), right = left + parseInt(this.sS.width), bottom = top + parseInt(this.sS.height), cx, cy;
            this.cx = cx = this.focusX * this.scaleSize - this.focusX;
            this.cy = cy = this.focusY * this.scaleSize - this.focusY;
            if (!this.lckWidth && Math.abs(x) < 100) {
              if (left < l - cx) {
                this.posWidth = left + cx;
              } else if (right > r - cx) {
                this.posWidth = right - imgWidth + cx;
              } else {
                this.posWidth = beX;
                this.focusX -= x;
              }
            }
            if (!this.lckHeight && Math.abs(y) < 100) {
              if (top < t2 - cy) {
                this.focusY -= top + cy - this.posHeight;
                this.posHeight = top + cy;
              } else if (bottom > b - cy) {
                this.focusY -= bottom + cy - (this.posHeight + imgHeight);
                this.posHeight = bottom - imgHeight + cy;
              } else {
                this.posHeight = beY;
                this.focusY -= y;
              }
            }
          } else {
            if (Math.abs(x) < 100 && !this.lckWidth)
              this.posWidth = beX;
            if (Math.abs(y) < 100 && !this.lckHeight)
              this.posHeight = beY;
            this.focusX -= x;
            this.focusY -= y;
          }
          this.touch0 = touch0;
          this.fDrawImage();
        }
      },
      fEnd(e) {
        let touches = e.touches, touch0 = touches && touches[0];
        touches && touches[1];
        if (touch0) {
          this.touch0 = touch0;
        } else {
          this.touch0 = null;
          this.touch1 = null;
        }
      },
      fHideImg() {
        this.prvImg = "";
        this.pT = "-10000px";
        this.sO = true;
        this.prvImgData = null;
        this.target = null;
      },
      fClose() {
        this.sD = "none";
        this.sT = "-10000px";
        this.hasSel = false;
        this.fHideImg();
        this.noBar || uni.showTabBar();
        this.$emit("end");
      },
      fGetImgData() {
        return new Promise((resolve, reject) => {
          let prvX = this.prvX, prvY = this.prvY, prvWidth = this.prvWidth, prvHeight = this.prvHeight;
          uni.canvasGetImageData({
            canvasId: "prv-canvas",
            x: prvX,
            y: prvY,
            width: prvWidth,
            height: prvHeight,
            success(res) {
              resolve(res.data);
            },
            fail(err) {
              reject(err);
            }
          }, this);
        });
      },
      async fColorChange(e) {
        let tm_now = Date.now();
        if (tm_now - this.prvTm < 100)
          return;
        this.prvTm = tm_now;
        uni.showLoading({
          title: "\u52A0\u8F7D\u4E2D...",
          mask: true
        });
        if (!this.prvImgData) {
          if (!(this.prvImgData = await this.fGetImgData().catch(() => {
            uni.showToast({
              title: "error_read",
              duration: 2e3
            });
          })))
            return;
          this.target = new Uint8ClampedArray(this.prvImgData.length);
        }
        let data = this.prvImgData, target = this.target, i = e.detail.value, r, g, b, a, h, s, l, d, p, q, min, max, hK, tR, tG, tB;
        if (i === 0) {
          target = data;
        } else {
          i = (i + 100) / 200;
          if (i < 5e-3)
            i = 0;
          if (i > 0.995)
            i = 1;
          for (let n = data.length - 1; n >= 0; n -= 4) {
            r = data[n - 3] / 255;
            g = data[n - 2] / 255;
            b = data[n - 1] / 255;
            max = Math.max(r, g, b);
            min = Math.min(r, g, b);
            d = max - min;
            if (max === min) {
              h = 0;
            } else if (max === r && g >= b) {
              h = 60 * ((g - b) / d);
            } else if (max === r && g < b) {
              h = 60 * ((g - b) / d) + 360;
            } else if (max === g) {
              h = 60 * ((b - r) / d) + 120;
            } else if (max === b) {
              h = 60 * ((r - g) / d) + 240;
            }
            l = (max + min) / 2;
            if (l === 0 || max === min) {
              s = 0;
            } else if (0 < l && l <= 0.5) {
              s = d / (2 * l);
            } else if (l > 0.5) {
              s = d / (2 - 2 * l);
            }
            data[n] && (a = data[n]);
            if (i < 0.5) {
              s = s * i / 0.5;
            } else if (i > 0.5) {
              s = 2 * s + 2 * i - s * i / 0.5 - 1;
            }
            if (s === 0) {
              r = g = b = Math.round(l * 255);
            } else {
              if (l < 0.5) {
                q = l * (1 + s);
              } else if (l >= 0.5) {
                q = l + s - l * s;
              }
              p = 2 * l - q;
              hK = h / 360;
              tR = hK + 1 / 3;
              tG = hK;
              tB = hK - 1 / 3;
              let correctRGB = (t2) => {
                if (t2 < 0) {
                  return t2 + 1;
                }
                if (t2 > 1) {
                  return t2 - 1;
                }
                return t2;
              };
              let createRGB = (t2) => {
                if (t2 < 1 / 6) {
                  return p + (q - p) * 6 * t2;
                } else if (t2 >= 1 / 6 && t2 < 1 / 2) {
                  return q;
                } else if (t2 >= 1 / 2 && t2 < 2 / 3) {
                  return p + (q - p) * 6 * (2 / 3 - t2);
                }
                return p;
              };
              r = tR = Math.round(createRGB(correctRGB(tR)) * 255);
              g = tG = Math.round(createRGB(correctRGB(tG)) * 255);
              b = tB = Math.round(createRGB(correctRGB(tB)) * 255);
            }
            a && (target[n] = a);
            target[n - 3] = r;
            target[n - 2] = g;
            target[n - 1] = b;
          }
        }
        let prvX = this.prvX, prvY = this.prvY, prvWidth = this.prvWidth, prvHeight = this.prvHeight;
        uni.canvasPutImageData({
          canvasId: "prv-canvas",
          x: prvX,
          y: prvY,
          width: prvWidth,
          height: prvHeight,
          data: target,
          fail() {
            uni.showToast({
              title: "error_put",
              duration: 2e3
            });
          },
          complete() {
            uni.hideLoading();
          }
        }, this);
      },
      btop(base64) {
        this.base64 = base64;
        return new Promise(function(resolve, reject) {
          var arr = base64.split(","), mime = arr[0].match(/:(.*?);/)[1], bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
          while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
          }
          return resolve((window.URL || window.webkitURL).createObjectURL(new Blob([u8arr], {
            type: mime
          })));
        });
      }
    }
  };
  function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", null, [
      vue.createElementVNode("image", {
        src: $data.imgSrc.imgSrc,
        onClick: _cache[0] || (_cache[0] = (...args) => $options.fSelect && $options.fSelect(...args)),
        style: vue.normalizeStyle([$data.iS]),
        class: "my-avatar"
      }, null, 12, ["src"]),
      vue.createElementVNode("canvas", {
        "canvas-id": "avatar-canvas",
        id: "avatar-canvas",
        class: "my-canvas",
        style: vue.normalizeStyle({ top: $data.sT, height: $data.csH }),
        "disable-scroll": "false"
      }, null, 4),
      vue.createElementVNode("canvas", {
        "canvas-id": "oper-canvas",
        id: "oper-canvas",
        class: "oper-canvas",
        style: vue.normalizeStyle({ top: $data.sT, height: $data.csH }),
        "disable-scroll": "false",
        onTouchstart: _cache[1] || (_cache[1] = (...args) => $options.fStart && $options.fStart(...args)),
        onTouchmove: _cache[2] || (_cache[2] = (...args) => $options.fMove && $options.fMove(...args)),
        onTouchend: _cache[3] || (_cache[3] = (...args) => $options.fEnd && $options.fEnd(...args))
      }, null, 36),
      vue.createElementVNode("canvas", {
        "canvas-id": "prv-canvas",
        id: "prv-canvas",
        class: "prv-canvas",
        "disable-scroll": "false",
        onTouchstart: _cache[4] || (_cache[4] = (...args) => $options.fHideImg && $options.fHideImg(...args)),
        style: vue.normalizeStyle({ height: $data.csH, top: $data.pT })
      }, null, 36),
      vue.createElementVNode("view", {
        class: "oper-wrapper",
        style: vue.normalizeStyle({ display: $data.sD })
      }, [
        vue.createElementVNode("view", { class: "oper" }, [
          vue.createElementVNode("view", { class: "btn-wrapper" }, [
            vue.createElementVNode("view", {
              onClick: _cache[5] || (_cache[5] = (...args) => $options.fSelect && $options.fSelect(...args)),
              "hover-class": "hover",
              style: vue.normalizeStyle({ width: $data.bW })
            }, [
              vue.createElementVNode("text", null, "\u91CD\u9009")
            ], 4),
            vue.createElementVNode("view", {
              onClick: _cache[6] || (_cache[6] = (...args) => $options.fClose && $options.fClose(...args)),
              "hover-class": "hover",
              style: vue.normalizeStyle({ width: $data.bW })
            }, [
              vue.createElementVNode("text", null, "\u5173\u95ED")
            ], 4),
            vue.createCommentVNode(' <view @click="fRotate" hover-class="hover" :style="{width: bW, display: bD}"><text>\u65CB\u8F6C</text></view> '),
            vue.createElementVNode("view", {
              onClick: _cache[7] || (_cache[7] = (...args) => $options.fPreview && $options.fPreview(...args)),
              "hover-class": "hover",
              style: vue.normalizeStyle({ width: $data.bW })
            }, [
              vue.createElementVNode("text", null, "\u9884\u89C8")
            ], 4),
            vue.createElementVNode("view", {
              onClick: _cache[8] || (_cache[8] = (...args) => $options.fUpload && $options.fUpload(...args)),
              "hover-class": "hover",
              style: vue.normalizeStyle({ width: $data.bW })
            }, [
              vue.createElementVNode("text", null, "\u5B8C\u6210")
            ], 4)
          ])
        ])
      ], 4),
      vue.createCommentVNode(' <view class="oper-wrapper" :style="{display: sD, top:tp}">\n			<view class="oper">\n				<view class="btn-wrapper" v-if="sD">\n					<view @click="fSelect" hover-class="hover" :style="{width: bW}"><text>\u91CD\u9009</text></view>\n					<view @click="fClose" hover-class="hover" :style="{width: bW}"><text>\u5173\u95ED</text></view>\n					<view @click="fRotate" hover-class="hover" :style="{width: bW, display: bD}"><text>\u65CB\u8F6C</text></view>\n					<view @click="fPreview" hover-class="hover" :style="{width: bW}"><text>\u9884\u89C8</text></view>\n					<view @click="fUpload" hover-class="hover" :style="{width: bW}"><text>\u4E0A\u4F20</text></view>\n				</view>\n				<view class="clr-wrapper" v-else>\n					<slider class="my-slider" @change="fColorChange" block-size="25" value="0" min="-100" max="100" activeColor="red"\n					 backgroundColor="green" block-color="grey" show-value></slider>\n					<view @click="fPrvUpload" hover-class="hover" :style="{width: bW}"><text>\u4E0A\u4F20</text></view>\n				</view>\n			</view>\n		</view> ')
    ]);
  }
  var __easycom_0$1 = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["render", _sfc_render$2], ["__scopeId", "data-v-65761224"], ["__file", "/Users/waner/Documents/Demos/uni_demo_vue3/components/avatar-cropper/avatar-cropper.vue"]]);
  const isObject = (val) => val !== null && typeof val === "object";
  const defaultDelimiters = ["{", "}"];
  class BaseFormatter {
    constructor() {
      this._caches = /* @__PURE__ */ Object.create(null);
    }
    interpolate(message, values, delimiters = defaultDelimiters) {
      if (!values) {
        return [message];
      }
      let tokens = this._caches[message];
      if (!tokens) {
        tokens = parse(message, delimiters);
        this._caches[message] = tokens;
      }
      return compile(tokens, values);
    }
  }
  const RE_TOKEN_LIST_VALUE = /^(?:\d)+/;
  const RE_TOKEN_NAMED_VALUE = /^(?:\w)+/;
  function parse(format, [startDelimiter, endDelimiter]) {
    const tokens = [];
    let position = 0;
    let text = "";
    while (position < format.length) {
      let char = format[position++];
      if (char === startDelimiter) {
        if (text) {
          tokens.push({ type: "text", value: text });
        }
        text = "";
        let sub = "";
        char = format[position++];
        while (char !== void 0 && char !== endDelimiter) {
          sub += char;
          char = format[position++];
        }
        const isClosed = char === endDelimiter;
        const type = RE_TOKEN_LIST_VALUE.test(sub) ? "list" : isClosed && RE_TOKEN_NAMED_VALUE.test(sub) ? "named" : "unknown";
        tokens.push({ value: sub, type });
      } else {
        text += char;
      }
    }
    text && tokens.push({ type: "text", value: text });
    return tokens;
  }
  function compile(tokens, values) {
    const compiled = [];
    let index = 0;
    const mode = Array.isArray(values) ? "list" : isObject(values) ? "named" : "unknown";
    if (mode === "unknown") {
      return compiled;
    }
    while (index < tokens.length) {
      const token = tokens[index];
      switch (token.type) {
        case "text":
          compiled.push(token.value);
          break;
        case "list":
          compiled.push(values[parseInt(token.value, 10)]);
          break;
        case "named":
          if (mode === "named") {
            compiled.push(values[token.value]);
          } else {
            {
              console.warn(`Type of token '${token.type}' and format of value '${mode}' don't match!`);
            }
          }
          break;
        case "unknown":
          {
            console.warn(`Detect 'unknown' type of token!`);
          }
          break;
      }
      index++;
    }
    return compiled;
  }
  const LOCALE_ZH_HANS = "zh-Hans";
  const LOCALE_ZH_HANT = "zh-Hant";
  const LOCALE_EN = "en";
  const LOCALE_FR = "fr";
  const LOCALE_ES = "es";
  const hasOwnProperty = Object.prototype.hasOwnProperty;
  const hasOwn = (val, key) => hasOwnProperty.call(val, key);
  const defaultFormatter = new BaseFormatter();
  function include(str, parts) {
    return !!parts.find((part) => str.indexOf(part) !== -1);
  }
  function startsWith(str, parts) {
    return parts.find((part) => str.indexOf(part) === 0);
  }
  function normalizeLocale(locale, messages2) {
    if (!locale) {
      return;
    }
    locale = locale.trim().replace(/_/g, "-");
    if (messages2 && messages2[locale]) {
      return locale;
    }
    locale = locale.toLowerCase();
    if (locale === "chinese") {
      return LOCALE_ZH_HANS;
    }
    if (locale.indexOf("zh") === 0) {
      if (locale.indexOf("-hans") > -1) {
        return LOCALE_ZH_HANS;
      }
      if (locale.indexOf("-hant") > -1) {
        return LOCALE_ZH_HANT;
      }
      if (include(locale, ["-tw", "-hk", "-mo", "-cht"])) {
        return LOCALE_ZH_HANT;
      }
      return LOCALE_ZH_HANS;
    }
    const lang = startsWith(locale, [LOCALE_EN, LOCALE_FR, LOCALE_ES]);
    if (lang) {
      return lang;
    }
  }
  class I18n {
    constructor({ locale, fallbackLocale, messages: messages2, watcher, formater }) {
      this.locale = LOCALE_EN;
      this.fallbackLocale = LOCALE_EN;
      this.message = {};
      this.messages = {};
      this.watchers = [];
      if (fallbackLocale) {
        this.fallbackLocale = fallbackLocale;
      }
      this.formater = formater || defaultFormatter;
      this.messages = messages2 || {};
      this.setLocale(locale || LOCALE_EN);
      if (watcher) {
        this.watchLocale(watcher);
      }
    }
    setLocale(locale) {
      const oldLocale = this.locale;
      this.locale = normalizeLocale(locale, this.messages) || this.fallbackLocale;
      if (!this.messages[this.locale]) {
        this.messages[this.locale] = {};
      }
      this.message = this.messages[this.locale];
      if (oldLocale !== this.locale) {
        this.watchers.forEach((watcher) => {
          watcher(this.locale, oldLocale);
        });
      }
    }
    getLocale() {
      return this.locale;
    }
    watchLocale(fn) {
      const index = this.watchers.push(fn) - 1;
      return () => {
        this.watchers.splice(index, 1);
      };
    }
    add(locale, message, override = true) {
      const curMessages = this.messages[locale];
      if (curMessages) {
        if (override) {
          Object.assign(curMessages, message);
        } else {
          Object.keys(message).forEach((key) => {
            if (!hasOwn(curMessages, key)) {
              curMessages[key] = message[key];
            }
          });
        }
      } else {
        this.messages[locale] = message;
      }
    }
    f(message, values, delimiters) {
      return this.formater.interpolate(message, values, delimiters).join("");
    }
    t(key, locale, values) {
      let message = this.message;
      if (typeof locale === "string") {
        locale = normalizeLocale(locale, this.messages);
        locale && (message = this.messages[locale]);
      } else {
        values = locale;
      }
      if (!hasOwn(message, key)) {
        console.warn(`Cannot translate the value of keypath ${key}. Use the value of keypath as default.`);
        return key;
      }
      return this.formater.interpolate(message[key], values).join("");
    }
  }
  function watchAppLocale(appVm, i18n) {
    if (appVm.$watchLocale) {
      appVm.$watchLocale((newLocale) => {
        i18n.setLocale(newLocale);
      });
    } else {
      appVm.$watch(() => appVm.$locale, (newLocale) => {
        i18n.setLocale(newLocale);
      });
    }
  }
  function getDefaultLocale() {
    if (typeof uni !== "undefined" && uni.getLocale) {
      return uni.getLocale();
    }
    if (typeof global !== "undefined" && global.getLocale) {
      return global.getLocale();
    }
    return LOCALE_EN;
  }
  function initVueI18n(locale, messages2 = {}, fallbackLocale, watcher) {
    if (typeof locale !== "string") {
      [locale, messages2] = [
        messages2,
        locale
      ];
    }
    if (typeof locale !== "string") {
      locale = getDefaultLocale();
    }
    if (typeof fallbackLocale !== "string") {
      fallbackLocale = typeof __uniConfig !== "undefined" && __uniConfig.fallbackLocale || LOCALE_EN;
    }
    const i18n = new I18n({
      locale,
      fallbackLocale,
      messages: messages2,
      watcher
    });
    let t2 = (key, values) => {
      if (typeof getApp !== "function") {
        t2 = function(key2, values2) {
          return i18n.t(key2, values2);
        };
      } else {
        let isWatchedAppLocale = false;
        t2 = function(key2, values2) {
          const appVm = getApp().$vm;
          if (appVm) {
            appVm.$locale;
            if (!isWatchedAppLocale) {
              isWatchedAppLocale = true;
              watchAppLocale(appVm, i18n);
            }
          }
          return i18n.t(key2, values2);
        };
      }
      return t2(key, values);
    };
    return {
      i18n,
      f(message, values, delimiters) {
        return i18n.f(message, values, delimiters);
      },
      t(key, values) {
        return t2(key, values);
      },
      add(locale2, message, override = true) {
        return i18n.add(locale2, message, override);
      },
      watch(fn) {
        return i18n.watchLocale(fn);
      },
      getLocale() {
        return i18n.getLocale();
      },
      setLocale(newLocale) {
        return i18n.setLocale(newLocale);
      }
    };
  }
  var en = {
    "uni-load-more.contentdown": "Pull up to show more",
    "uni-load-more.contentrefresh": "loading...",
    "uni-load-more.contentnomore": "No more data"
  };
  var zhHans = {
    "uni-load-more.contentdown": "\u4E0A\u62C9\u663E\u793A\u66F4\u591A",
    "uni-load-more.contentrefresh": "\u6B63\u5728\u52A0\u8F7D...",
    "uni-load-more.contentnomore": "\u6CA1\u6709\u66F4\u591A\u6570\u636E\u4E86"
  };
  var zhHant = {
    "uni-load-more.contentdown": "\u4E0A\u62C9\u986F\u793A\u66F4\u591A",
    "uni-load-more.contentrefresh": "\u6B63\u5728\u52A0\u8F09...",
    "uni-load-more.contentnomore": "\u6C92\u6709\u66F4\u591A\u6578\u64DA\u4E86"
  };
  var messages = {
    en,
    "zh-Hans": zhHans,
    "zh-Hant": zhHant
  };
  let platform;
  setTimeout(() => {
    platform = uni.getSystemInfoSync().platform;
  }, 16);
  const {
    t
  } = initVueI18n(messages);
  const _sfc_main$7 = {
    name: "UniLoadMore",
    emits: ["clickLoadMore"],
    props: {
      status: {
        type: String,
        default: "more"
      },
      showIcon: {
        type: Boolean,
        default: true
      },
      iconType: {
        type: String,
        default: "auto"
      },
      iconSize: {
        type: Number,
        default: 24
      },
      color: {
        type: String,
        default: "#777777"
      },
      contentText: {
        type: Object,
        default() {
          return {
            contentdown: "",
            contentrefresh: "",
            contentnomore: ""
          };
        }
      },
      showText: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        webviewHide: false,
        platform,
        imgBase64: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QzlBMzU3OTlEOUM0MTFFOUI0NTZDNERBQURBQzI4RkUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QzlBMzU3OUFEOUM0MTFFOUI0NTZDNERBQURBQzI4RkUiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpDOUEzNTc5N0Q5QzQxMUU5QjQ1NkM0REFBREFDMjhGRSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpDOUEzNTc5OEQ5QzQxMUU5QjQ1NkM0REFBREFDMjhGRSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pt+ALSwAAA6CSURBVHja1FsLkFZVHb98LM+F5bHL8khA1iSeiyQBCRM+YGqKUnnJTDLGI0BGZlKDIU2MMglUiDApEZvSsZnQtBRJtKwQNKQMFYeRDR10WOLd8ljYXdh+v8v5fR3Od+797t1dnOnO/Ofce77z+J//+b/P+ZqtXbs2sJ9MJhNUV1cHJ06cCJo3bx7EPc2aNcvpy7pWrVoF+/fvDyoqKoI2bdoE9fX1F7TjN8a+EXBn/fkfvw942Tf+wYMHg9mzZwfjxo0LDhw4EPa1x2MbFw/fOGfPng1qa2tzcCkILsLDydq2bRsunpOTMM7TD/W/tZDZhPdeKD+yGxHhdu3aBV27dg3OnDlzMVANMheLAO3btw8KCwuDmpoaX5OxbgUIMEq7K8IcPnw4KCsrC/r37x8cP378/4cAXAB3vqSkJMuiDhTkw+XcuXNhOWbMmKBly5YhUT8xArhyFvP0BfwRsAuwxJZJsm/nzp2DTp06he/OU+cZ64K6o0ePBkOHDg2GDx8e6gEbJ5Q/NHNuAJQ1hgBeHUDlR7nVTkY8rQAvAi4z34vR/mPs1FoRsaCgIJThI0eOBC1atEiFGGV+5MiRoS45efJkqFjJFXV1dQuA012m2WcwTw98fy6CqBdsaiIO4CScrGPHjvk4odhavPquRtFWXEC25VgkREKOCh/qDSq+vn37htzD/mZTOmOc5U7zKzBPEedygWshcDyWvs30igAbU+6oyMgJBCFhwQE0fccxN60Ay9iebbjoDh06hMowjQxT4fXq1SskArmHZpkArvixp/kWzHdMeArExSJEaiXIjjRjRJ4DaAGWpibLzXN3Fm1vA5teBgh3j1Rv3bp1YgKwPdmf2p9zcyNYYgPKMfY0T5f5nNYdw158nJ8QawW4CLKwiOBSEgO/hok2eBydR+3dYH+PLxA5J8Vv0KBBwenTp0P2JWAx6+yFEBfs8lMY+y0SWMBNI9E4ThKi58VKTg3FQZS1RQF1cz27eC0QHMu+3E0SkUowjhVt5VdaWhp07949ZHv2Qd1EjDXM2cla1M0nl3GxAs3J9yREzyTdFVKVFOaE9qRA8GM0WebRuo9JGZKA7Mv2SeS/Z8+eoQ9BArMfFrLGo6jvxbhHbJZnKX2Rzz1O7QhJJ9Cs2ZMaWIyq/zhdeqPNfIoHd58clIQD+JSXl4dKlyIAuBdVXZwFVWKspSSoxE++h8x4k3uCnEhE4I5KwRiFWGOU0QWKiCYLbdoRMRKAu2kQ9vkfLU6dOhX06NEjlH+yMRZSinnuyWnYosVcji8CEA/6Cg2JF+IIUBqnGKUTCNwtwBN4f89RiK1R96DEgO2o0NDmtEdvVFdVVYV+P3UAPUEs6GFwV3PHmXkD4vh74iDFJysVI/MlaQhwKeBNTLYX5VuA8T4/gZxA4MRGFxDB6R7OmYPfyykGRJbyie+XnGYnQIC/coH9+vULiYrxrkL9ZA9+0ykaHIfEpM7ge8TiJ2CsHYwyMfafAF1yCGBHYIbCVDjDjKt7BeB51D+LgQa6OkG7IDYEEtvQ7lnXLKLtLdLuJBpE4gPUXcW2+PkZwOex+4cGDhwYDBkyRL7/HFcEwUGPo/8uWRUpYnfxGHco8HkewLHLyYmAawAPuIFZxhOpDfJQ8gbUv41yORAptMWBNr6oqMhWird5+u+iHmBb2nhjDV7HWBNQTgK8y11l5NetWzc5ULscAtSj7nbNI0skhWeUZCc0W4nyH/jO4Vz0u1IeYhbk4AiwM6tjxIWByHsoZ9qcIBPJd/y+DwPfBESOmCa/QF3WiZHucLlEDpNxcNhmheEOPgdQNx6/VZFQzFZ5TN08AHXQt2Ii3EdyFuUsPtTcGPhW5iMiCNELvz+Gdn9huG4HUJaW/w3g0wxV0XaG7arG2WeKiUWYM4Y7GO5ezshTARbbWGw/DvXkpp/ivVvE0JVoMxN4rpGzJMhE5Pl+xlATsDIqikP9F9D2z3h9nOksEUFhK+qO4rcPkoalMQ/HqJLIyb3F3JdjrCcw1yZ8joyJLR5gCo54etlag7qIoeNh1N1BRYj3DTFJ0elotxPlVzkGuYAmL0VSJVGAJA41c4Z6A3BzTLfn0HYwYKEI6CUAMzZEWvLsIcQOo1AmmyyM72nHJCfYsogflGV6jEk9vyQZXSuq6w4c16NsGcGZbwOPr+H1RkOk2LEzjNepxQkihHSCQ4ynAYNRx2zMKV92CQMWqj8J0BRE8EShxRFN6YrfCRhC0x3r/Zm4IbQCcmJoV0kMamllccR6FjHqUC5F2R/wS2dcymOlfAKOS4KmzQb5cpNC2MC7JhVn5wjXoJ44rYhLh8n0eXOCorJxa7POjbSlCGVczr34/RsAmrcvo9s+wGp3tzVhntxiXiJ4nvEYb4FJkf0O8HocAePmLvCxnL0AORraVekJk6TYjDabRVXfRE2lCN1h6ZQRN1+InUbsCpKwoBZHh0dODN9JBCUffItXxEavTQkUtnfTVAplCWL3JISz29h4NjotnuSsQKJCk8dF+kJR6RARjrqFVmfPnj3ZbK8cIJ0msd6jgHPGtfVTQ8VLmlvh4mct9sobRmPic0DyDQQnx/NlfYUgyz59+oScsH379pAwXABD32nTpoUHIToESeI5mnbE/UqDdyLcafEBf2MCqgC7NwxIbMREJQ0g4D4sfJwnD+AmRrII05cfMWJE+L1169bQr+fip06dGp4oJ83lmYd5wj/EmMa4TaHivo4EeCguYZBnkB5g2aWA69OIEnUHOaGysjIYMGBAMGnSpODYsWPZwCpFmm4lNq+4gSLQA7jcX8DwtjEyRC8wjabnXEx9kfWnTJkSJkAo90xpJVV+FmcVNeYAF5zWngS4C4O91MBxmAv8blLEpbjI5sz9MTdAhcgkCT1RO8mZkAjfiYpTEvStAS53Uw1vAiUGgZ3GpuQEYvoiBqlIan7kSDHnTwJQFNiPu0+5VxCVYhcZIjNrdXUDdp+Eq5AZ3Gkg8QAyVZRZIk4Tl4QAbF9cXJxNYZMAtAokgs4BrNxEpCtteXg7DDTMDKYNSuQdKsnJBek7HxewvxaosWxLYXtw+cJp18217wql4aKCfBNoEu0O5VU+PhctJ0YeXD4C6JQpyrlpSLTojpGGGN5YwNziChdIZLk4lvLcFJ9jMX3QdiImY9bmGQU+TRUL5CHITTRlgF8D9ouD1MfmLoEPl5xokIumZ2cfgMpHt47IW9N64Hsh7wQYYjyIugWuF5fCqYncXRd5vPMWyizzvhi/32+nvG0dZc9vR6fZOu0md5e+uC408FvKSIOZwXlGvxPv95izA2Vtvg1xKFWARI+vMX66HUhpQQb643uW1bSjuTWyw2SBvDrBvjFic1eGGlz5esq3ko9uSIlBRqPuFcCv8F4WIcN12nVaBd0SaYwI6PDDImR11JkqgHcPmQssjxIn6bUshygDFJUTxPMpHk+jfjPgupgdnYV2R/g7xSjtpah8RJBewhwf0gGK6XI92u4wXFEU40afJ4DN4h5LcAd+40HI3JgJecuT0c062W0i2hQJUTcxan3/CMW1PF2K6bbA+Daz4xRs1D3Br1Cm0OihKCqizW78/nXAF/G5TXrEcVzaNMH6CyMswqsAHqDyDLEyou8lwOXnKF8DjI6KjV3KzMBiXkDH8ij/H214J5A596ekrZ3F0zXlWeL7+P5eUrNo3/QwC15uxthuzidy7DzKRwEDaAViiDgKbTbz7CJnzo0bN7pIfIiid8SuPwn25o3QCmpnyjlZkyxPP8EomCJzrGb7GJMx7tNsq4MT2xMUYaiErZOluTzKsnz3gwCeCZyVRZJfYplNEokEjwrPtxlxjeYAk+F1F74VAzPxQRNYYdtpOUvWs8J1sGhBJMNsb7igN8plJs1eSmLIhLKE4rvaCX27gOhLpLOsIzJ7qn/i+wZzcvSOZ23/du8TZjwV8zHIXoP4R3ifBxiFz1dcVpa3aPntPE+c6TmIWE9EtcMmAcPdWAhYhAXxcLOQi9L1WhD1Sc8p1d2oL7XGiRKp8F4A2i8K/nfI+y/gsTDJ/YC/8+AD5Uh04KHiGl+cIFPnBDDrPMjwRGkLXyxO4VGbfQWnDH2v0bVWE3C9QOXlepbgjEfIJQI6XDG3z5ahD9cw2pS78ipB85wyScNTvsVzlzzhL8/jRrnmVjfFJK/m3m4nj9vbgQTguT8XZTjsm672R5uJKEaQmBI/c58gyus8ZDagLpEVSJBIyHp4jn++xqPV71OgQgJYEWOtZ/haxRtKmWOBu8xdBLftWltsY84zE6WIEy/eIOWL+BaayMx+KHtL7EAkqdNDLiEXmEMUHniedtJqg9HmZtfvt26vNi0BdG3Ft3g8ZOf7PAu59TxtzivLNIekyi+wD1i8CuUiD9FXAa8C+/xS3JPmZnomyc7H+fb4/Se0bk41Fel621r4cgVxbq91V4jVqwB7HTe2M7jgB+QWHavZkDRPmZcASoZEmBx6i75bGjPcMdL4/VKGFAGWZkGzPG0XAbdL9A81G5LOmUnC9hHKJeO7dcUMjblSl12867ElFTtaGl20xvvLGPdVz/8TVuU7y0x1PG7vtNg24oz9Uo/Z412++VFWI7Fcog9tu9Lm6gvRmIPv9x1xmQAu6RDkXtbOtlGEmpgD5Nvnyc0dcv0EE6cfdi1HmhMf9wDF3k3gtRvEedhxjpgfqPb9PU9iEJHnyOUA7bQUXh6kq/D7l2iTjWv7XOD530BDr8jIrus+srXjt4MzumJMHuTsBa63YKE1+RR5lBjEikCCnWKWiHdzOgKO+nRIBAF88za/IFmJ3eMZov4CYxGBabcpGL8EYx+SeMXJeRwHNsV/h+vdxeuhEpN3ZyNY78Gm2fknJxVGhyjixPiQvVkNzT1elD9Py/aTAL64Hb9vcYmC9zfdXdT/C1LeGbg4rnBaAihDFJH12W5ulfNCNe/xTsP3bp8ikzJs5BF+5PNfAQYAPaseTdsEcaYAAAAASUVORK5CYII="
      };
    },
    computed: {
      iconSnowWidth() {
        return (Math.floor(this.iconSize / 24) || 1) * 2;
      },
      contentdownText() {
        return this.contentText.contentdown || t("uni-load-more.contentdown");
      },
      contentrefreshText() {
        return this.contentText.contentrefresh || t("uni-load-more.contentrefresh");
      },
      contentnomoreText() {
        return this.contentText.contentnomore || t("uni-load-more.contentnomore");
      }
    },
    mounted() {
      var pages = getCurrentPages();
      var page = pages[pages.length - 1];
      var currentWebview = page.$getAppWebview();
      currentWebview.addEventListener("hide", () => {
        this.webviewHide = true;
      });
      currentWebview.addEventListener("show", () => {
        this.webviewHide = false;
      });
    },
    methods: {
      onClick() {
        this.$emit("clickLoadMore", {
          detail: {
            status: this.status
          }
        });
      }
    }
  };
  function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", {
      class: "uni-load-more",
      onClick: _cache[0] || (_cache[0] = (...args) => $options.onClick && $options.onClick(...args))
    }, [
      !$data.webviewHide && ($props.iconType === "circle" || $props.iconType === "auto" && $data.platform === "android") && $props.status === "loading" && $props.showIcon ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        style: vue.normalizeStyle({ width: $props.iconSize + "px", height: $props.iconSize + "px" }),
        class: "uni-load-more__img uni-load-more__img--android-MP"
      }, [
        vue.createElementVNode("view", {
          class: "uni-load-more__img-icon",
          style: vue.normalizeStyle({ borderTopColor: $props.color, borderTopWidth: $props.iconSize / 12 })
        }, null, 4),
        vue.createElementVNode("view", {
          class: "uni-load-more__img-icon",
          style: vue.normalizeStyle({ borderTopColor: $props.color, borderTopWidth: $props.iconSize / 12 })
        }, null, 4),
        vue.createElementVNode("view", {
          class: "uni-load-more__img-icon",
          style: vue.normalizeStyle({ borderTopColor: $props.color, borderTopWidth: $props.iconSize / 12 })
        }, null, 4)
      ], 4)) : !$data.webviewHide && $props.status === "loading" && $props.showIcon ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 1,
        style: vue.normalizeStyle({ width: $props.iconSize + "px", height: $props.iconSize + "px" }),
        class: "uni-load-more__img uni-load-more__img--ios-H5"
      }, [
        vue.createElementVNode("image", {
          src: $data.imgBase64,
          mode: "widthFix"
        }, null, 8, ["src"])
      ], 4)) : vue.createCommentVNode("v-if", true),
      $props.showText ? (vue.openBlock(), vue.createElementBlock("text", {
        key: 2,
        class: "uni-load-more__text",
        style: vue.normalizeStyle({ color: $props.color })
      }, vue.toDisplayString($props.status === "more" ? $options.contentdownText : $props.status === "loading" ? $options.contentrefreshText : $options.contentnomoreText), 5)) : vue.createCommentVNode("v-if", true)
    ]);
  }
  var __easycom_0 = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["render", _sfc_render$1], ["__scopeId", "data-v-90d4256a"], ["__file", "/Users/waner/Documents/Demos/uni_demo_vue3/uni_modules/uni-load-more/components/uni-load-more/uni-load-more.vue"]]);
  const _sfc_main$6 = {
    __name: "yuansheng-loadmore",
    props: {
      loading: {
        type: Boolean,
        default: false
      },
      pagination: {
        type: Object,
        default: {
          current: 1,
          pageSize: 10,
          total: 0
        }
      }
    },
    emits: ["clickLoadMore"],
    setup(__props, { emit: emitClickLoadMore }) {
      const contentText = {
        contentdown: "\u52A0\u8F7D\u66F4\u591A",
        contentrefresh: "\u6B63\u5728\u52A0\u8F7D...",
        contentnomore: "\u6CA1\u6709\u66F4\u591A\u4E86"
      };
      return (_ctx, _cache) => {
        const _component_uni_load_more = resolveEasycom(vue.resolveDynamicComponent("uni-load-more"), __easycom_0);
        return vue.openBlock(), vue.createBlock(_component_uni_load_more, {
          onClickLoadMore: _cache[0] || (_cache[0] = ($event) => emitClickLoadMore("clickLoadMore", $event)),
          contentText,
          iconSize: 14,
          status: __props.loading ? "loading" : __props.pagination.current * __props.pagination.pageSize < __props.pagination.total ? "more" : "no-more"
        }, null, 8, ["status"]);
      };
    }
  };
  var __easycom_1 = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["__file", "/Users/waner/Documents/Demos/uni_demo_vue3/components/yuansheng-loadmore/yuansheng-loadmore.vue"]]);
  var isVue2 = false;
  function set(target, key, val) {
    if (Array.isArray(target)) {
      target.length = Math.max(target.length, key);
      target.splice(key, 1, val);
      return val;
    }
    target[key] = val;
    return val;
  }
  function del(target, key) {
    if (Array.isArray(target)) {
      target.splice(key, 1);
      return;
    }
    delete target[key];
  }
  function getDevtoolsGlobalHook() {
    return getTarget().__VUE_DEVTOOLS_GLOBAL_HOOK__;
  }
  function getTarget() {
    return typeof navigator !== "undefined" && typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {};
  }
  const isProxyAvailable = typeof Proxy === "function";
  const HOOK_SETUP = "devtools-plugin:setup";
  const HOOK_PLUGIN_SETTINGS_SET = "plugin:settings:set";
  let supported;
  let perf;
  function isPerformanceSupported() {
    var _a;
    if (supported !== void 0) {
      return supported;
    }
    if (typeof window !== "undefined" && window.performance) {
      supported = true;
      perf = window.performance;
    } else if (typeof global !== "undefined" && ((_a = global.perf_hooks) === null || _a === void 0 ? void 0 : _a.performance)) {
      supported = true;
      perf = global.perf_hooks.performance;
    } else {
      supported = false;
    }
    return supported;
  }
  function now() {
    return isPerformanceSupported() ? perf.now() : Date.now();
  }
  class ApiProxy {
    constructor(plugin, hook) {
      this.target = null;
      this.targetQueue = [];
      this.onQueue = [];
      this.plugin = plugin;
      this.hook = hook;
      const defaultSettings = {};
      if (plugin.settings) {
        for (const id in plugin.settings) {
          const item = plugin.settings[id];
          defaultSettings[id] = item.defaultValue;
        }
      }
      const localSettingsSaveId = `__vue-devtools-plugin-settings__${plugin.id}`;
      let currentSettings = Object.assign({}, defaultSettings);
      try {
        const raw = localStorage.getItem(localSettingsSaveId);
        const data = JSON.parse(raw);
        Object.assign(currentSettings, data);
      } catch (e) {
      }
      this.fallbacks = {
        getSettings() {
          return currentSettings;
        },
        setSettings(value) {
          try {
            localStorage.setItem(localSettingsSaveId, JSON.stringify(value));
          } catch (e) {
          }
          currentSettings = value;
        },
        now() {
          return now();
        }
      };
      if (hook) {
        hook.on(HOOK_PLUGIN_SETTINGS_SET, (pluginId, value) => {
          if (pluginId === this.plugin.id) {
            this.fallbacks.setSettings(value);
          }
        });
      }
      this.proxiedOn = new Proxy({}, {
        get: (_target, prop) => {
          if (this.target) {
            return this.target.on[prop];
          } else {
            return (...args) => {
              this.onQueue.push({
                method: prop,
                args
              });
            };
          }
        }
      });
      this.proxiedTarget = new Proxy({}, {
        get: (_target, prop) => {
          if (this.target) {
            return this.target[prop];
          } else if (prop === "on") {
            return this.proxiedOn;
          } else if (Object.keys(this.fallbacks).includes(prop)) {
            return (...args) => {
              this.targetQueue.push({
                method: prop,
                args,
                resolve: () => {
                }
              });
              return this.fallbacks[prop](...args);
            };
          } else {
            return (...args) => {
              return new Promise((resolve) => {
                this.targetQueue.push({
                  method: prop,
                  args,
                  resolve
                });
              });
            };
          }
        }
      });
    }
    async setRealTarget(target) {
      this.target = target;
      for (const item of this.onQueue) {
        this.target.on[item.method](...item.args);
      }
      for (const item of this.targetQueue) {
        item.resolve(await this.target[item.method](...item.args));
      }
    }
  }
  function setupDevtoolsPlugin(pluginDescriptor, setupFn) {
    const descriptor = pluginDescriptor;
    const target = getTarget();
    const hook = getDevtoolsGlobalHook();
    const enableProxy = isProxyAvailable && descriptor.enableEarlyProxy;
    if (hook && (target.__VUE_DEVTOOLS_PLUGIN_API_AVAILABLE__ || !enableProxy)) {
      hook.emit(HOOK_SETUP, pluginDescriptor, setupFn);
    } else {
      const proxy = enableProxy ? new ApiProxy(descriptor, hook) : null;
      const list = target.__VUE_DEVTOOLS_PLUGINS__ = target.__VUE_DEVTOOLS_PLUGINS__ || [];
      list.push({
        pluginDescriptor: descriptor,
        setupFn,
        proxy
      });
      if (proxy)
        setupFn(proxy.proxiedTarget);
    }
  }
  /*!
    * pinia v2.0.14
    * (c) 2022 Eduardo San Martin Morote
    * @license MIT
    */
  let activePinia;
  const setActivePinia = (pinia2) => activePinia = pinia2;
  const getActivePinia = () => vue.getCurrentInstance() && vue.inject(piniaSymbol) || activePinia;
  const piniaSymbol = Symbol("pinia");
  function isPlainObject(o) {
    return o && typeof o === "object" && Object.prototype.toString.call(o) === "[object Object]" && typeof o.toJSON !== "function";
  }
  var MutationType;
  (function(MutationType2) {
    MutationType2["direct"] = "direct";
    MutationType2["patchObject"] = "patch object";
    MutationType2["patchFunction"] = "patch function";
  })(MutationType || (MutationType = {}));
  const IS_CLIENT = typeof window !== "undefined";
  const _global = /* @__PURE__ */ (() => typeof window === "object" && window.window === window ? window : typeof self === "object" && self.self === self ? self : typeof global === "object" && global.global === global ? global : typeof globalThis === "object" ? globalThis : { HTMLElement: null })();
  function bom(blob, { autoBom = false } = {}) {
    if (autoBom && /^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(blob.type)) {
      return new Blob([String.fromCharCode(65279), blob], { type: blob.type });
    }
    return blob;
  }
  function download(url, name, opts) {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.responseType = "blob";
    xhr.onload = function() {
      saveAs(xhr.response, name, opts);
    };
    xhr.onerror = function() {
      console.error("could not download file");
    };
    xhr.send();
  }
  function corsEnabled(url) {
    const xhr = new XMLHttpRequest();
    xhr.open("HEAD", url, false);
    try {
      xhr.send();
    } catch (e) {
    }
    return xhr.status >= 200 && xhr.status <= 299;
  }
  function click(node) {
    try {
      node.dispatchEvent(new MouseEvent("click"));
    } catch (e) {
      const evt = document.createEvent("MouseEvents");
      evt.initMouseEvent("click", true, true, window, 0, 0, 0, 80, 20, false, false, false, false, 0, null);
      node.dispatchEvent(evt);
    }
  }
  const _navigator = typeof navigator === "object" ? navigator : { userAgent: "" };
  const isMacOSWebView = /* @__PURE__ */ (() => /Macintosh/.test(_navigator.userAgent) && /AppleWebKit/.test(_navigator.userAgent) && !/Safari/.test(_navigator.userAgent))();
  const saveAs = !IS_CLIENT ? () => {
  } : typeof HTMLAnchorElement !== "undefined" && "download" in HTMLAnchorElement.prototype && !isMacOSWebView ? downloadSaveAs : "msSaveOrOpenBlob" in _navigator ? msSaveAs : fileSaverSaveAs;
  function downloadSaveAs(blob, name = "download", opts) {
    const a = document.createElement("a");
    a.download = name;
    a.rel = "noopener";
    if (typeof blob === "string") {
      a.href = blob;
      if (a.origin !== location.origin) {
        if (corsEnabled(a.href)) {
          download(blob, name, opts);
        } else {
          a.target = "_blank";
          click(a);
        }
      } else {
        click(a);
      }
    } else {
      a.href = URL.createObjectURL(blob);
      setTimeout(function() {
        URL.revokeObjectURL(a.href);
      }, 4e4);
      setTimeout(function() {
        click(a);
      }, 0);
    }
  }
  function msSaveAs(blob, name = "download", opts) {
    if (typeof blob === "string") {
      if (corsEnabled(blob)) {
        download(blob, name, opts);
      } else {
        const a = document.createElement("a");
        a.href = blob;
        a.target = "_blank";
        setTimeout(function() {
          click(a);
        });
      }
    } else {
      navigator.msSaveOrOpenBlob(bom(blob, opts), name);
    }
  }
  function fileSaverSaveAs(blob, name, opts, popup) {
    popup = popup || open("", "_blank");
    if (popup) {
      popup.document.title = popup.document.body.innerText = "downloading...";
    }
    if (typeof blob === "string")
      return download(blob, name, opts);
    const force = blob.type === "application/octet-stream";
    const isSafari = /constructor/i.test(String(_global.HTMLElement)) || "safari" in _global;
    const isChromeIOS = /CriOS\/[\d]+/.test(navigator.userAgent);
    if ((isChromeIOS || force && isSafari || isMacOSWebView) && typeof FileReader !== "undefined") {
      const reader = new FileReader();
      reader.onloadend = function() {
        let url = reader.result;
        if (typeof url !== "string") {
          popup = null;
          throw new Error("Wrong reader.result type");
        }
        url = isChromeIOS ? url : url.replace(/^data:[^;]*;/, "data:attachment/file;");
        if (popup) {
          popup.location.href = url;
        } else {
          location.assign(url);
        }
        popup = null;
      };
      reader.readAsDataURL(blob);
    } else {
      const url = URL.createObjectURL(blob);
      if (popup)
        popup.location.assign(url);
      else
        location.href = url;
      popup = null;
      setTimeout(function() {
        URL.revokeObjectURL(url);
      }, 4e4);
    }
  }
  function toastMessage(message, type) {
    const piniaMessage = "\u{1F34D} " + message;
    if (typeof __VUE_DEVTOOLS_TOAST__ === "function") {
      __VUE_DEVTOOLS_TOAST__(piniaMessage, type);
    } else if (type === "error") {
      console.error(piniaMessage);
    } else if (type === "warn") {
      console.warn(piniaMessage);
    } else {
      console.log(piniaMessage);
    }
  }
  function isPinia(o) {
    return "_a" in o && "install" in o;
  }
  function checkClipboardAccess() {
    if (!("clipboard" in navigator)) {
      toastMessage(`Your browser doesn't support the Clipboard API`, "error");
      return true;
    }
  }
  function checkNotFocusedError(error) {
    if (error instanceof Error && error.message.toLowerCase().includes("document is not focused")) {
      toastMessage('You need to activate the "Emulate a focused page" setting in the "Rendering" panel of devtools.', "warn");
      return true;
    }
    return false;
  }
  async function actionGlobalCopyState(pinia2) {
    if (checkClipboardAccess())
      return;
    try {
      await navigator.clipboard.writeText(JSON.stringify(pinia2.state.value));
      toastMessage("Global state copied to clipboard.");
    } catch (error) {
      if (checkNotFocusedError(error))
        return;
      toastMessage(`Failed to serialize the state. Check the console for more details.`, "error");
      console.error(error);
    }
  }
  async function actionGlobalPasteState(pinia2) {
    if (checkClipboardAccess())
      return;
    try {
      pinia2.state.value = JSON.parse(await navigator.clipboard.readText());
      toastMessage("Global state pasted from clipboard.");
    } catch (error) {
      if (checkNotFocusedError(error))
        return;
      toastMessage(`Failed to deserialize the state from clipboard. Check the console for more details.`, "error");
      console.error(error);
    }
  }
  async function actionGlobalSaveState(pinia2) {
    try {
      saveAs(new Blob([JSON.stringify(pinia2.state.value)], {
        type: "text/plain;charset=utf-8"
      }), "pinia-state.json");
    } catch (error) {
      toastMessage(`Failed to export the state as JSON. Check the console for more details.`, "error");
      console.error(error);
    }
  }
  let fileInput;
  function getFileOpener() {
    if (!fileInput) {
      fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.accept = ".json";
    }
    function openFile() {
      return new Promise((resolve, reject) => {
        fileInput.onchange = async () => {
          const files = fileInput.files;
          if (!files)
            return resolve(null);
          const file = files.item(0);
          if (!file)
            return resolve(null);
          return resolve({ text: await file.text(), file });
        };
        fileInput.oncancel = () => resolve(null);
        fileInput.onerror = reject;
        fileInput.click();
      });
    }
    return openFile;
  }
  async function actionGlobalOpenStateFile(pinia2) {
    try {
      const open2 = await getFileOpener();
      const result = await open2();
      if (!result)
        return;
      const { text, file } = result;
      pinia2.state.value = JSON.parse(text);
      toastMessage(`Global state imported from "${file.name}".`);
    } catch (error) {
      toastMessage(`Failed to export the state as JSON. Check the console for more details.`, "error");
      console.error(error);
    }
  }
  function formatDisplay(display) {
    return {
      _custom: {
        display
      }
    };
  }
  const PINIA_ROOT_LABEL = "\u{1F34D} Pinia (root)";
  const PINIA_ROOT_ID = "_root";
  function formatStoreForInspectorTree(store) {
    return isPinia(store) ? {
      id: PINIA_ROOT_ID,
      label: PINIA_ROOT_LABEL
    } : {
      id: store.$id,
      label: store.$id
    };
  }
  function formatStoreForInspectorState(store) {
    if (isPinia(store)) {
      const storeNames = Array.from(store._s.keys());
      const storeMap = store._s;
      const state2 = {
        state: storeNames.map((storeId) => ({
          editable: true,
          key: storeId,
          value: store.state.value[storeId]
        })),
        getters: storeNames.filter((id) => storeMap.get(id)._getters).map((id) => {
          const store2 = storeMap.get(id);
          return {
            editable: false,
            key: id,
            value: store2._getters.reduce((getters, key) => {
              getters[key] = store2[key];
              return getters;
            }, {})
          };
        })
      };
      return state2;
    }
    const state = {
      state: Object.keys(store.$state).map((key) => ({
        editable: true,
        key,
        value: store.$state[key]
      }))
    };
    if (store._getters && store._getters.length) {
      state.getters = store._getters.map((getterName) => ({
        editable: false,
        key: getterName,
        value: store[getterName]
      }));
    }
    if (store._customProperties.size) {
      state.customProperties = Array.from(store._customProperties).map((key) => ({
        editable: true,
        key,
        value: store[key]
      }));
    }
    return state;
  }
  function formatEventData(events) {
    if (!events)
      return {};
    if (Array.isArray(events)) {
      return events.reduce((data, event) => {
        data.keys.push(event.key);
        data.operations.push(event.type);
        data.oldValue[event.key] = event.oldValue;
        data.newValue[event.key] = event.newValue;
        return data;
      }, {
        oldValue: {},
        keys: [],
        operations: [],
        newValue: {}
      });
    } else {
      return {
        operation: formatDisplay(events.type),
        key: formatDisplay(events.key),
        oldValue: events.oldValue,
        newValue: events.newValue
      };
    }
  }
  function formatMutationType(type) {
    switch (type) {
      case MutationType.direct:
        return "mutation";
      case MutationType.patchFunction:
        return "$patch";
      case MutationType.patchObject:
        return "$patch";
      default:
        return "unknown";
    }
  }
  let isTimelineActive = true;
  const componentStateTypes = [];
  const MUTATIONS_LAYER_ID = "pinia:mutations";
  const INSPECTOR_ID = "pinia";
  const getStoreType = (id) => "\u{1F34D} " + id;
  function registerPiniaDevtools(app2, pinia2) {
    setupDevtoolsPlugin({
      id: "dev.esm.pinia",
      label: "Pinia \u{1F34D}",
      logo: "https://pinia.vuejs.org/logo.svg",
      packageName: "pinia",
      homepage: "https://pinia.vuejs.org",
      componentStateTypes,
      app: app2
    }, (api) => {
      if (typeof api.now !== "function") {
        toastMessage("You seem to be using an outdated version of Vue Devtools. Are you still using the Beta release instead of the stable one? You can find the links at https://devtools.vuejs.org/guide/installation.html.");
      }
      api.addTimelineLayer({
        id: MUTATIONS_LAYER_ID,
        label: `Pinia \u{1F34D}`,
        color: 15064968
      });
      api.addInspector({
        id: INSPECTOR_ID,
        label: "Pinia \u{1F34D}",
        icon: "storage",
        treeFilterPlaceholder: "Search stores",
        actions: [
          {
            icon: "content_copy",
            action: () => {
              actionGlobalCopyState(pinia2);
            },
            tooltip: "Serialize and copy the state"
          },
          {
            icon: "content_paste",
            action: async () => {
              await actionGlobalPasteState(pinia2);
              api.sendInspectorTree(INSPECTOR_ID);
              api.sendInspectorState(INSPECTOR_ID);
            },
            tooltip: "Replace the state with the content of your clipboard"
          },
          {
            icon: "save",
            action: () => {
              actionGlobalSaveState(pinia2);
            },
            tooltip: "Save the state as a JSON file"
          },
          {
            icon: "folder_open",
            action: async () => {
              await actionGlobalOpenStateFile(pinia2);
              api.sendInspectorTree(INSPECTOR_ID);
              api.sendInspectorState(INSPECTOR_ID);
            },
            tooltip: "Import the state from a JSON file"
          }
        ]
      });
      api.on.inspectComponent((payload, ctx) => {
        const proxy = payload.componentInstance && payload.componentInstance.proxy;
        if (proxy && proxy._pStores) {
          const piniaStores = payload.componentInstance.proxy._pStores;
          Object.values(piniaStores).forEach((store) => {
            payload.instanceData.state.push({
              type: getStoreType(store.$id),
              key: "state",
              editable: true,
              value: store._isOptionsAPI ? {
                _custom: {
                  value: store.$state,
                  actions: [
                    {
                      icon: "restore",
                      tooltip: "Reset the state of this store",
                      action: () => store.$reset()
                    }
                  ]
                }
              } : store.$state
            });
            if (store._getters && store._getters.length) {
              payload.instanceData.state.push({
                type: getStoreType(store.$id),
                key: "getters",
                editable: false,
                value: store._getters.reduce((getters, key) => {
                  try {
                    getters[key] = store[key];
                  } catch (error) {
                    getters[key] = error;
                  }
                  return getters;
                }, {})
              });
            }
          });
        }
      });
      api.on.getInspectorTree((payload) => {
        if (payload.app === app2 && payload.inspectorId === INSPECTOR_ID) {
          let stores = [pinia2];
          stores = stores.concat(Array.from(pinia2._s.values()));
          payload.rootNodes = (payload.filter ? stores.filter((store) => "$id" in store ? store.$id.toLowerCase().includes(payload.filter.toLowerCase()) : PINIA_ROOT_LABEL.toLowerCase().includes(payload.filter.toLowerCase())) : stores).map(formatStoreForInspectorTree);
        }
      });
      api.on.getInspectorState((payload) => {
        if (payload.app === app2 && payload.inspectorId === INSPECTOR_ID) {
          const inspectedStore = payload.nodeId === PINIA_ROOT_ID ? pinia2 : pinia2._s.get(payload.nodeId);
          if (!inspectedStore) {
            return;
          }
          if (inspectedStore) {
            payload.state = formatStoreForInspectorState(inspectedStore);
          }
        }
      });
      api.on.editInspectorState((payload, ctx) => {
        if (payload.app === app2 && payload.inspectorId === INSPECTOR_ID) {
          const inspectedStore = payload.nodeId === PINIA_ROOT_ID ? pinia2 : pinia2._s.get(payload.nodeId);
          if (!inspectedStore) {
            return toastMessage(`store "${payload.nodeId}" not found`, "error");
          }
          const { path } = payload;
          if (!isPinia(inspectedStore)) {
            if (path.length !== 1 || !inspectedStore._customProperties.has(path[0]) || path[0] in inspectedStore.$state) {
              path.unshift("$state");
            }
          } else {
            path.unshift("state");
          }
          isTimelineActive = false;
          payload.set(inspectedStore, path, payload.state.value);
          isTimelineActive = true;
        }
      });
      api.on.editComponentState((payload) => {
        if (payload.type.startsWith("\u{1F34D}")) {
          const storeId = payload.type.replace(/^🍍\s*/, "");
          const store = pinia2._s.get(storeId);
          if (!store) {
            return toastMessage(`store "${storeId}" not found`, "error");
          }
          const { path } = payload;
          if (path[0] !== "state") {
            return toastMessage(`Invalid path for store "${storeId}":
${path}
Only state can be modified.`);
          }
          path[0] = "$state";
          isTimelineActive = false;
          payload.set(store, path, payload.state.value);
          isTimelineActive = true;
        }
      });
    });
  }
  function addStoreToDevtools(app2, store) {
    if (!componentStateTypes.includes(getStoreType(store.$id))) {
      componentStateTypes.push(getStoreType(store.$id));
    }
    setupDevtoolsPlugin({
      id: "dev.esm.pinia",
      label: "Pinia \u{1F34D}",
      logo: "https://pinia.vuejs.org/logo.svg",
      packageName: "pinia",
      homepage: "https://pinia.vuejs.org",
      componentStateTypes,
      app: app2,
      settings: {
        logStoreChanges: {
          label: "Notify about new/deleted stores",
          type: "boolean",
          defaultValue: true
        }
      }
    }, (api) => {
      const now2 = typeof api.now === "function" ? api.now.bind(api) : Date.now;
      store.$onAction(({ after, onError, name, args }) => {
        const groupId = runningActionId++;
        api.addTimelineEvent({
          layerId: MUTATIONS_LAYER_ID,
          event: {
            time: now2(),
            title: "\u{1F6EB} " + name,
            subtitle: "start",
            data: {
              store: formatDisplay(store.$id),
              action: formatDisplay(name),
              args
            },
            groupId
          }
        });
        after((result) => {
          activeAction = void 0;
          api.addTimelineEvent({
            layerId: MUTATIONS_LAYER_ID,
            event: {
              time: now2(),
              title: "\u{1F6EC} " + name,
              subtitle: "end",
              data: {
                store: formatDisplay(store.$id),
                action: formatDisplay(name),
                args,
                result
              },
              groupId
            }
          });
        });
        onError((error) => {
          activeAction = void 0;
          api.addTimelineEvent({
            layerId: MUTATIONS_LAYER_ID,
            event: {
              time: now2(),
              logType: "error",
              title: "\u{1F4A5} " + name,
              subtitle: "end",
              data: {
                store: formatDisplay(store.$id),
                action: formatDisplay(name),
                args,
                error
              },
              groupId
            }
          });
        });
      }, true);
      store._customProperties.forEach((name) => {
        vue.watch(() => vue.unref(store[name]), (newValue, oldValue) => {
          api.notifyComponentUpdate();
          api.sendInspectorState(INSPECTOR_ID);
          if (isTimelineActive) {
            api.addTimelineEvent({
              layerId: MUTATIONS_LAYER_ID,
              event: {
                time: now2(),
                title: "Change",
                subtitle: name,
                data: {
                  newValue,
                  oldValue
                },
                groupId: activeAction
              }
            });
          }
        }, { deep: true });
      });
      store.$subscribe(({ events, type }, state) => {
        api.notifyComponentUpdate();
        api.sendInspectorState(INSPECTOR_ID);
        if (!isTimelineActive)
          return;
        const eventData = {
          time: now2(),
          title: formatMutationType(type),
          data: __spreadValues({
            store: formatDisplay(store.$id)
          }, formatEventData(events)),
          groupId: activeAction
        };
        activeAction = void 0;
        if (type === MutationType.patchFunction) {
          eventData.subtitle = "\u2935\uFE0F";
        } else if (type === MutationType.patchObject) {
          eventData.subtitle = "\u{1F9E9}";
        } else if (events && !Array.isArray(events)) {
          eventData.subtitle = events.type;
        }
        if (events) {
          eventData.data["rawEvent(s)"] = {
            _custom: {
              display: "DebuggerEvent",
              type: "object",
              tooltip: "raw DebuggerEvent[]",
              value: events
            }
          };
        }
        api.addTimelineEvent({
          layerId: MUTATIONS_LAYER_ID,
          event: eventData
        });
      }, { detached: true, flush: "sync" });
      const hotUpdate = store._hotUpdate;
      store._hotUpdate = vue.markRaw((newStore) => {
        hotUpdate(newStore);
        api.addTimelineEvent({
          layerId: MUTATIONS_LAYER_ID,
          event: {
            time: now2(),
            title: "\u{1F525} " + store.$id,
            subtitle: "HMR update",
            data: {
              store: formatDisplay(store.$id),
              info: formatDisplay(`HMR update`)
            }
          }
        });
        api.notifyComponentUpdate();
        api.sendInspectorTree(INSPECTOR_ID);
        api.sendInspectorState(INSPECTOR_ID);
      });
      const { $dispose } = store;
      store.$dispose = () => {
        $dispose();
        api.notifyComponentUpdate();
        api.sendInspectorTree(INSPECTOR_ID);
        api.sendInspectorState(INSPECTOR_ID);
        api.getSettings().logStoreChanges && toastMessage(`Disposed "${store.$id}" store \u{1F5D1}`);
      };
      api.notifyComponentUpdate();
      api.sendInspectorTree(INSPECTOR_ID);
      api.sendInspectorState(INSPECTOR_ID);
      api.getSettings().logStoreChanges && toastMessage(`"${store.$id}" store installed \u{1F195}`);
    });
  }
  let runningActionId = 0;
  let activeAction;
  function patchActionForGrouping(store, actionNames) {
    const actions = actionNames.reduce((storeActions, actionName) => {
      storeActions[actionName] = vue.toRaw(store)[actionName];
      return storeActions;
    }, {});
    for (const actionName in actions) {
      store[actionName] = function() {
        const _actionId = runningActionId;
        const trackedStore = new Proxy(store, {
          get(...args) {
            activeAction = _actionId;
            return Reflect.get(...args);
          },
          set(...args) {
            activeAction = _actionId;
            return Reflect.set(...args);
          }
        });
        return actions[actionName].apply(trackedStore, arguments);
      };
    }
  }
  function devtoolsPlugin({ app: app2, store, options }) {
    if (store.$id.startsWith("__hot:")) {
      return;
    }
    if (options.state) {
      store._isOptionsAPI = true;
    }
    if (typeof options.state === "function") {
      patchActionForGrouping(store, Object.keys(options.actions));
      const originalHotUpdate = store._hotUpdate;
      vue.toRaw(store)._hotUpdate = function(newStore) {
        originalHotUpdate.apply(this, arguments);
        patchActionForGrouping(store, Object.keys(newStore._hmrPayload.actions));
      };
    }
    addStoreToDevtools(app2, store);
  }
  function createPinia() {
    const scope = vue.effectScope(true);
    const state = scope.run(() => vue.ref({}));
    let _p = [];
    let toBeInstalled = [];
    const pinia2 = vue.markRaw({
      install(app2) {
        setActivePinia(pinia2);
        {
          pinia2._a = app2;
          app2.provide(piniaSymbol, pinia2);
          app2.config.globalProperties.$pinia = pinia2;
          if (IS_CLIENT) {
            registerPiniaDevtools(app2, pinia2);
          }
          toBeInstalled.forEach((plugin) => _p.push(plugin));
          toBeInstalled = [];
        }
      },
      use(plugin) {
        if (!this._a && !isVue2) {
          toBeInstalled.push(plugin);
        } else {
          _p.push(plugin);
        }
        return this;
      },
      _p,
      _a: null,
      _e: scope,
      _s: /* @__PURE__ */ new Map(),
      state
    });
    if (IS_CLIENT && true) {
      pinia2.use(devtoolsPlugin);
    }
    return pinia2;
  }
  const isUseStore = (fn) => {
    return typeof fn === "function" && typeof fn.$id === "string";
  };
  function patchObject(newState, oldState) {
    for (const key in oldState) {
      const subPatch = oldState[key];
      if (!(key in newState)) {
        continue;
      }
      const targetValue = newState[key];
      if (isPlainObject(targetValue) && isPlainObject(subPatch) && !vue.isRef(subPatch) && !vue.isReactive(subPatch)) {
        newState[key] = patchObject(targetValue, subPatch);
      } else {
        {
          newState[key] = subPatch;
        }
      }
    }
    return newState;
  }
  function acceptHMRUpdate(initialUseStore, hot) {
    return (newModule) => {
      const pinia2 = hot.data.pinia || initialUseStore._pinia;
      if (!pinia2) {
        return;
      }
      hot.data.pinia = pinia2;
      for (const exportName in newModule) {
        const useStore = newModule[exportName];
        if (isUseStore(useStore) && pinia2._s.has(useStore.$id)) {
          const id = useStore.$id;
          if (id !== initialUseStore.$id) {
            console.warn(`The id of the store changed from "${initialUseStore.$id}" to "${id}". Reloading.`);
            return hot.invalidate();
          }
          const existingStore = pinia2._s.get(id);
          if (!existingStore) {
            console.log(`[Pinia]: skipping hmr because store doesn't exist yet`);
            return;
          }
          useStore(pinia2, existingStore);
        }
      }
    };
  }
  const noop = () => {
  };
  function addSubscription(subscriptions, callback, detached, onCleanup = noop) {
    subscriptions.push(callback);
    const removeSubscription = () => {
      const idx = subscriptions.indexOf(callback);
      if (idx > -1) {
        subscriptions.splice(idx, 1);
        onCleanup();
      }
    };
    if (!detached && vue.getCurrentInstance()) {
      vue.onUnmounted(removeSubscription);
    }
    return removeSubscription;
  }
  function triggerSubscriptions(subscriptions, ...args) {
    subscriptions.slice().forEach((callback) => {
      callback(...args);
    });
  }
  function mergeReactiveObjects(target, patchToApply) {
    for (const key in patchToApply) {
      if (!patchToApply.hasOwnProperty(key))
        continue;
      const subPatch = patchToApply[key];
      const targetValue = target[key];
      if (isPlainObject(targetValue) && isPlainObject(subPatch) && target.hasOwnProperty(key) && !vue.isRef(subPatch) && !vue.isReactive(subPatch)) {
        target[key] = mergeReactiveObjects(targetValue, subPatch);
      } else {
        target[key] = subPatch;
      }
    }
    return target;
  }
  const skipHydrateSymbol = Symbol("pinia:skipHydration");
  function skipHydrate(obj) {
    return Object.defineProperty(obj, skipHydrateSymbol, {});
  }
  function shouldHydrate(obj) {
    return !isPlainObject(obj) || !obj.hasOwnProperty(skipHydrateSymbol);
  }
  const { assign } = Object;
  function isComputed(o) {
    return !!(vue.isRef(o) && o.effect);
  }
  function createOptionsStore(id, options, pinia2, hot) {
    const { state, actions, getters } = options;
    const initialState = pinia2.state.value[id];
    let store;
    function setup() {
      if (!initialState && !hot) {
        {
          pinia2.state.value[id] = state ? state() : {};
        }
      }
      const localState = hot ? vue.toRefs(vue.ref(state ? state() : {}).value) : vue.toRefs(pinia2.state.value[id]);
      return assign(localState, actions, Object.keys(getters || {}).reduce((computedGetters, name) => {
        computedGetters[name] = vue.markRaw(vue.computed(() => {
          setActivePinia(pinia2);
          const store2 = pinia2._s.get(id);
          return getters[name].call(store2, store2);
        }));
        return computedGetters;
      }, {}));
    }
    store = createSetupStore(id, setup, options, pinia2, hot, true);
    store.$reset = function $reset() {
      const newState = state ? state() : {};
      this.$patch(($state) => {
        assign($state, newState);
      });
    };
    return store;
  }
  function createSetupStore($id, setup, options = {}, pinia2, hot, isOptionsStore) {
    let scope;
    const optionsForPlugin = assign({ actions: {} }, options);
    if (!pinia2._e.active) {
      throw new Error("Pinia destroyed");
    }
    const $subscribeOptions = {
      deep: true
    };
    {
      $subscribeOptions.onTrigger = (event) => {
        if (isListening) {
          debuggerEvents = event;
        } else if (isListening == false && !store._hotUpdating) {
          if (Array.isArray(debuggerEvents)) {
            debuggerEvents.push(event);
          } else {
            console.error("\u{1F34D} debuggerEvents should be an array. This is most likely an internal Pinia bug.");
          }
        }
      };
    }
    let isListening;
    let isSyncListening;
    let subscriptions = vue.markRaw([]);
    let actionSubscriptions = vue.markRaw([]);
    let debuggerEvents;
    const initialState = pinia2.state.value[$id];
    if (!isOptionsStore && !initialState && !hot) {
      {
        pinia2.state.value[$id] = {};
      }
    }
    const hotState = vue.ref({});
    let activeListener;
    function $patch(partialStateOrMutator) {
      let subscriptionMutation;
      isListening = isSyncListening = false;
      {
        debuggerEvents = [];
      }
      if (typeof partialStateOrMutator === "function") {
        partialStateOrMutator(pinia2.state.value[$id]);
        subscriptionMutation = {
          type: MutationType.patchFunction,
          storeId: $id,
          events: debuggerEvents
        };
      } else {
        mergeReactiveObjects(pinia2.state.value[$id], partialStateOrMutator);
        subscriptionMutation = {
          type: MutationType.patchObject,
          payload: partialStateOrMutator,
          storeId: $id,
          events: debuggerEvents
        };
      }
      const myListenerId = activeListener = Symbol();
      vue.nextTick().then(() => {
        if (activeListener === myListenerId) {
          isListening = true;
        }
      });
      isSyncListening = true;
      triggerSubscriptions(subscriptions, subscriptionMutation, pinia2.state.value[$id]);
    }
    const $reset = () => {
      throw new Error(`\u{1F34D}: Store "${$id}" is build using the setup syntax and does not implement $reset().`);
    };
    function $dispose() {
      scope.stop();
      subscriptions = [];
      actionSubscriptions = [];
      pinia2._s.delete($id);
    }
    function wrapAction(name, action) {
      return function() {
        setActivePinia(pinia2);
        const args = Array.from(arguments);
        const afterCallbackList = [];
        const onErrorCallbackList = [];
        function after(callback) {
          afterCallbackList.push(callback);
        }
        function onError(callback) {
          onErrorCallbackList.push(callback);
        }
        triggerSubscriptions(actionSubscriptions, {
          args,
          name,
          store,
          after,
          onError
        });
        let ret;
        try {
          ret = action.apply(this && this.$id === $id ? this : store, args);
        } catch (error) {
          triggerSubscriptions(onErrorCallbackList, error);
          throw error;
        }
        if (ret instanceof Promise) {
          return ret.then((value) => {
            triggerSubscriptions(afterCallbackList, value);
            return value;
          }).catch((error) => {
            triggerSubscriptions(onErrorCallbackList, error);
            return Promise.reject(error);
          });
        }
        triggerSubscriptions(afterCallbackList, ret);
        return ret;
      };
    }
    const _hmrPayload = /* @__PURE__ */ vue.markRaw({
      actions: {},
      getters: {},
      state: [],
      hotState
    });
    const partialStore = {
      _p: pinia2,
      $id,
      $onAction: addSubscription.bind(null, actionSubscriptions),
      $patch,
      $reset,
      $subscribe(callback, options2 = {}) {
        const removeSubscription = addSubscription(subscriptions, callback, options2.detached, () => stopWatcher());
        const stopWatcher = scope.run(() => vue.watch(() => pinia2.state.value[$id], (state) => {
          if (options2.flush === "sync" ? isSyncListening : isListening) {
            callback({
              storeId: $id,
              type: MutationType.direct,
              events: debuggerEvents
            }, state);
          }
        }, assign({}, $subscribeOptions, options2)));
        return removeSubscription;
      },
      $dispose
    };
    const store = vue.reactive(assign(IS_CLIENT ? {
      _customProperties: vue.markRaw(/* @__PURE__ */ new Set()),
      _hmrPayload
    } : {}, partialStore));
    pinia2._s.set($id, store);
    const setupStore = pinia2._e.run(() => {
      scope = vue.effectScope();
      return scope.run(() => setup());
    });
    for (const key in setupStore) {
      const prop = setupStore[key];
      if (vue.isRef(prop) && !isComputed(prop) || vue.isReactive(prop)) {
        if (hot) {
          set(hotState.value, key, vue.toRef(setupStore, key));
        } else if (!isOptionsStore) {
          if (initialState && shouldHydrate(prop)) {
            if (vue.isRef(prop)) {
              prop.value = initialState[key];
            } else {
              mergeReactiveObjects(prop, initialState[key]);
            }
          }
          {
            pinia2.state.value[$id][key] = prop;
          }
        }
        {
          _hmrPayload.state.push(key);
        }
      } else if (typeof prop === "function") {
        const actionValue = hot ? prop : wrapAction(key, prop);
        {
          setupStore[key] = actionValue;
        }
        {
          _hmrPayload.actions[key] = prop;
        }
        optionsForPlugin.actions[key] = prop;
      } else {
        if (isComputed(prop)) {
          _hmrPayload.getters[key] = isOptionsStore ? options.getters[key] : prop;
          if (IS_CLIENT) {
            const getters = setupStore._getters || (setupStore._getters = vue.markRaw([]));
            getters.push(key);
          }
        }
      }
    }
    {
      assign(store, setupStore);
      assign(vue.toRaw(store), setupStore);
    }
    Object.defineProperty(store, "$state", {
      get: () => hot ? hotState.value : pinia2.state.value[$id],
      set: (state) => {
        if (hot) {
          throw new Error("cannot set hotState");
        }
        $patch(($state) => {
          assign($state, state);
        });
      }
    });
    {
      store._hotUpdate = vue.markRaw((newStore) => {
        store._hotUpdating = true;
        newStore._hmrPayload.state.forEach((stateKey) => {
          if (stateKey in store.$state) {
            const newStateTarget = newStore.$state[stateKey];
            const oldStateSource = store.$state[stateKey];
            if (typeof newStateTarget === "object" && isPlainObject(newStateTarget) && isPlainObject(oldStateSource)) {
              patchObject(newStateTarget, oldStateSource);
            } else {
              newStore.$state[stateKey] = oldStateSource;
            }
          }
          set(store, stateKey, vue.toRef(newStore.$state, stateKey));
        });
        Object.keys(store.$state).forEach((stateKey) => {
          if (!(stateKey in newStore.$state)) {
            del(store, stateKey);
          }
        });
        isListening = false;
        isSyncListening = false;
        pinia2.state.value[$id] = vue.toRef(newStore._hmrPayload, "hotState");
        isSyncListening = true;
        vue.nextTick().then(() => {
          isListening = true;
        });
        for (const actionName in newStore._hmrPayload.actions) {
          const action = newStore[actionName];
          set(store, actionName, wrapAction(actionName, action));
        }
        for (const getterName in newStore._hmrPayload.getters) {
          const getter = newStore._hmrPayload.getters[getterName];
          const getterValue = isOptionsStore ? vue.computed(() => {
            setActivePinia(pinia2);
            return getter.call(store, store);
          }) : getter;
          set(store, getterName, getterValue);
        }
        Object.keys(store._hmrPayload.getters).forEach((key) => {
          if (!(key in newStore._hmrPayload.getters)) {
            del(store, key);
          }
        });
        Object.keys(store._hmrPayload.actions).forEach((key) => {
          if (!(key in newStore._hmrPayload.actions)) {
            del(store, key);
          }
        });
        store._hmrPayload = newStore._hmrPayload;
        store._getters = newStore._getters;
        store._hotUpdating = false;
      });
      const nonEnumerable = {
        writable: true,
        configurable: true,
        enumerable: false
      };
      if (IS_CLIENT) {
        ["_p", "_hmrPayload", "_getters", "_customProperties"].forEach((p) => {
          Object.defineProperty(store, p, __spreadValues({
            value: store[p]
          }, nonEnumerable));
        });
      }
    }
    pinia2._p.forEach((extender) => {
      if (IS_CLIENT) {
        const extensions = scope.run(() => extender({
          store,
          app: pinia2._a,
          pinia: pinia2,
          options: optionsForPlugin
        }));
        Object.keys(extensions || {}).forEach((key) => store._customProperties.add(key));
        assign(store, extensions);
      } else {
        assign(store, scope.run(() => extender({
          store,
          app: pinia2._a,
          pinia: pinia2,
          options: optionsForPlugin
        })));
      }
    });
    if (store.$state && typeof store.$state === "object" && typeof store.$state.constructor === "function" && !store.$state.constructor.toString().includes("[native code]")) {
      console.warn(`[\u{1F34D}]: The "state" must be a plain object. It cannot be
	state: () => new MyClass()
Found in store "${store.$id}".`);
    }
    if (initialState && isOptionsStore && options.hydrate) {
      options.hydrate(store.$state, initialState);
    }
    isListening = true;
    isSyncListening = true;
    return store;
  }
  function defineStore(idOrOptions, setup, setupOptions) {
    let id;
    let options;
    const isSetupStore = typeof setup === "function";
    if (typeof idOrOptions === "string") {
      id = idOrOptions;
      options = isSetupStore ? setupOptions : setup;
    } else {
      options = idOrOptions;
      id = idOrOptions.id;
    }
    function useStore(pinia2, hot) {
      const currentInstance = vue.getCurrentInstance();
      pinia2 = pinia2 || currentInstance && vue.inject(piniaSymbol);
      if (pinia2)
        setActivePinia(pinia2);
      if (!activePinia) {
        throw new Error(`[\u{1F34D}]: getActivePinia was called with no active Pinia. Did you forget to install pinia?
	const pinia = createPinia()
	app.use(pinia)
This will fail in production.`);
      }
      pinia2 = activePinia;
      if (!pinia2._s.has(id)) {
        if (isSetupStore) {
          createSetupStore(id, setup, options, pinia2);
        } else {
          createOptionsStore(id, options, pinia2);
        }
        {
          useStore._pinia = pinia2;
        }
      }
      const store = pinia2._s.get(id);
      if (hot) {
        const hotId = "__hot:" + id;
        const newStore = isSetupStore ? createSetupStore(hotId, setup, options, pinia2, true) : createOptionsStore(hotId, assign({}, options), pinia2, true);
        hot._hotUpdate(newStore);
        delete pinia2.state.value[hotId];
        pinia2._s.delete(hotId);
      }
      if (IS_CLIENT && currentInstance && currentInstance.proxy && !hot) {
        const vm = currentInstance.proxy;
        const cache = "_pStores" in vm ? vm._pStores : vm._pStores = {};
        cache[id] = store;
      }
      return store;
    }
    useStore.$id = id;
    return useStore;
  }
  let mapStoreSuffix = "Store";
  function setMapStoreSuffix(suffix) {
    mapStoreSuffix = suffix;
  }
  function mapStores(...stores) {
    if (Array.isArray(stores[0])) {
      console.warn(`[\u{1F34D}]: Directly pass all stores to "mapStores()" without putting them in an array:
Replace
	mapStores([useAuthStore, useCartStore])
with
	mapStores(useAuthStore, useCartStore)
This will fail in production if not fixed.`);
      stores = stores[0];
    }
    return stores.reduce((reduced, useStore) => {
      reduced[useStore.$id + mapStoreSuffix] = function() {
        return useStore(this.$pinia);
      };
      return reduced;
    }, {});
  }
  function mapState(useStore, keysOrMapper) {
    return Array.isArray(keysOrMapper) ? keysOrMapper.reduce((reduced, key) => {
      reduced[key] = function() {
        return useStore(this.$pinia)[key];
      };
      return reduced;
    }, {}) : Object.keys(keysOrMapper).reduce((reduced, key) => {
      reduced[key] = function() {
        const store = useStore(this.$pinia);
        const storeKey = keysOrMapper[key];
        return typeof storeKey === "function" ? storeKey.call(this, store) : store[storeKey];
      };
      return reduced;
    }, {});
  }
  const mapGetters = mapState;
  function mapActions(useStore, keysOrMapper) {
    return Array.isArray(keysOrMapper) ? keysOrMapper.reduce((reduced, key) => {
      reduced[key] = function(...args) {
        return useStore(this.$pinia)[key](...args);
      };
      return reduced;
    }, {}) : Object.keys(keysOrMapper).reduce((reduced, key) => {
      reduced[key] = function(...args) {
        return useStore(this.$pinia)[keysOrMapper[key]](...args);
      };
      return reduced;
    }, {});
  }
  function mapWritableState(useStore, keysOrMapper) {
    return Array.isArray(keysOrMapper) ? keysOrMapper.reduce((reduced, key) => {
      reduced[key] = {
        get() {
          return useStore(this.$pinia)[key];
        },
        set(value) {
          return useStore(this.$pinia)[key] = value;
        }
      };
      return reduced;
    }, {}) : Object.keys(keysOrMapper).reduce((reduced, key) => {
      reduced[key] = {
        get() {
          return useStore(this.$pinia)[keysOrMapper[key]];
        },
        set(value) {
          return useStore(this.$pinia)[keysOrMapper[key]] = value;
        }
      };
      return reduced;
    }, {});
  }
  function storeToRefs(store) {
    {
      store = vue.toRaw(store);
      const refs = {};
      for (const key in store) {
        const value = store[key];
        if (vue.isRef(value) || vue.isReactive(value)) {
          refs[key] = vue.toRef(store, key);
        }
      }
      return refs;
    }
  }
  const PiniaVuePlugin = function(_Vue) {
    _Vue.mixin({
      beforeCreate() {
        const options = this.$options;
        if (options.pinia) {
          const pinia2 = options.pinia;
          if (!this._provided) {
            const provideCache = {};
            Object.defineProperty(this, "_provided", {
              get: () => provideCache,
              set: (v) => Object.assign(provideCache, v)
            });
          }
          this._provided[piniaSymbol] = pinia2;
          if (!this.$pinia) {
            this.$pinia = pinia2;
          }
          pinia2._a = this;
          if (IS_CLIENT) {
            setActivePinia(pinia2);
            {
              registerPiniaDevtools(pinia2._a, pinia2);
            }
          }
        } else if (!this.$pinia && options.parent && options.parent.$pinia) {
          this.$pinia = options.parent.$pinia;
        }
      },
      destroyed() {
        delete this._pStores;
      }
    });
  };
  var Pinia = /* @__PURE__ */ Object.freeze({
    __proto__: null,
    [Symbol.toStringTag]: "Module",
    get MutationType() {
      return MutationType;
    },
    PiniaVuePlugin,
    acceptHMRUpdate,
    createPinia,
    defineStore,
    getActivePinia,
    mapActions,
    mapGetters,
    mapState,
    mapStores,
    mapWritableState,
    setActivePinia,
    setMapStoreSuffix,
    skipHydrate,
    storeToRefs
  });
  const requestUrl = "http://47.106.228.230:8080/yijie";
  const getToken = () => {
    try {
      return uni.getStorageSync("token");
    } catch (e) {
    }
    return null;
  };
  const setToken = (token) => {
    try {
      return uni.setStorageSync("token", token);
    } catch (e) {
    }
    return null;
  };
  const getUnionuser = () => {
    try {
      return uni.getStorageSync("unionuser");
    } catch (e) {
    }
    return null;
  };
  const setUnionuser = (unionuser) => {
    try {
      return uni.setStorageSync("unionuser", unionuser);
    } catch (e) {
    }
    return null;
  };
  var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
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
    md52._ff = function(a, b, c, d, x, s, t2) {
      var n = a + (b & c | ~b & d) + (x >>> 0) + t2;
      return (n << s | n >>> 32 - s) + b;
    };
    md52._gg = function(a, b, c, d, x, s, t2) {
      var n = a + (b & d | c & ~d) + (x >>> 0) + t2;
      return (n << s | n >>> 32 - s) + b;
    };
    md52._hh = function(a, b, c, d, x, s, t2) {
      var n = a + (b ^ c ^ d) + (x >>> 0) + t2;
      return (n << s | n >>> 32 - s) + b;
    };
    md52._ii = function(a, b, c, d, x, s, t2) {
      var n = a + (c ^ (b | ~d)) + (x >>> 0) + t2;
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
  async function query(data) {
    return request("/home/home", { data });
  }
  async function queryGoodsList(data) {
    return request("/goods/goodsZone", { data });
  }
  async function queryHotWordList(data) {
    return request("/home/hotWord", { data });
  }
  var services_home = /* @__PURE__ */ Object.freeze({
    __proto__: null,
    [Symbol.toStringTag]: "Module",
    query,
    queryGoodsList,
    queryHotWordList
  });
  var useHomeStore = defineStore("home", {
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
        const response = await query(__spreadValues({}, payload));
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
        const response = await services_home[service](__spreadValues({}, payload));
        return response;
      }
    }
  });
  async function getSysParams(data) {
    return request("/common/getCode", { data });
  }
  async function getTimestamp(data) {
    return request("/user/getCurSysTimestamp", { data });
  }
  async function getMsgCode(data) {
    return request("/user/msgCode", { data });
  }
  async function login(data) {
    return request("/user/login", { data });
  }
  async function feedback(data) {
    return request("/user/feedback", { data, method: "POST" });
  }
  async function contact(data) {
    return request("/user/staff", { data });
  }
  async function changePhone(data) {
    return request("/user/updateAccount", { data, method: "POST" });
  }
  async function checkAndroidUpdate(data) {
    return request("/common/checkUpdate", { data });
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
  const _sfc_main$5 = {
    __name: "index",
    setup(__props) {
      const myUpload = (rsp) => {
        formatAppLog("log", "at pages/index.vue:27", rsp);
        avatarUrl.value = rsp.path;
      };
      const avatarUrl = vue.ref("/static/tabbar/icon_home_click@2x.png");
      const homeStore = useHomeStore();
      const { pagination, loading } = storeToRefs(homeStore);
      useGlobalStore();
      onShow(() => {
        formatAppLog("log", "at pages/index.vue:37", "onShow");
      });
      onLoad(() => {
        formatAppLog("log", "at pages/index.vue:40", "onLoad");
      });
      onReachBottom(() => {
        pagination.value;
      });
      return (_ctx, _cache) => {
        const _component_avatar_cropper = resolveEasycom(vue.resolveDynamicComponent("avatar-cropper"), __easycom_0$1);
        const _component_yuansheng_loadmore = resolveEasycom(vue.resolveDynamicComponent("yuansheng-loadmore"), __easycom_1);
        return vue.openBlock(), vue.createElementBlock("view", { class: "container" }, [
          vue.createTextVNode(" 12344444441111 "),
          vue.createVNode(_component_avatar_cropper, {
            selWidth: "600rpx",
            selHeight: "600rpx",
            stretch: "short",
            inner: true,
            onUpload: myUpload,
            avatarSrc: avatarUrl.value,
            avatarStyle: "width: 200rpx; height: 200rpx; border-radius: 0;"
          }, null, 8, ["avatarSrc"]),
          vue.createVNode(_component_yuansheng_loadmore, {
            loading: vue.unref(loading),
            pagination: vue.unref(pagination)
          }, null, 8, ["loading", "pagination"])
        ]);
      };
    }
  };
  var PagesIndex = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["__scopeId", "data-v-2a183b29"], ["__file", "/Users/waner/Documents/Demos/uni_demo_vue3/pages/index.vue"]]);
  const _sfc_main$4 = {};
  function _sfc_render(_ctx, _cache) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "container" }, " 2 ");
  }
  var PagesDrive = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["render", _sfc_render], ["__scopeId", "data-v-08bc8fe1"], ["__file", "/Users/waner/Documents/Demos/uni_demo_vue3/pages/drive.vue"]]);
  const _sfc_main$3 = {
    __name: "mine",
    setup(__props) {
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("view", { class: "container" }, " 3 ");
      };
    }
  };
  var PagesMine = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["__scopeId", "data-v-ef6e6e68"], ["__file", "/Users/waner/Documents/Demos/uni_demo_vue3/pages/mine.vue"]]);
  var useSysStore = defineStore("sys", {
    actions: {
      async login(payload) {
        const response = await login(__spreadValues({}, payload));
        if ((response == null ? void 0 : response.code) == 200) {
          setUnionuser(response.data);
          setToken(response.data.token);
          uni.navigateBack();
        } else {
          uni.showToast({ title: response.msg, icon: "none", mask: true });
        }
        return response;
      },
      async service({ payload, service }) {
        const response = await services_sys[service](__spreadValues({}, payload));
        return response;
      }
    }
  });
  const _sfc_main$2 = {
    __name: "privacy",
    setup(__props) {
      const sysStore = useSysStore();
      const privacy = vue.ref();
      const detail = vue.computed(() => {
        var _a;
        return (_a = privacy.value) == null ? void 0 : _a.replace(/<p><\/p>/g, "<br/>").replace(/<img/g, `<img style="max-width:100%;display:block"`);
      });
      const close = () => {
        uni.navigateBack();
      };
      onLoad(() => {
        sysStore.service({
          service: "getSysParams",
          payload: { id: "privacyProtocol" }
        }).then((res) => {
          if (res.code == 200) {
            privacy.value = res.data.codeValue;
          }
        });
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("view", { class: "container" }, [
          vue.createElementVNode("view", { class: "contentWrap" }, [
            vue.createElementVNode("view", { class: "title" }, "\u7528\u6237\u534F\u8BAE\u548C\u9690\u79C1\u653F\u7B56"),
            vue.createElementVNode("view", { class: "content" }, [
              vue.createElementVNode("rich-text", { nodes: vue.unref(detail) }, null, 8, ["nodes"])
            ]),
            vue.createElementVNode("view", {
              class: "closeBtn",
              onClick: close
            }, "\u786E\u5B9A")
          ])
        ]);
      };
    }
  };
  var PlatformsAppPlusAndroidPrivacy = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-5648bd08"], ["__file", "/Users/waner/Documents/Demos/uni_demo_vue3/platforms/app-plus/android/privacy.vue"]]);
  const _sfc_main$1 = {
    __name: "richText",
    setup(__props) {
      const sysStore = useSysStore();
      const richText = vue.ref("");
      onLoad(async ({ key }) => {
        if (key) {
          switch (key) {
            case "0":
              uni.setNavigationBarTitle({ title: "\u7528\u6237\u534F\u8BAE" });
              break;
            case "1":
              uni.setNavigationBarTitle({ title: "\u9690\u79C1\u653F\u7B56" });
              break;
            case "2":
              uni.setNavigationBarTitle({ title: "\u5173\u4E8E\u6211\u4EEC" });
              break;
          }
          uni.showLoading();
          const res = await sysStore.service({ service: "getSysParams", payload: { key } });
          uni.hideLoading();
          if (res.code == 200) {
            richText.value = res.data.codeValue.replace(/<p><\/p>/g, "<br/>").replace(/<img/g, `<img style="max-width:100%;display:block"`);
          }
        } else {
          const { ctx } = vue.getCurrentInstance();
          const eventChannel = ctx.getOpenerEventChannel();
          eventChannel.once("transportRichText", (data) => {
            richText.value = data == null ? void 0 : data.replace(/<p><\/p>/g, "<br/>").replace(/<img/g, `<img style="max-width:100%;display:block"`);
          });
        }
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("view", { class: "container" }, [
          vue.createElementVNode("rich-text", {
            nodes: richText.value,
            space: "nbsp"
          }, null, 8, ["nodes"])
        ]);
      };
    }
  };
  var PagesRichText = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-f7aef5bc"], ["__file", "/Users/waner/Documents/Demos/uni_demo_vue3/pages/richText.vue"]]);
  __definePage("pages/index", PagesIndex);
  __definePage("pages/drive", PagesDrive);
  __definePage("pages/mine", PagesMine);
  __definePage("platforms/app-plus/android/privacy", PlatformsAppPlusAndroidPrivacy);
  __definePage("pages/richText", PagesRichText);
  const _sfc_main = {
    __name: "App",
    setup(__props) {
      onLaunch(() => {
        formatAppLog("log", "at App.vue:6", "App Launch");
        const jpushModule = requireNativePlugin("JG-JPush");
        jpushModule == null ? void 0 : jpushModule.initJPushService();
        jpushModule == null ? void 0 : jpushModule.setLoggerEnable(true);
        jpushModule == null ? void 0 : jpushModule.addConnectEventListener((result) => {
          let connectEnable = result.connectEnable;
          formatAppLog("log", "at App.vue:38", result, plus.os.name);
          if (connectEnable == true) {
            formatAppLog("log", "at App.vue:40", "\u5DF2\u8FDE\u63A5");
            jpushModule.setAlias({
              "alias": plus.os.name,
              "sequence": 1
            });
          } else {
            formatAppLog("log", "at App.vue:50", "\u672A\u8FDE\u63A5");
          }
        });
        jpushModule == null ? void 0 : jpushModule.addNotificationListener((result) => {
          const notificationEventType = result.notificationEventType;
          result.messageID;
          result.title;
          result.content;
          result.extras;
          formatAppLog("log", "at App.vue:62", notificationEventType);
          uni.showToast({
            icon: "none",
            title: JSON.stringify(result),
            duration: 3e3
          });
        });
      });
      onShow(() => {
        formatAppLog("log", "at App.vue:72", "App Show");
        const jpushModule = requireNativePlugin("JG-JPush");
        jpushModule == null ? void 0 : jpushModule.setBadge(0);
        plus.runtime.setBadgeNumber(0);
      });
      onHide(() => {
        formatAppLog("log", "at App.vue:80", "App Hide");
      });
      return () => {
      };
    }
  };
  var App = /* @__PURE__ */ _export_sfc(_sfc_main, [["__file", "/Users/waner/Documents/Demos/uni_demo_vue3/App.vue"]]);
  var piniaLoading = ({ store }) => {
    const loading = vue.ref(false);
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
        formatAppLog("log", "at stores/pinia-loading.js:29", "\u9519\u8BEF\u6355\u83B7", error);
      });
    });
  };
  var dayjs_min = { exports: {} };
  (function(module, exports) {
    !function(t2, e) {
      module.exports = e();
    }(commonjsGlobal, function() {
      var t2 = 1e3, e = 6e4, n = 36e5, r = "millisecond", i = "second", s = "minute", u = "hour", a = "day", o = "week", f = "month", h = "quarter", c = "year", d = "date", $ = "Invalid Date", l = /^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/, y = /\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g, M = { name: "en", weekdays: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"), months: "January_February_March_April_May_June_July_August_September_October_November_December".split("_") }, m = function(t3, e2, n2) {
        var r2 = String(t3);
        return !r2 || r2.length >= e2 ? t3 : "" + Array(e2 + 1 - r2.length).join(n2) + t3;
      }, g = { s: m, z: function(t3) {
        var e2 = -t3.utcOffset(), n2 = Math.abs(e2), r2 = Math.floor(n2 / 60), i2 = n2 % 60;
        return (e2 <= 0 ? "+" : "-") + m(r2, 2, "0") + ":" + m(i2, 2, "0");
      }, m: function t3(e2, n2) {
        if (e2.date() < n2.date())
          return -t3(n2, e2);
        var r2 = 12 * (n2.year() - e2.year()) + (n2.month() - e2.month()), i2 = e2.clone().add(r2, f), s2 = n2 - i2 < 0, u2 = e2.clone().add(r2 + (s2 ? -1 : 1), f);
        return +(-(r2 + (n2 - i2) / (s2 ? i2 - u2 : u2 - i2)) || 0);
      }, a: function(t3) {
        return t3 < 0 ? Math.ceil(t3) || 0 : Math.floor(t3);
      }, p: function(t3) {
        return { M: f, y: c, w: o, d: a, D: d, h: u, m: s, s: i, ms: r, Q: h }[t3] || String(t3 || "").toLowerCase().replace(/s$/, "");
      }, u: function(t3) {
        return t3 === void 0;
      } }, v = "en", D = {};
      D[v] = M;
      var p = function(t3) {
        return t3 instanceof _;
      }, S = function t3(e2, n2, r2) {
        var i2;
        if (!e2)
          return v;
        if (typeof e2 == "string") {
          var s2 = e2.toLowerCase();
          D[s2] && (i2 = s2), n2 && (D[s2] = n2, i2 = s2);
          var u2 = e2.split("-");
          if (!i2 && u2.length > 1)
            return t3(u2[0]);
        } else {
          var a2 = e2.name;
          D[a2] = e2, i2 = a2;
        }
        return !r2 && i2 && (v = i2), i2 || !r2 && v;
      }, w = function(t3, e2) {
        if (p(t3))
          return t3.clone();
        var n2 = typeof e2 == "object" ? e2 : {};
        return n2.date = t3, n2.args = arguments, new _(n2);
      }, O = g;
      O.l = S, O.i = p, O.w = function(t3, e2) {
        return w(t3, { locale: e2.$L, utc: e2.$u, x: e2.$x, $offset: e2.$offset });
      };
      var _ = function() {
        function M2(t3) {
          this.$L = S(t3.locale, null, true), this.parse(t3);
        }
        var m2 = M2.prototype;
        return m2.parse = function(t3) {
          this.$d = function(t4) {
            var e2 = t4.date, n2 = t4.utc;
            if (e2 === null)
              return new Date(NaN);
            if (O.u(e2))
              return new Date();
            if (e2 instanceof Date)
              return new Date(e2);
            if (typeof e2 == "string" && !/Z$/i.test(e2)) {
              var r2 = e2.match(l);
              if (r2) {
                var i2 = r2[2] - 1 || 0, s2 = (r2[7] || "0").substring(0, 3);
                return n2 ? new Date(Date.UTC(r2[1], i2, r2[3] || 1, r2[4] || 0, r2[5] || 0, r2[6] || 0, s2)) : new Date(r2[1], i2, r2[3] || 1, r2[4] || 0, r2[5] || 0, r2[6] || 0, s2);
              }
            }
            return new Date(e2);
          }(t3), this.$x = t3.x || {}, this.init();
        }, m2.init = function() {
          var t3 = this.$d;
          this.$y = t3.getFullYear(), this.$M = t3.getMonth(), this.$D = t3.getDate(), this.$W = t3.getDay(), this.$H = t3.getHours(), this.$m = t3.getMinutes(), this.$s = t3.getSeconds(), this.$ms = t3.getMilliseconds();
        }, m2.$utils = function() {
          return O;
        }, m2.isValid = function() {
          return !(this.$d.toString() === $);
        }, m2.isSame = function(t3, e2) {
          var n2 = w(t3);
          return this.startOf(e2) <= n2 && n2 <= this.endOf(e2);
        }, m2.isAfter = function(t3, e2) {
          return w(t3) < this.startOf(e2);
        }, m2.isBefore = function(t3, e2) {
          return this.endOf(e2) < w(t3);
        }, m2.$g = function(t3, e2, n2) {
          return O.u(t3) ? this[e2] : this.set(n2, t3);
        }, m2.unix = function() {
          return Math.floor(this.valueOf() / 1e3);
        }, m2.valueOf = function() {
          return this.$d.getTime();
        }, m2.startOf = function(t3, e2) {
          var n2 = this, r2 = !!O.u(e2) || e2, h2 = O.p(t3), $2 = function(t4, e3) {
            var i2 = O.w(n2.$u ? Date.UTC(n2.$y, e3, t4) : new Date(n2.$y, e3, t4), n2);
            return r2 ? i2 : i2.endOf(a);
          }, l2 = function(t4, e3) {
            return O.w(n2.toDate()[t4].apply(n2.toDate("s"), (r2 ? [0, 0, 0, 0] : [23, 59, 59, 999]).slice(e3)), n2);
          }, y2 = this.$W, M3 = this.$M, m3 = this.$D, g2 = "set" + (this.$u ? "UTC" : "");
          switch (h2) {
            case c:
              return r2 ? $2(1, 0) : $2(31, 11);
            case f:
              return r2 ? $2(1, M3) : $2(0, M3 + 1);
            case o:
              var v2 = this.$locale().weekStart || 0, D2 = (y2 < v2 ? y2 + 7 : y2) - v2;
              return $2(r2 ? m3 - D2 : m3 + (6 - D2), M3);
            case a:
            case d:
              return l2(g2 + "Hours", 0);
            case u:
              return l2(g2 + "Minutes", 1);
            case s:
              return l2(g2 + "Seconds", 2);
            case i:
              return l2(g2 + "Milliseconds", 3);
            default:
              return this.clone();
          }
        }, m2.endOf = function(t3) {
          return this.startOf(t3, false);
        }, m2.$set = function(t3, e2) {
          var n2, o2 = O.p(t3), h2 = "set" + (this.$u ? "UTC" : ""), $2 = (n2 = {}, n2[a] = h2 + "Date", n2[d] = h2 + "Date", n2[f] = h2 + "Month", n2[c] = h2 + "FullYear", n2[u] = h2 + "Hours", n2[s] = h2 + "Minutes", n2[i] = h2 + "Seconds", n2[r] = h2 + "Milliseconds", n2)[o2], l2 = o2 === a ? this.$D + (e2 - this.$W) : e2;
          if (o2 === f || o2 === c) {
            var y2 = this.clone().set(d, 1);
            y2.$d[$2](l2), y2.init(), this.$d = y2.set(d, Math.min(this.$D, y2.daysInMonth())).$d;
          } else
            $2 && this.$d[$2](l2);
          return this.init(), this;
        }, m2.set = function(t3, e2) {
          return this.clone().$set(t3, e2);
        }, m2.get = function(t3) {
          return this[O.p(t3)]();
        }, m2.add = function(r2, h2) {
          var d2, $2 = this;
          r2 = Number(r2);
          var l2 = O.p(h2), y2 = function(t3) {
            var e2 = w($2);
            return O.w(e2.date(e2.date() + Math.round(t3 * r2)), $2);
          };
          if (l2 === f)
            return this.set(f, this.$M + r2);
          if (l2 === c)
            return this.set(c, this.$y + r2);
          if (l2 === a)
            return y2(1);
          if (l2 === o)
            return y2(7);
          var M3 = (d2 = {}, d2[s] = e, d2[u] = n, d2[i] = t2, d2)[l2] || 1, m3 = this.$d.getTime() + r2 * M3;
          return O.w(m3, this);
        }, m2.subtract = function(t3, e2) {
          return this.add(-1 * t3, e2);
        }, m2.format = function(t3) {
          var e2 = this, n2 = this.$locale();
          if (!this.isValid())
            return n2.invalidDate || $;
          var r2 = t3 || "YYYY-MM-DDTHH:mm:ssZ", i2 = O.z(this), s2 = this.$H, u2 = this.$m, a2 = this.$M, o2 = n2.weekdays, f2 = n2.months, h2 = function(t4, n3, i3, s3) {
            return t4 && (t4[n3] || t4(e2, r2)) || i3[n3].slice(0, s3);
          }, c2 = function(t4) {
            return O.s(s2 % 12 || 12, t4, "0");
          }, d2 = n2.meridiem || function(t4, e3, n3) {
            var r3 = t4 < 12 ? "AM" : "PM";
            return n3 ? r3.toLowerCase() : r3;
          }, l2 = { YY: String(this.$y).slice(-2), YYYY: this.$y, M: a2 + 1, MM: O.s(a2 + 1, 2, "0"), MMM: h2(n2.monthsShort, a2, f2, 3), MMMM: h2(f2, a2), D: this.$D, DD: O.s(this.$D, 2, "0"), d: String(this.$W), dd: h2(n2.weekdaysMin, this.$W, o2, 2), ddd: h2(n2.weekdaysShort, this.$W, o2, 3), dddd: o2[this.$W], H: String(s2), HH: O.s(s2, 2, "0"), h: c2(1), hh: c2(2), a: d2(s2, u2, true), A: d2(s2, u2, false), m: String(u2), mm: O.s(u2, 2, "0"), s: String(this.$s), ss: O.s(this.$s, 2, "0"), SSS: O.s(this.$ms, 3, "0"), Z: i2 };
          return r2.replace(y, function(t4, e3) {
            return e3 || l2[t4] || i2.replace(":", "");
          });
        }, m2.utcOffset = function() {
          return 15 * -Math.round(this.$d.getTimezoneOffset() / 15);
        }, m2.diff = function(r2, d2, $2) {
          var l2, y2 = O.p(d2), M3 = w(r2), m3 = (M3.utcOffset() - this.utcOffset()) * e, g2 = this - M3, v2 = O.m(this, M3);
          return v2 = (l2 = {}, l2[c] = v2 / 12, l2[f] = v2, l2[h] = v2 / 3, l2[o] = (g2 - m3) / 6048e5, l2[a] = (g2 - m3) / 864e5, l2[u] = g2 / n, l2[s] = g2 / e, l2[i] = g2 / t2, l2)[y2] || g2, $2 ? v2 : O.a(v2);
        }, m2.daysInMonth = function() {
          return this.endOf(f).$D;
        }, m2.$locale = function() {
          return D[this.$L];
        }, m2.locale = function(t3, e2) {
          if (!t3)
            return this.$L;
          var n2 = this.clone(), r2 = S(t3, e2, true);
          return r2 && (n2.$L = r2), n2;
        }, m2.clone = function() {
          return O.w(this.$d, this);
        }, m2.toDate = function() {
          return new Date(this.valueOf());
        }, m2.toJSON = function() {
          return this.isValid() ? this.toISOString() : null;
        }, m2.toISOString = function() {
          return this.$d.toISOString();
        }, m2.toString = function() {
          return this.$d.toUTCString();
        }, M2;
      }(), T = _.prototype;
      return w.prototype = T, [["$ms", r], ["$s", i], ["$m", s], ["$H", u], ["$W", a], ["$M", f], ["$y", c], ["$D", d]].forEach(function(t3) {
        T[t3[1]] = function(e2) {
          return this.$g(e2, t3[0], t3[1]);
        };
      }), w.extend = function(t3, e2) {
        return t3.$i || (t3(e2, _, w), t3.$i = true), w;
      }, w.locale = S, w.isDayjs = p, w.unix = function(t3) {
        return w(1e3 * t3);
      }, w.en = D[v], w.Ls = D, w.p = {}, w;
    });
  })(dayjs_min);
  var dayjs = dayjs_min.exports;
  const app = vue.createVueApp(App);
  const pinia = createPinia();
  pinia.use(piniaLoading);
  app.use(pinia);
  app.config.globalProperties.$isLogin = () => {
    if (!getUnionuser()) {
      uni.showModal({
        title: "\u6E29\u99A8\u63D0\u793A",
        content: "\u8BF7\u5148\u767B\u5F55/\u6CE8\u518C\uFF01",
        confirmText: "\u786E\u5B9A",
        success: (res) => {
          if (res.confirm) {
            uni.navigateTo({ url: "/pages/login" });
          }
        }
      });
      return true;
    }
  };
  app.config.globalProperties.$format = (value, format = "YYYY-MM-DD") => value ? dayjs(value).format(format) : "";
  app.config.globalProperties.$distance = (value) => Number(value) > 1e3 ? (Number(value) / 1e3).toFixed(2) + "km" : Number(value) + "m";
  app.config.globalProperties.$decimal = (value, precision = 2) => Number(value).toFixed(precision);
  function createApp() {
    return {
      app,
      Pinia
    };
  }
  const { app: __app__, Vuex: __Vuex__, Pinia: __Pinia__ } = createApp();
  uni.Vuex = __Vuex__;
  uni.Pinia = __Pinia__;
  __app__.provide("__globalStyles", __uniConfig.styles);
  __app__._component.mpType = "app";
  __app__._component.render = () => {
  };
  __app__.mount("#app");
})(Vue, uni.VueShared);
