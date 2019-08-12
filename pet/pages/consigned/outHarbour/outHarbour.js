/**
 * ******** 出港 ********
 * =========================================================================================
 * =========================================================================================
 */

const app = getApp();
const maxImageCount = 8;
const maxVideoLength = 30;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderList:[], // 订单列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.requestOutHarbour();
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
    if ((order.uploadImages == null || order.uploadImages.length <= 0)
      && (order.uploadVideo == null || order.uploadVideo.length <= 0)) {
      order.readyToUpload = false;
    } else {
      order.readyToUpload = true;
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
    tempOrder.uploadVideo = null;
    this.handleReadyToUpload(tempOrder);
  },

  /**
   * 删除上传图片
   */
  deleteUploadImage: function (e) {
    let tempOrder = this.data.orderList[e.currentTarget.dataset.tapindex];
    tempOrder.uploadImages.splice(e.currentTarget.dataset.imageindex,1);
    this.handleReadyToUpload(tempOrder);
  },

  /**
    * 确定上传
    */
  tapConfirmUpload: function (e) {
    let tempOrder = this.data.orderList[e.currentTarget.dataset.tapindex];
    let uploadList = [];
    let lastIsVideo = false;
    if (tempOrder.uploadImages != null && tempOrder.uploadImages.length > 0) {
      uploadList = uploadList.concat(tempOrder.uploadImages);
    }
    if (tempOrder.uploadVideo != null && tempOrder.uploadVideo.length > 0) {
      uploadList.push(tempOrder.uploadVideo);
      lastIsVideo = true;
    }
    let uploadIndex = 0;
    let uploadLength = uploadList.length;
    console.log("需要上传的文件 => \n图片:\n" + JSON.stringify(tempOrder.uploadImages) + "\n视频：\n" + JSON.stringify(tempOrder.uploadVideo));
    this.requestUploadFile(uploadList, uploadIndex, tempOrder, lastIsVideo);

  },

  /**
   * 上传文件
   * @param fileList 文件列表
   * @param uploadIndex 要上传的文件下标
   * @param order 单据
   * @param lastIsVideo 最后数据是否是视频
   * @param callback 回调函数
   */
  requestUploadFile: function (fileList, uploadIndex, order, lastIsVideo, callback) {
    wx.showLoading({
      title: '上传中...',
    })
    let that = this;
    wx.uploadFile({
      url: app.url.url + app.url.uploadFile,
      filePath: fileList[uploadIndex],
      name: 'multipartFiles',
      header: { "Content-Type": "multipart/form-data" },
      formData: {
        "orderNo": order.orderStates[0].orderNo,
        "sn": order.orderStates[0].sn,
        "orderType": order.orderStates[0].orderType
      },
      success(res) {
        console.log("upload success =>" + JSON.stringify(res));
        const data = res.data;
        if (res.data.prompt != null && res.data.prompt == 'Error') {
          wx.showToast({
            title: "文件上传失败",
            icon: 'none'
          })
          typeof callback == "function" && callback("fail");
        } else {
          typeof callback == "function" && callback("success");
          if (lastIsVideo && (uploadIndex == (fileList.length - 1))) {
            order.video = fileList[uploadIndex];
            order.uploadVideo = null;
          } else {
            if (order.images == null) {
              order.images = [];
            }
            let tempFile = fileList[uploadIndex];
            let tempIndex = that.getIndexOf(tempFile, order.uploadImages);
            order.images.push(fileList[uploadIndex]);
            order.uploadImages.splice(tempIndex, 1);
          }
          that.setData({
            orderList: that.data.orderList
          })
        }
      },
      fail(res) {
        wx.showToast({
          title: "一个文件上传失败",
          icon: 'none'
        })
        typeof callback == "function" && callback("fail");
      },
      complete(res) {
        uploadIndex++;
        if (uploadIndex < fileList.length) {
          that.requestUploadFile(fileList, uploadIndex, order, lastIsVideo)
        } else {
          wx.hideLoading();
          wx.showToast({
            title: '上传完成',
          })
          that.handleReadyToUpload(order)
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
   * 请求出港单
   */
  requestOutHarbour: function (searchKey) {
    wx.showLoading({
      title: '请稍等...',
    })
    let that = this;
    wx.request({
      url: app.url.url + app.url.outHarbour,
      data: {
        openId: app.globalData.userInfo.openid
      },
      success(res) {
        console.log("请求出港单 success：\n" + JSON.stringify(res));
        that.setData({
          orderList: res.data.data
        })
      },
      fail(res) {
        console.log("请求出港单 fail：\n" + JSON.stringify(res));
      },
      complete(res) {
        console.log("请求出港单 complete：\n" + JSON.stringify(res));
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
   * 取消上传
   */
  tapCancelUpload: function (e) {
    let tempOrder = this.data.orderList[e.currentTarget.dataset.tapindex];
    tempOrder.uploadImages = null;
    tempOrder.uploadVideo = null;
    this.handleReadyToUpload(tempOrder);
  },

  /**
   * 确定上传
   */
  tapConfirmUpload: function (e) {
    let tempOrder = this.data.orderList[e.currentTarget.dataset.tapindex];
    let uploadList = [];
    let lastIsVideo = false;
    if (tempOrder.uploadImages != null && tempOrder.uploadImages.length > 0) {
      uploadList = uploadList.concat(tempOrder.uploadImages);
    }
    if (tempOrder.uploadVideo != null && tempOrder.uploadVideo.length > 0) {
      uploadList.push(tempOrder.uploadVideo);
      lastIsVideo = true;
    }
    let uploadIndex = 0;
    let uploadLength = uploadList.length;
    console.log("需要上传的文件 => \n图片:\n" + JSON.stringify(tempOrder.uploadImages) + "\n视频：\n" + JSON.stringify(tempOrder.uploadVideo));
    this.requestUploadFile(uploadList, uploadIndex, tempOrder, lastIsVideo);
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
      itemList: ["上传照片","上传视频"],
      success(res) {
        console.log(res.tapIndex)
        if(res.tapIndex == 0) {
          if (tempOrder.image != null && tempOrder.images.length >= maxImageCount) {
            wx.showToast({
              title: '已经上传全部'+maxImageCount+'张图片',
              icon:'none'
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
            count: tempImageCount,
            success: function(res) {
              if (tempOrder.uploadImages == null) {
                tempOrder.uploadImages = [];
              }
              if (res.tempFilePaths != null && res.tempFilePaths.length > 0) {
                tempOrder.uploadImages = tempOrder.uploadImages.concat(res.tempFilePaths);
                that.handleReadyToUpload(tempOrder);
              }
            },
          })
        } else {
          if (tempOrder.video != null && tempOrder.video.length > 0) {
            wx.showToast({
              title: '已经上传视频，请勿重复上传！',
              icon:'none'
            })
            return;
          }
          wx.chooseVideo({
            maxDuration: maxVideoLength,
            success(res) {
              if (res.tempFilePath != null && res.tempFilePath.length > 0) {
                tempOrder.uploadVideo = res.tempFilePath;
                that.handleReadyToUpload(tempOrder);
              }
            }
          })
        }
      },
    })
  },
})