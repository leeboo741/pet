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
    orderList:[
      {
        express: "江西舒宠快运", // 快递
        orderDate: "2019-06-01 11:12:32", // 下单时间
        orderNo: "1905061231112311", // 单号
        amount: 100000, // 金额
        startCity: '南昌', // 始发城市
        endCity: "北京", // 收货城市
        petBreed: "哈士奇", // 宠物品种
        petType: "狗", // 宠物类型
        transportType: "空运单飞", // 运输类型
        state: "待支付", // 状态
        count: 1, // 数量
        weight: 10, // 重量
        airbox: null, // 是否购买航空箱
        receivePetAddress: "江西省南昌市青山湖区北京东路1444号新城国际花都2栋1单元1202室", // 上门接宠地址
        sendPetAddress: null, // 送宠到家地址
        insuredPrice: 0, // 保价金额
        petCan: null, // 是否领取免费罐头
        sendCustomerName: '李三', // 寄件人名称
        receiveCustomerName: '张思', // 收件人名称
        sendCustomerPhone: '16678542215', // 寄件人电话
        receiveCustomerPhone: '18542214571', // 收件人电话
        remark: "", // 订单备注
      },
      {
        express: "江西舒宠快运", // 快递
        orderDate: "2019-06-01 11:12:32", // 下单时间
        orderNo: "1905061231112311", // 单号
        amount: 100000, // 金额
        startCity: '南昌', // 始发城市
        endCity: "北京", // 收货城市
        petBreed: "哈士奇", // 宠物品种
        petType: "狗", // 宠物类型
        transportType: "空运单飞", // 运输类型
        state: "待支付", // 状态
        count: 1, // 数量
        weight: 10, // 重量
        airbox: null, // 是否购买航空箱
        receivePetAddress: "江西省南昌市青山湖区北京东路1444号新城国际花都2栋1单元1202室", // 上门接宠地址
        sendPetAddress: null, // 送宠到家地址
        insuredPrice: 0, // 保价金额
        petCan: null, // 是否领取免费罐头
        sendCustomerName: '李三', // 寄件人名称
        receiveCustomerName: '张思', // 收件人名称
        sendCustomerPhone: '16678542215', // 寄件人电话
        receiveCustomerPhone: '18542214571', // 收件人电话
        remark: "", // 订单备注
        images: [
          "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1564985161453&di=6e36fd20ecd7cc47ca483684829669d4&imgtype=0&src=http%3A%2F%2Fpic51.nipic.com%2Ffile%2F20141025%2F8649940_220505558734_2.jpg",
          "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1564985161453&di=4439ed00d168eeb2b2695235fa6f6aa7&imgtype=0&src=http%3A%2F%2Fpic26.nipic.com%2F20130121%2F9252150_101440518391_2.jpg",
          "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1564985161453&di=6e36fd20ecd7cc47ca483684829669d4&imgtype=0&src=http%3A%2F%2Fpic51.nipic.com%2Ffile%2F20141025%2F8649940_220505558734_2.jpg",
          "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1564985161453&di=4439ed00d168eeb2b2695235fa6f6aa7&imgtype=0&src=http%3A%2F%2Fpic26.nipic.com%2F20130121%2F9252150_101440518391_2.jpg",
        ],
        video: "http://wxsnsdy.tc.qq.com/105/20210/snsdyvideodownload?filekey=30280201010421301f0201690402534804102ca905ce620b1241b726bc41dcff44e00204012882540400&bizid=1023&hy=SH&fileparam=302c020101042530230204136ffd93020457e3c4ff02024ef202031e8d7f02030f42400204045a320a0201000400",
      },
    ], // 订单列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
        "orderNo": order.orderNo,
        "sn": 0,
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
        }
      }
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
    console.log("需要上传的文件 => \n图片:\n"+JSON.stringify(tempOrder.uploadImages)+"\n视频：\n"+JSON.stringify(tempOrder.uploadVideo));
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