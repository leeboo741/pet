/**
 * ******** 出港 ********
 * =========================================================================================
 * =========================================================================================
 */

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderList:[
      {
        orderNo: "19231131545321",
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
        orderNo: "19231131545321",
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
   * 点击上传
   */
  tapUpdate: function (e) {
    let tempOrder = this.data.orderList[e.currentTarget.dataset.tapindex];
    let tempImageCount = 6;
    if (tempOrder.uploadImages != null) {
      tempImageCount = tempImageCount - tempOrder.uploadImages.length;
    }
    let that = this;
    wx.showActionSheet({
      itemList: ["上传照片","上传视频"],
      success(res) {
        console.log(res.tapIndex)
        if(res.tapIndex == 0) {
          if (tempImageCount <= 0) {
            wx.showToast({
              title: '上传图片达到最大数量',
              icon: "none",
            })
            return;
          }
          let that2 = that;
          wx.chooseImage({
            count: tempImageCount,
            success: function(res) {
              if (tempOrder.uploadImages == null) {
                tempOrder.uploadImages = [];
              }
              tempOrder.uploadImages = tempOrder.uploadImages.concat(res.tempFilePaths);
              that2.setData({
                orderList: that2.data.orderList
              })
            },
          })
        } else {
          wx.chooseVideo({
            
          })

        }
      },
    })
  },
})