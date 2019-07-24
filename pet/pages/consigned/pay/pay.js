/**
 * ******** 邮寄信息页面 ********
 * ===================================================================================================================================
 * 在这个页面完成 输入寄宠人信息，收宠人信息
 * 预订之后直接付款
 * ===================================================================================================================================
 */

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    predictPrice: 0, // 预估金额
    confirmCondition: false, // 确认条件
    confirmClause: false, // 确认条款

    sendName: '', // 寄件人名称
    receiveName: '', // 收件人名称
    sendPhone: '', // 寄件人电话
    receivePhone: '', // 收件人电话

    startCity: null, // 始发城市
    endCity: null, // 目的城市
    leaveDate: null, // 发货日期
    transport: null, // 运输方式
    petWeight: 0, // 重量
    petCount: 0, // 数量
    petType: null, // 宠物类型
    petClassify: null, // 宠物种类

    airbox: null, // 购买航空箱
    receiveAddress: null, // 接宠地址
    sendAddress: null, // 送宠地址
    insuredPrice: null, // 保价金额
    petCan: null, // 免费营养罐头

    orderNo: null, // 订单编号
  },

  /* ============================= 页面生命周期 Start ============================== */

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      startCity: options.start,
      endCity: options.end,
      petCount: parseInt(options.count),
      petType: options.type,
      petClassify: options.classify,
      petWeight: parseFloat(options.weight),
      transport: options.transport,
      leaveDate: options.leavedate,
    })
    if (options.petcan != null) {
      this.setData({
        petCan: options.petcan
      })
    }
    if (options.airbox != null) {
      this.setData({
        airbox: options.airbox
      })
    }
    if (options.receiveaddress != null) {
      this.setData({
        receiveAddress: options.receiveaddress
      })
    }
    if (options.sendaddress != null) {
      this.setData({
        sendAddress: options.sendaddress
      })
    }
    if (options.insuredprice != null) {
      this.setData({
        insuredPrice: parseFloat(options.insuredprice)
      })
    }
    this.predictPrice();
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
    console.log("/pay/pay 销毁")
  },

  /* ============================= 页面生命周期 End ============================== */

  /* ============================= 页面事件 Start ============================== */

  /**
   * 寄宠人姓名
   */
  inputSendName: function (e) {
    this.setData({
      sendName: e.detail.value,
    })
  },

  /**
   * 寄宠人电话
   */
  phoneNumberInput: function (e) {
    this.setData({
      sendPhone: e.detail.value,
    })
  },

  /**
   * 收宠人姓名
   */
  inputReceiveName: function (e) {
    this.setData({
      receiveName: e.detail.value,
    })
  },

  /**
   * 收宠人电话
   */
  inputReceivePhone: function (e) {
    this.setData({
      receivePhone: e.detail.value,
    })
  },

  /**
   * 下单
   */
  order: function () {
    if (this.data.sendName == null || this.data.sendName.length <= 0) {
      wx.showToast({
        title: '请输入寄宠人名称',
        icon: 'none'
      })
      return;
    }

    if (this.data.receiveName == null || this.data.receiveName.length <= 0) {
      wx.showToast({
        title: '请输入收宠人名称',
        icon: 'none'
      })
      return;
    }

    if (this.data.sendPhone == null || this.data.sendPhone.length <=0 || !this.isPoneAvailable(this.data.sendPhone)) {
      wx.showToast({
        title: '请输入正确的寄宠人手机号',
        icon: 'none'
      })
      return;
    }

    if (this.data.receivePhone == null || this.data.receivePhone.length <= 0 || !this.isPoneAvailable(this.data.receivePhone)) {
      wx.showToast({
        title: '请输入正确的收宠人手机号',
        icon: 'none'
      })
      return;
    }

    if (!this.data.confirmCondition) {
      wx.showToast({
        title: '请确认宠物是否符合条件！',
        icon: 'none'
      })
      return;
    }

    if (!this.data.confirmClause) {
      wx.showToast({
        title: '请查看并同意交易条款后下单！',
        icon: 'none'
      })
      return;
    }

    this.requestOrder();
  },

  /**
   * 确认条件
   */
  tapCondition: function () {
    this.setData({
      confirmCondition: !this.data.confirmCondition
    })
  },

  /**
   * 确认条款
   */
  tapClause: function() {
    this.setData({
      confirmClause: !this.data.confirmClause
    })
  },

  /**
   * 查看条款
   */
  checkClauseDetail: function () {

  },

  /**
   * 拨打电话
   */
  tapServicePhoneAction: function () {
    wx.makePhoneCall({
      phoneNumber: app.globalData.servicePhone,
    })
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

  /* ============================= 页面事件 End ============================== */

  /* ============================= 网络请求 Start ============================== */

  /**
   * 下单
   */
  requestOrder: function () {
    wx.showLoading({
      title: '提交订单中...',
    })
    let tempOrderObj = {
      "openId": app.globalData.userInfo.openid,

      "startCity": this.data.startCity,
      "endCity": this.data.endCity,
      "leaveDate": this.data.leaveDate,
      "transportType": this.data.transport,
      "weight": this.data.petWeight,
      "num": this.data.petCount,
      "petClassify": this.data.petClassify,
      "petType": this.data.petType,

      "receiverName": this.data.receiveName,
      "receiverPhone": this.data.receivePhone,
      "senderName": this.data.sendName,
      "senderPhone": this.data.sendPhone,
    }

    if (this.data.airbox != null) {
      tempOrderObj.buyAirBox = this.data.airbox;
    }

    if (this.data.receiveAddress != null) {
      tempOrderObj.onDoorReceiveAddress = this.data.receiveAddress;
    }

    if (this.data.sendAddress != null) {
      tempOrderObj.onDoorSendAddress = this.data.sendAddress;
    } 

    if (this.data.insuredPrice != null) {
      tempOrderObj.insureAmount = this.data.insuredPrice;
    }

    let that = this;
    wx.request({
      url: app.url.url + app.url.order,
      method: "POST",
      data: tempOrderObj,
      success(res) {
        console.log("提交订单 success => \n" + JSON.stringify(res));
        if (res.data.prompt == app.requestPromptValueName.success) {
          that.setData({
            orderNo: res.data.root
          })
          wx.showModal({
            title: '订单:' + res.data.root + '提交成功',
            content: '是否立即支付',
            cancelText: '稍后支付',
            confirmText: '立即付款',
            success(res) {
              if (res.confirm) {
                console.log('用户点击立即付款')
              } else if (res.cancel) {
                console.log('用户点击稍后支付')
                wx.switchTab({
                  url: '/pages/index/index',
                })
              }
            }
          })
        } else {
          if (res.data.root != null) {
            wx.showToast({
              title: res.data.root,
              icon: 'none'
            })
          } else {
            wx.showToast({
              title: "提交订单失败，请稍后再试",
              icon: 'none'
            })
          }
        }
      },
      fail(res) {
        console.log("提交订单 fail => \n" + JSON.stringify(res));
        wx.showToast({
          title: '提交订单失败，请稍后再试',
          icon: 'none'
        })
      },
      complete(res) {
        console.log("提交订单 complete => \n" + JSON.stringify(res));
        wx.hideLoading();
      },
    })
  },

  /**
   * 查询预估金额
   */
  requestPredictPrice: function () {
    wx.showLoading({
      title: '请稍等...',
    })
    let tempData = {
      "openId": app.globalData.userInfo.openid,
      "startCity": this.data.startCity,
      "endCity": this.data.endCity,
      "transportType": this.data.transport,
      "weight": this.data.petWeight,
      "num": this.data.petCount,
    };

    if (this.data.sendAddress != null) {
      tempData.sendAddress = this.data.sendAddress;
    }

    if (this.data.receiveAddress != null) {
      tempData.receiptAddress = this.data.receiveAddress;
    }

    if (this.data.airbox != null) {
      tempData.buyAirBox = this.data.airbox
    }

    if (this.data.insuredPrice != null) {
      tempData.insureAmount = this.data.insuredPrice;
    }

    let that = this;
    wx.request({
      url: app.url.url + app.url.predictPrice,
      data: tempData,
      success(res) {
        console.log("获取预估价格 success => \n" + JSON.stringify(res));
        if (res.data.prompt == app.requestPromptValueName.success) {
          that.setData({
            predictPrice: res.data.root
          })
        } else {
          wx.showToast({
            title: res.data.root,
            icon: 'none'
          })
        }
      },
      fail(res) {
        console.log("获取预估价格 fail => \n" + JSON.stringify(res));
        wx.showToast({
          title: '获取预估价格失败',
          icon: 'none'
        })
      },
      complete(res) {
        wx.hideLoading();
      },
    })
  },
  /* ============================= 网络请求 End ============================== */

  /* ============================= 数据处理 Start ============================== */

  /**
     * 判断手机号
     */
  isPoneAvailable: function (poneInput) {
    var myreg = /^[1][3,4,5,6,7,8][0-9]{9}$/;
    if (!myreg.test(poneInput)) {
      return false;
    } else {
      return true;
    }
  },

  /**
   * 计算预估金额
   */
  predictPrice: function () {
    if (this.data.startCity== null) {
      return;
    }
    if (this.data.endCity == null) {
      return;
    }
    if (this.data.petCount == 0) {
      return;
    }
    if (this.data.petWeight == 0) {
      return;
    }
    if (this.data.transport == null) {
      return;
    }
    this.requestPredictPrice();
  },

  /* ============================= 数据处理 End ============================== */

})