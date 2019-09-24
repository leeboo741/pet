// pages/unConfirmOrder/unConfirmOrder.js
const app = getApp();
const config = require("../../utils/config.js");
const util = require("../../utils/util.js");
const loginUtil = require("../../utils/loginUtils.js");

const maxImageCount = 8; // 最大图片数量限制
const maxVideoCount = 8; // 最大视频数量限制
const maxVideoLength = 10; // 最大视频长度限制
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderList: [], // 订单列表
    finishPage: false, // 页面是否终结
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    loginUtil.checkLogin(function alreadyLoginCallback(state) {
      if (state) {
        that.requestUnConfirmOrderList();
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log("/unConfirmOrder/unConfirmOrder 销毁")
    this.data.finishPage = true;
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  /**
   * 处理
   */
  handleReadyToUpload: function (order) {
    if (util.checkEmpty(order.uploadImages)
      && util.checkEmpty(order.uploadVideos)) {
      order.readyToUpload = false;
    } else {
      order.readyToUpload = true;
    }
    this.setData({
      orderList: this.data.orderList
    })
  },

  /**
   * 是否可以入港
   */
  handleReadyToConfirm: function (order) {
    if ((!util.checkEmpty(order.images) || !util.checkEmpty(order.videos))
      && util.checkEmpty(order.uploadImages)
      && util.checkEmpty(order.uploadVideos)) {
      order.readyToConfirm = true;
    } else {
      order.readyToConfirm = false;
    }
    this.setData({
      orderList: this.data.orderList
    })
  },

  /**
   * 删除视频
   */
  deleteUploadVideo: function (e) {
    let tempOrder = this.data.orderList[e.currentTarget.dataset.tapindex];
    tempOrder.uploadVideos.splice(e.currentTarget.dataset.videoindex, 1);
    this.handleReadyToUpload(tempOrder);
    this.handleReadyToConfirm(tempOrder);
  },

  /**
   * 删除上传图片
   */
  deleteUploadImage: function (e) {
    let tempOrder = this.data.orderList[e.currentTarget.dataset.tapindex];
    tempOrder.uploadImages.splice(e.currentTarget.dataset.imageindex, 1);
    this.handleReadyToUpload(tempOrder);
    this.handleReadyToConfirm(tempOrder);
  },

  /**
    * 确定上传
    */
  tapConfirmUpload: function (e) {
    let tempOrder = this.data.orderList[e.currentTarget.dataset.tapindex];
    let uploadList = [];
    if (!util.checkEmpty(tempOrder.uploadImages)) {
      uploadList = uploadList.concat(tempOrder.uploadImages);
    }
    if (!util.checkEmpty(tempOrder.uploadVideos)) {
      uploadList = uploadList.concat(tempOrder.uploadVideos)
    }
    let uploadIndex = 0;
    let uploadLength = uploadList.length;
    console.log("需要上传的文件 => \n图片:\n" + JSON.stringify(tempOrder.uploadImages) + "\n视频：\n" + JSON.stringify(tempOrder.uploadVideos));
    this.requestUploadFile(uploadList, uploadIndex, tempOrder);
  },

  /**
   * 上传文件
   * @param fileList 文件列表
   * @param uploadIndex 要上传的文件下标
   * @param order 单据
   */
  requestUploadFile: function (fileList, uploadIndex, order) {
    wx.showLoading({
      title: '上传中...',
    })
    let that = this;
    wx.uploadFile({
      url: config.URL_Service + config.URL_UploadFile,
      filePath: fileList[uploadIndex],
      name: 'multipartFiles',
      header: { "Content-Type": "multipart/form-data" },
      formData: {
        "orderNo": order.orderNo
      },
      success(res) {
        console.log("upload success =>" + JSON.stringify(res));
        let tempObj = JSON.parse(res.data);
        if (res.data.prompt != null && res.data.prompt == config.Prompt_Error) {
          wx.showToast({
            title: "文件上传失败",
            icon: 'none'
          })
        } else {
          let mediaAddress = tempObj.data[0].viewAddress;

          if (util.isVideo(mediaAddress)) {
            if (order.videos == null) {
              order.videos = [];
            }
            let tempFile = fileList[uploadIndex];
            let tempIndex = that.getIndexOf(tempFile, order.uploadVideos);
            order.videos.push(mediaAddress);
            order.uploadVideos.splice(tempIndex, 1);
          } else {
            if (order.images == null) {
              order.images = [];
            }
            let tempFile = fileList[uploadIndex];
            let tempIndex = that.getIndexOf(tempFile, order.uploadImages);
            order.images.push(tempObj.data[0].viewAddress);
            order.uploadImages.splice(tempIndex, 1);
          }
          that.setData({
            orderList: that.data.orderList
          })
        }
      },
      fail(res) {
        console.log("上传失败 index: " + uploadIndex);
        wx.showToast({
          title: "一个文件上传失败",
          icon: 'none'
        })
      },
      complete(res) {
        console.log("上传完成 index: " + uploadIndex);
        uploadIndex++;
        wx.hideLoading();
        if (!that.data.finishPage) {
          if (uploadIndex < fileList.length) {
            that.requestUploadFile(fileList, uploadIndex, order)
          } else {
            wx.showToast({
              title: '上传完成',
            })
            that.handleReadyToUpload(order)
            that.handleReadyToConfirm(order);
          }
        }
      }
    })
  },

  /**
   * 获取元素下标
   */
  getIndexOf: function (ele, array) {
    for (var i = 0; i < array.length; i++) {
      if (array[i] == ele) return i;
    }
    return -1;
  },


  /**
   * 请求未确认订单列表
   */
  requestUnConfirmOrderList: function () {
    wx.showLoading({
      title: '请稍等...',
    })
    let that = this;
    wx.request({
      url: config.URL_Service + config.URL_GetUnConfirmOrderList,
      data: {

        openId: loginUtil.getOpenId()
      },
      success: function (res) {
        console.log("获取未收货订单 success: \n" + JSON.stringify(res));
        if (res.data.prompt = config.Prompt_Success) {
          if (res.data.root != null) {
            that.data.orderList = that.data.orderList.concat(res.data.root)
            that.setData({
              orderList: that.data.orderList
            })
          }
        }
      },
      fail: function (res) {
        console.log("获取未收货订单 fail: \n" + JSON.stringify(res));
        wx.showToast({
          title: '网络原因，获取订单失败',
          icon: 'none'
        })
      },
      complete: function (res) {
        console.log("获取未收货订单 complete: \n" + JSON.stringify(res));
        wx.hideLoading();
      },
    })
  },

  /**
   * 点击图片
   */
  tapImage: function (e) {
    let tempOrder = this.data.orderList[e.currentTarget.dataset.orderindex];
    let tempImageList = [];
    if (tempOrder.images != null && tempOrder.images.length > 0) {
      tempImageList = tempImageList.concat(tempOrder.images);
    }
    if (tempOrder.uploadImages != null && tempOrder.uploadImages.length > 0) {
      tempImageList = tempImageList.concat(tempOrder.uploadImages);
    }
    let currrentUrl = e.currentTarget.dataset.imageurl;
    wx.previewImage({
      urls: tempImageList,
      current: currrentUrl
    })
  },

  /**
   * 确认收货
   */
  tapReceive: function (e) {
    let that = this;
    loginUtil.checkLogin(function alreadyLoginCallback(state) {
      if (state) {
        that.requestRecieve(e.currentTarget.dataset.orderno, e.currentTarget.dataset.tapindex);
      } else {
        wx.showModal({
          title: '暂未登录',
          content: '请先登录后使用该功能',
          success(res) {
            if (res.confirm) {
              wx.navigateTo({
                url: '/pages/login/login',
              })
            }
          }
        })
      }
    })
  },

  /**
     * 收货请求
     */
  requestRecieve: function (orderNo, orderIndex) {
    let tempOrder = this.data.orderList[orderIndex];
    let fileList = [];
    if (!util.checkEmpty(tempOrder.images)) {
      fileList = fileList.concat(tempOrder.images);
    }
    if (!util.checkEmpty(tempOrder.videos)) {
      fileList = fileList.concat(tempOrder.videos);
    }
    let that = this;
    wx.showLoading({
      title: '请稍等...',
    })
    wx.request({
      url: config.URL_Service + config.URL_ConfirmOrder,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: "POST", // 请求方式
      data: {
        fileList: fileList,
        orderNo: orderNo,
        openId: loginUtil.getOpenId()
      },
      success(res) {
        console.log("确认收货 success: \n" + JSON.stringify(res));
        if (res.data.prompt == config.Prompt_Success) {
          wx.showToast({
            title: '收货成功',
          })
          that.data.orderList.splice(orderIndex, 1);
          that.setData({
            orderList: that.data.orderList
          })
        }
      },
      fail(res) {
        console.log("确认收货 fail: \n" + JSON.stringify(res));
      },
      complete(res) {
        console.log("确认收货 complete: \n" + JSON.stringify(res));
        wx.hideLoading();
      },

    })
  },

  /**
   * 点击准备上传
   */
  tapUpload: function (e) {
    let tempOrder = this.data.orderList[e.currentTarget.dataset.tapindex];
    let tempImageCount = maxImageCount;
    if (tempOrder.images != null) {
      tempImageCount = tempImageCount - tempOrder.images.length;
    }
    if (tempOrder.uploadImages != null) {
      tempImageCount = tempImageCount - tempOrder.uploadImages.length;
    }
    let that = this;
    wx.showActionSheet({
      itemList: ["上传照片", "上传视频"],
      success(res) {
        console.log(res.tapIndex)
        if (res.tapIndex == 0) {
          if (tempOrder.image != null && tempOrder.images.length >= maxImageCount) {
            wx.showToast({
              title: '已经上传全部' + maxImageCount + '张图片',
              icon: 'none'
            })
            return;
          }
          if (tempImageCount <= 0) {
            wx.showToast({
              title: '可上传图片达到最大数量，请先取消部分图片',
              icon: "none",
            })
            return;
          }
          wx.chooseImage({
            sourceType: ['camera'],
            count: tempImageCount,
            success: function (res) {
              if (tempOrder.uploadImages == null) {
                tempOrder.uploadImages = [];
              }
              if (res.tempFilePaths != null && res.tempFilePaths.length > 0) {
                tempOrder.uploadImages = tempOrder.uploadImages.concat(res.tempFilePaths);
                that.handleReadyToUpload(tempOrder);
                that.handleReadyToConfirm(tempOrder);
              }
            },
          })
        } else {
          if (!util.checkEmpty(tempOrder.videos)) {
            wx.showToast({
              title: '已经上传视频，请勿重复上传！',
              icon: 'none'
            })
            return;
          }
          wx.chooseVideo({
            sourceType: ['camera'],
            maxDuration: maxVideoLength,
            success(res) {
              if (tempOrder.uploadVideos == null) {
                tempOrder.uploadVideos = [];
              }
              if (!util.checkEmpty(res.tempFilePath)) {
                tempOrder.uploadVideos.push(res.tempFilePath)
                that.handleReadyToUpload(tempOrder);
                that.handleReadyToConfirm(tempOrder);
              }
            }
          })
        }
      },
    })
  },
})