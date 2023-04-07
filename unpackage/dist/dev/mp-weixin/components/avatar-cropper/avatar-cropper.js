"use strict";
var common_vendor = require("../../common/vendor.js");
const tH = 50;
const _sfc_main = {
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
    this.cc = common_vendor.index.createCanvasContext("avatar-canvas", this);
    this.cco = common_vendor.index.createCanvasContext("oper-canvas", this);
    this.ccp = common_vendor.index.createCanvasContext("prv-canvas", this);
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
      common_vendor.index.showTabBar({
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
      let sysInfo = common_vendor.index.getSystemInfoSync();
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
      common_vendor.index.chooseImage({
        count: 1,
        sizeType: ["original", "compressed"],
        sourceType: ["album", "camera"],
        success: (r) => {
          common_vendor.index.showLoading({
            title: "\u52A0\u8F7D\u4E2D...",
            mask: true
          });
          let path = this.imgPath = r.tempFilePaths[0];
          common_vendor.index.getImageInfo({
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
                  common_vendor.index.showModal({
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
                common_vendor.index.hideTabBar({
                  complete: () => {
                    this.fDrawInit(true);
                  }
                });
              }
            },
            fail: () => {
              common_vendor.index.showToast({
                title: "\u8BF7\u9009\u62E9\u6B63\u786E\u56FE\u7247",
                duration: 2e3
              });
            },
            complete() {
              common_vendor.index.hideLoading();
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
      common_vendor.index.showLoading({
        title: "\u52A0\u8F7D\u4E2D...",
        mask: true
      });
      this.sD = "none";
      this.sT = "-10000px";
      this.hasSel = false;
      this.fHideImg();
      common_vendor.index.canvasToTempFilePath({
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
          common_vendor.index.showToast({
            title: "error1",
            duration: 2e3
          });
        },
        complete: () => {
          common_vendor.index.hideLoading();
          this.noBar || common_vendor.index.showTabBar();
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
      common_vendor.index.showLoading({
        title: "\u52A0\u8F7D\u4E2D...",
        mask: true
      });
      this.sD = "none";
      this.sT = "-10000px";
      this.hasSel = false;
      this.fHideImg();
      common_vendor.index.canvasToTempFilePath({
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
          common_vendor.index.showToast({
            title: "error_prv",
            duration: 2e3
          });
        },
        complete: () => {
          common_vendor.index.hideLoading();
          this.noBar || common_vendor.index.showTabBar();
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
      common_vendor.index.showLoading({
        title: "\u52A0\u8F7D\u4E2D...",
        mask: true
      });
      common_vendor.index.canvasToTempFilePath({
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
          common_vendor.index.showToast({
            title: "error2",
            duration: 2e3
          });
        },
        complete: () => {
          common_vendor.index.hideLoading();
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
          let imgWidth = this.useWidth * this.scaleSize, imgHeight = this.useHeight * this.scaleSize, l = beX, t = beY, r = l + imgWidth, b = t + imgHeight, left = parseInt(this.sS.left), top = parseInt(this.sS.top), right = left + parseInt(this.sS.width), bottom = top + parseInt(this.sS.height), cx, cy;
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
            if (top < t - cy) {
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
      this.noBar || common_vendor.index.showTabBar();
      this.$emit("end");
    },
    fGetImgData() {
      return new Promise((resolve, reject) => {
        let prvX = this.prvX, prvY = this.prvY, prvWidth = this.prvWidth, prvHeight = this.prvHeight;
        common_vendor.index.canvasGetImageData({
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
      common_vendor.index.showLoading({
        title: "\u52A0\u8F7D\u4E2D...",
        mask: true
      });
      if (!this.prvImgData) {
        if (!(this.prvImgData = await this.fGetImgData().catch(() => {
          common_vendor.index.showToast({
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
            let correctRGB = (t) => {
              if (t < 0) {
                return t + 1;
              }
              if (t > 1) {
                return t - 1;
              }
              return t;
            };
            let createRGB = (t) => {
              if (t < 1 / 6) {
                return p + (q - p) * 6 * t;
              } else if (t >= 1 / 6 && t < 1 / 2) {
                return q;
              } else if (t >= 1 / 2 && t < 2 / 3) {
                return p + (q - p) * 6 * (2 / 3 - t);
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
      common_vendor.index.canvasPutImageData({
        canvasId: "prv-canvas",
        x: prvX,
        y: prvY,
        width: prvWidth,
        height: prvHeight,
        data: target,
        fail() {
          common_vendor.index.showToast({
            title: "error_put",
            duration: 2e3
          });
        },
        complete() {
          common_vendor.index.hideLoading();
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
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.imgSrc.imgSrc,
    b: common_vendor.o((...args) => $options.fSelect && $options.fSelect(...args)),
    c: common_vendor.s($data.iS),
    d: $data.sT,
    e: $data.csH,
    f: $data.sT,
    g: $data.csH,
    h: common_vendor.o((...args) => $options.fStart && $options.fStart(...args)),
    i: common_vendor.o((...args) => $options.fMove && $options.fMove(...args)),
    j: common_vendor.o((...args) => $options.fEnd && $options.fEnd(...args)),
    k: common_vendor.o((...args) => $options.fHideImg && $options.fHideImg(...args)),
    l: $data.csH,
    m: $data.pT,
    n: common_vendor.o((...args) => $options.fSelect && $options.fSelect(...args)),
    o: $data.bW,
    p: common_vendor.o((...args) => $options.fClose && $options.fClose(...args)),
    q: $data.bW,
    r: common_vendor.o((...args) => $options.fPreview && $options.fPreview(...args)),
    s: $data.bW,
    t: common_vendor.o((...args) => $options.fUpload && $options.fUpload(...args)),
    v: $data.bW,
    w: $data.sD
  };
}
var Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/Users/waner/Documents/Demos/uni_demo_vue3/components/avatar-cropper/avatar-cropper.vue"]]);
wx.createComponent(Component);
