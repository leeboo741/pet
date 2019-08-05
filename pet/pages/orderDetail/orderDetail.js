// pages/orderDetail/orderDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderData:{
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
      stepList:[
        {
          step: "提交订单",
          time: "2019-06-11 11:21:22",
          state: "已完成",
        },
        {
          step: "支付",
          time: "2019-06-12 12:22:11",
          state: "已完成",
        },
        {
          step: "南昌营运部--入港",
          time: "2019-06-13 13:11:11",
          state: "已完成",
          images: [
            "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1564985161453&di=6e36fd20ecd7cc47ca483684829669d4&imgtype=0&src=http%3A%2F%2Fpic51.nipic.com%2Ffile%2F20141025%2F8649940_220505558734_2.jpg",
            "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1564985161453&di=4439ed00d168eeb2b2695235fa6f6aa7&imgtype=0&src=http%3A%2F%2Fpic26.nipic.com%2F20130121%2F9252150_101440518391_2.jpg",
            "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1564985161453&di=6e36fd20ecd7cc47ca483684829669d4&imgtype=0&src=http%3A%2F%2Fpic51.nipic.com%2Ffile%2F20141025%2F8649940_220505558734_2.jpg",
            "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1564985161453&di=4439ed00d168eeb2b2695235fa6f6aa7&imgtype=0&src=http%3A%2F%2Fpic26.nipic.com%2F20130121%2F9252150_101440518391_2.jpg",
          ],
          video: "http://wxsnsdy.tc.qq.com/105/20210/snsdyvideodownload?filekey=30280201010421301f0201690402534804102ca905ce620b1241b726bc41dcff44e00204012882540400&bizid=1023&hy=SH&fileparam=302c020101042530230204136ffd93020457e3c4ff02024ef202031e8d7f02030f42400204045a320a0201000400",
        },
        {
          step:"南昌营运部--出港",
          time: "2019-06-13 17:12:11",
          state: "已完成",
          images: [
            "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1564985161453&di=4439ed00d168eeb2b2695235fa6f6aa7&imgtype=0&src=http%3A%2F%2Fpic26.nipic.com%2F20130121%2F9252150_101440518391_2.jpg",
            "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1564985161453&di=6e36fd20ecd7cc47ca483684829669d4&imgtype=0&src=http%3A%2F%2Fpic51.nipic.com%2Ffile%2F20141025%2F8649940_220505558734_2.jpg",
          ],
          video: "http://wxsnsdy.tc.qq.com/105/20210/snsdyvideodownload?filekey=30280201010421301f0201690402534804102ca905ce620b1241b726bc41dcff44e00204012882540400&bizid=1023&hy=SH&fileparam=302c020101042530230204136ffd93020457e3c4ff02024ef202031e8d7f02030f42400204045a320a0201000400",
        },
        {
          step:"北京运营部--入港",
          time: "2019-06-14 09:12:11",
          state: "进行中",
          images: [
            "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1564985161453&di=6e36fd20ecd7cc47ca483684829669d4&imgtype=0&src=http%3A%2F%2Fpic51.nipic.com%2Ffile%2F20141025%2F8649940_220505558734_2.jpg",
            "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1564985161453&di=4439ed00d168eeb2b2695235fa6f6aa7&imgtype=0&src=http%3A%2F%2Fpic26.nipic.com%2F20130121%2F9252150_101440518391_2.jpg"
          ],
          video: "http://wxsnsdy.tc.qq.com/105/20210/snsdyvideodownload?filekey=30280201010421301f0201690402534804102ca905ce620b1241b726bc41dcff44e00204012882540400&bizid=1023&hy=SH&fileparam=302c020101042530230204136ffd93020457e3c4ff02024ef202031e8d7f02030f42400204045a320a0201000400",
        }
      ],
    },
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

  }
})