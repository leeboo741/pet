/**
 * ******** 托运页面 ********
 * ===============================================================================
 * 购买托运服务
 * ===============================================================================
 */
//获取应用实例
const app = getApp()
var util = require("../../../utils/util.js");
const config = require("../../../utils/config.js");
const loginUtil = require("../../../utils/loginUtils.js");

Page({
  data: {
    bannerData: [
      { 
        imgPath: 'http://47.99.244.168:6060/static/images/pet1.png'
      },
      { 
        imgPath: 'http://47.99.244.168:6060/static/images/pet2.png'
      },
      {
        imgPath: 'http://47.99.244.168:6060/static/images/pet3.png'
      },
    ], // banner 数据
    storePhone:null, // 商家电话
    rate: 0, // 保价费率
    totalPrice: 0, // 总计金额
    beginCity: null, // 始发城市 
    endCity: null, // 目的城市
    date: null, // 发货日期
    startDate: null, // 选择开始日期
    endDate: null, // 选择结束日期
    week: null, // 发货星期
    petCount: 0, // 发货数量
    petWeight: 0, // 宠物重量
    petMaxWeight: null, // 宠物最大重量限制
    petType: null, // 选中宠物类别
    petClassify: null, // 选中宠物类型
    petTypes: [], // 宠物类别列表
    petClassifys: [], // 宠物类型列表
    transportTypes: [
      {
        transportName: "专车", // 运输方式名称
        transportId: 1, // 运输方式id
        // transportDescription: "主人陪同坐专车", // 运输方式说明
        disable: true, // 是否禁用
      },
      {
        transportName: "铁路", // 运输方式名称
        transportId: 2, // 运输方式id
        // transportDescription: "主人陪同坐火车", // 运输方式说明
        disable: true, // 是否禁用
      },
      {
        transportName: "单飞", // 运输方式名称
        transportId: 3, // 运输方式id
        // transportDescription: "主人陪同坐飞机", // 运输方式说明
        disable: true, // 是否禁用
      },
      {
        transportName: "随机", // 运输方式名称
        transportId: 4, // 运输方式id
        // transportDescription: "主人跟随一起乘坐飞机", // 运输方式说明
        disable: true, // 是否禁用
      },
      {
        transportName: "大巴", // 运输方式名称
        transportId: 5, // 运输方式id
        // transportDescription: "主人陪同坐大巴", // 运输方式说明
        disable: true, // 是否禁用
      },
    ], // 运输方式
    selectedTransportObj: null, // 选中运输方式Index
    addServerAirBox: {
      name: "购买宠物箱", // 增值服务名称
      selected: false, // 是否选中
      alert: "自备宠物箱需符合运输公司要求的适用规则", // 提示
      ableUse: false, // 是否可用
    },
    addServerReceivePet: {
      name: "上门接宠",
      selected: false, // 是否选中
      receiveDistrictList: null, // 上门接宠区县列表
      receiveDistrict: null, // 上门接宠区县
      address: null, // 地址
    },
    addServerSendPet: {
      name: "送宠到家",
      selected: false,
      sendDistrictList: null, // 送宠到家区县列表
      sendDistrict: null, // 送宠到家区县
      address: null, // 地址
      haveAbleStation: false, // 是否有可用站点
    },
    addServerInsuredPrice: {
      name: "保价",
      selected: false,
      rate: 0, // 费率
      price: 0, // 保价金额
    },
    addServerPetCan: {
      name: "免费营养罐头", // 名称
      selected: false, // 是否选中
      alert: "免费提供给宠物在运输途中食用，非强制选用，本公司不承担由此造成的任何后果，选择即视为自愿接受此声明的约束"
    }
  },

  /* ============================= 页面生命周期 Start ============================== */

  /**
  * 生命周期函数--监听页面加载
  */
  onLoad: function () {
    // 初始化 发货日期 数据
    let tempDateObj = util.dateLater(new Date(),0);
    let endDateObj = util.dateLater(new Date(), 365);
    this.setData({
      date: tempDateObj.time,
      week: tempDateObj.week,
      startDate: tempDateObj.time,
      endDate: endDateObj.time,
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
    // 接受 城市选择页面 返回数据
    if (app.globalData.trainBeginCity != null) {
      // 重置运输方式
      for (let i = 0; i < this.data.transportTypes.length; i++){
        this.data.transportTypes[i].disable = true;
      }
      // 重置 上门接宠 市区选择器
      this.data.addServerReceivePet.receiveDistrictList = DISTRICT[app.globalData.trainBeginCity];
      this.data.addServerReceivePet.receiveDistrict = this.data.addServerReceivePet.receiveDistrictList[0];
      // 重置 送宠到家 市区选择器
      this.data.addServerSendPet.sendDistrictList = null;
      this.data.addServerSendPet.sendDistrict = null;
      // 重置 送宠到家 地址 并且关闭 送宠到家
      this.data.addServerSendPet.address = null;
      this.data.addServerSendPet.selected = false;
      
      this.setData({
        beginCity: app.globalData.trainBeginCity, // 设置始发城市
        addServerReceivePet: this.data.addServerReceivePet, // 设置 上门接宠
        endCity: null, // 清空目的城市
        addServerSendPet: this.data.addServerSendPet, // 重置 送宠到家
        selectedTransportObj: null, // 清空 选中的 运输方式
        petMaxWeight: null,
        transportTypes: this.data.transportTypes, // 重置 运输方式列表 
      })
      // 查询保价费率
      this.requestStroePhoneByCityName(app.globalData.trainBeginCity);
      this.requestInsurePriceRate(app.globalData.trainBeginCity);
      app.globalData.trainBeginCity = null;
    }
    if (app.globalData.trainEndCity != null) {
      // 重置 送宠到家 市区选择器
      this.data.addServerSendPet.sendDistrictList = DISTRICT[app.globalData.trainEndCity];
      this.data.addServerSendPet.sendDistrict = this.data.addServerSendPet.sendDistrictList[0];
      this.setData({
        addServerSendPet: this.data.addServerSendPet, // 重置 送宠到家
        endCity: app.globalData.trainEndCity, // 设置 目的城市
        selectedTransportObj: null, // 清空 选中的 运输方式
        petMaxWeight: null,
      })
      // 查询可用的运输方式列表
      this.checkAbleTransportType();
      // 查询是否有可用站点
      this.checkAbleStation(app.globalData.trainEndCity);
      app.globalData.trainEndCity = null;
    }
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
    app.globalData.trainBeginCity = null;
    app.globalData.trainEndCity = null;
    console.log("/base/base 销毁")
  },

  /* ============================= 页面生命周期 End ============================== */

  /* ============================= 页面事件 Start ============================== */

  /**
   * 上门接宠区域选择
   */
  bindReceivePickerChange: function (e) {
    this.data.addServerReceivePet.receiveDistrict = this.data.addServerReceivePet.receiveDistrictList[e.detail.value];
    this.setData({
      addServerReceivePet: this.data.addServerReceivePet
    })
  },

  /**
   * 送宠到家区域选择
   */
  bindSendPickerChange: function (e) {
    this.data.addServerSendPet.sendDistrict = this.data.addServerSendPet.sendDistrictList[e.detail.value];
    this.setData({
      addServerSendPet: this.data.addServerSendPet
    }) 
  },

  /**
   * 点击领取免费罐头
   */
  tapAddServerPetCan: function () {
    this.data.addServerPetCan.selected = !this.data.addServerPetCan.selected;
    this.setData({
      addServerPetCan: this.data.addServerPetCan
    })
  },

  /**
   * 点击购买航空箱
   */
  tapAddServerAirBox: function () {
    this.data.addServerAirBox.selected = !this.data.addServerAirBox.selected;
    this.setData({
      addServerAirBox: this.data.addServerAirBox
    })
    this.predictPrice();
  },

  /**
   * 点击选择上门接宠
   */
  tapAddServerReceivePet: function () {
    if (this.data.beginCity == null) {
      wx.showToast({
        title: '请先选择始发城市',
        icon: 'none'
      })
      return;
    }
    this.data.addServerReceivePet.selected = !this.data.addServerReceivePet.selected;
    if (!this.data.addServerReceivePet.selected) { 
      // 取消选中 置空 接宠地址 并且重新请求 价格数据
      this.data.addServerReceivePet.address = null;
      this.predictPrice();
    }
    this.setData({
      addServerReceivePet: this.data.addServerReceivePet
    })
  },

  /**
   * 送宠到家
   */
  tapAddServerSendPet: function () {
    if (this.data.endCity == null) {
      wx.showToast({
        title: '请先选择目的城市',
        icon: 'none'
      })
      return;
    }
    this.data.addServerSendPet.selected = !this.data.addServerSendPet.selected;
    if (!this.data.addServerSendPet.selected) {
      // 取消选中 置空 送宠地址 并且重新请求 价格数据
      this.data.addServerSendPet.address = null;
      this.predictPrice();
    }
    this.setData({
      addServerSendPet: this.data.addServerSendPet
    })
  },

  /**
   * 保价
   */
  tapAddServerInsuredPrice: function () {
    if (this.data.beginCity == null) {
      wx.showToast({
        title: '请先选择始发城市',
        icon: 'none'
      })
      return;
    }
    this.data.addServerInsuredPrice.selected = !this.data.addServerInsuredPrice.selected;
    if (!this.data.addServerInsuredPrice.selected) {
      // 取消选中 归零保价金额 并且重新请求 价格数据
      this.data.addServerInsuredPrice.price = 0;
      this.predictPrice();
    }
    this.setData({
      addServerInsuredPrice: this.data.addServerInsuredPrice
    })
  },

  /**
   * 点击运输方式
   */
  tapTransportTypeAction: function(e){
    let tempObj = this.data.transportTypes[e.currentTarget.dataset.index];
    if (tempObj.disable) {
      wx.showToast({
        title: '当前始发和目的城市不支持该运输方式！',
        icon: 'none'
      })
      return;
    }
    if (this.data.beginCity == null || this.data.endCity == null) {
      wx.showToast({
        title: '请先选择始发城市和目的城市',
        icon: 'none'
      })
    } else {
      this.setData({
        selectedTransportObj: tempObj
      })
      this.predictPrice();
      this.checkPetCage();
    }
  },

  /**
   * 日期选择
   */
  bindTimeChange: function(e) {
    let tempDate = e.detail.value;
    tempDate = new Date(tempDate);
    tempDate = util.dateLater(tempDate,0);
    this.setData({
      date: tempDate.time,
      week: tempDate.week,
    })
  },

  /**
   * 点击选择始发城市
   */
  bindBeginCityView: function () {
    wx.navigateTo({
      url: '../city/city?cityType=begin',
    })
  },

  /**
   * 点击选择目的城市
   */
  bindEndCityView: function () {
    if (this.data.beginCity == null) {
      wx.showToast({
        title: '请先选择始发城市',
        icon: 'none'
      })
    } else {
      wx.navigateTo({
        url: '../city/city?cityType=end&start=' + this.data.beginCity,
      })
    }

  },

  /**
   * 点击获取宠物类型
   */
  bindpetTypeView: function () {
    let that = this;
    if (this.data.petTypes == null || this.data.petTypes.length <= 0) {
      this.requestPetType();
    } else {
      wx.showActionSheet({
        itemList: that.data.petTypes,
        success: function (res) {
          that.setData({
            petType: that.data.petTypes[res.tapIndex],
            petClassify: null
          })
          that.predictPrice();
        },
        fail: function (res) {
          console.log(res.errMsg)
        }
      });
    }
  },

  /**
   * 点击获取宠物种类
   */
  bindpetClassifyView: function () {
    if (this.data.petType == null) {
      wx.showToast({
        title: '请先选择宠物类型',
        icon: 'none'
      })
    } else {
      this.requestPetClassify(this.data.petType);
    }
  },

  /**
   * 输入数量
   */
  countInput: function (e) {
    let tempInput = e.detail.value;
    if (tempInput == null || tempInput.length <= 0) {
      tempInput = 0;
    }
    tempInput = parseInt(tempInput);
    this.setData({
      petCount: tempInput
    })
  },

  /**
   * 数量失去焦点
   */
  countOutFocus: function () {
    this.predictPrice();
  },

  /**
   * 输入重量
   */
  weightInput: function (e) {
    let tempInput = e.detail.value;
    if (tempInput == null || tempInput.length <= 0) {
      tempInput = 0;
    }
    tempInput = parseInt(tempInput);
    this.setData({
      petWeight: tempInput
    })

    this.checkPetWeight();
  },

  /**
   * 重量失去焦点
   */
  weightOutFocus: function () {
    this.predictPrice();
  },

  /**
   * 接宠地址输入
   */
  inputReceivePetAddress:function (e) {
    this.data.addServerReceivePet.address = e.detail.value;
    this.setData({
      addServerReceivePet: this.data.addServerReceivePet
    })
  },

  /**
   * 接宠地址失去焦点
   */
  receivePetAddressOutFocus: function () {
    this.predictPrice();
  },

  /**
   * 送宠地址输入
   */
  inputSendPetAddress: function (e) {
    this.data.addServerSendPet.address = e.detail.value;
    this.setData({
      addServerSendPet: this.data.addServerSendPet
    })
  },

  /**
   * 送宠地址失去焦点
   */
  sendPetAddressOutFocus: function () {
    this.predictPrice();
  },

  /**
   * 保价金额输入
   */
  inputInsuredPrice: function (e) {
    let tempInput = e.detail.value;
    if (tempInput == null) {
      tempInput = 0;
    }
    tempInput = parseInt(tempInput);
    this.data.addServerInsuredPrice.price = tempInput
    this.setData({
      addServerInsuredPrice: this.data.addServerInsuredPrice
    })
  },

  /**
   * 保价金额失去焦点
   */
  insuredPriceOutFocus: function () {
    this.predictPrice();
  },

  /**
   * 点击拨打客服电话
   */
  tapServicePhoneAction: function(){
    if (this.data.beginCity == null) {
      wx.showToast({
        title: '请先选择始发城市',
        icon:'none'
      })
      return;
    }
    if (this.data.storePhone == null) {
      wx.showToast({
        title: '尚未找到对应商家客服电话，请稍后',
        icon: 'none'
      })
      return;
    }
    wx.makePhoneCall({
      phoneNumber: this.data.storePhone,
    })
  },

  /**
   * 点击预定
   */
  tapTakeOrderAction: function(){
    if (this.data.beginCity == null) {
      wx.showToast({
        title: '请选择始发城市',
        icon: 'none'
      })
      return;
    }
    if (this.data.endCity == null) {
      wx.showToast({
        title: '请选择目的城市',
        icon: 'none'
      })
      return;
    }
    if (this.data.petCount == 0) {
      wx.showToast({
        title: '请填写宠物数量',
        icon: 'none'
      })
      return;
    }
    if (this.data.petWeight == 0) {
      wx.showToast({
        title: '请填写宠物重量',
        icon: 'none'
      })
      return;
    }
    if (this.data.petType == null) {
      wx.showToast({
        title: '请选择宠物类别',
        icon: 'none'
      })
      return;
    }
    if (this.data.petClassify == null) {
      wx.showToast({
        title: '请选择宠物品种',
        icon: 'none'
      })
      return;
    }
    if (this.data.selectedTransportObj == null) {
      wx.showToast({
        title: '请选择运输方式',
        icon: 'none'
      })
      return;
    }
    if (this.data.addServerReceivePet.selected) {
      if (this.data.addServerReceivePet.address == null
        || this.data.addServerReceivePet.address.length <= 0) {
        wx.showToast({
          title: '请输入接宠地址',
          icon: 'none'
        })
        return;
      }
    }
    if (this.data.addServerSendPet.selected) {
      if (this.data.addServerSendPet.address == null
        || this.data.addServerSendPet.address.length <= 0) {
        wx.showToast({
          title: '请输入送宠地址',
          icon: 'none'
        })
        return;
      }
    }
    if (this.data.addServerInsuredPrice.selected) {
      if (this.data.addServerInsuredPrice.price == 0) {
        wx.showToast({
          title: '请输入保价金额',
          icon: 'none'
        })
        return;
      }
    }
    let tempUrl = '../pay/pay?start=' + this.data.beginCity
                  + '&end=' + this.data.endCity
                  + '&count=' + this.data.petCount
                  + '&type=' + this.data.petType
                  + '&classify=' + this.data.petClassify.petClassifyName
                  + '&weight=' + this.data.petWeight
                  + '&transport=' + this.data.selectedTransportObj.transportId
                  + '&leavedate=' + this.data.date;
    if (this.data.addServerPetCan.selected) {
      tempUrl = tempUrl + "&petcan=1";
    }
    if (this.data.addServerAirBox.selected) {
      tempUrl = tempUrl + "&airbox=1";
    }
    if (this.data.addServerReceivePet.selected) {
      tempUrl = tempUrl + "&receiveaddress=" + this.data.beginCity + this.data.addServerReceivePet.receiveDistrict + this.data.addServerReceivePet.address;
    }
    if (this.data.addServerSendPet.selected) {
      tempUrl = tempUrl + "&sendaddress=" + this.data.endCity + this.data.addServerSendPet.sendDistrict + this.data.addServerSendPet.address;
    }
    if (this.data.addServerInsuredPrice.selected) {
      tempUrl = tempUrl + "&insuredprice=" + this.data.addServerInsuredPrice.price;
    }

    wx.navigateTo({
      url: tempUrl
    })
  },

  /**
   * 计算预估金额
   */
  predictPrice: function () {
    if (this.data.beginCity == null) {
      this.setData({
        totalPrice: 0
      })
      return;
    }
    if (this.data.endCity == null) {
      this.setData({
        totalPrice: 0
      })
      return;
    }
    if (this.data.petCount == 0) {
      this.setData({
        totalPrice: 0
      })
      return;
    }
    if (this.data.petWeight == 0) {
      this.setData({
        totalPrice: 0
      })
      return;
    }
    if (this.data.selectedTransportObj == null) {
      this.setData({
        totalPrice: 0
      })
      return;
    }
    if (this.data.petClassify == null) {
      this.setData({
        totalPrice: 0
      })
      return;
    }
    if (this.data.petType == null) {
      this.setData({
        totalPrice: 0
      })
      return;
    }
    let that = this;
    loginUtil.checkLogin(function alreadyLoginCallback(state) {
      if (state) {
        that.requestPredictPrice();
      } else {
        wx.showModal({
          title: '暂未登录',
          content: '登录后才能获取预估价格',
          success(res){
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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }, 

  /* ============================= 页面事件 End ============================== */

  /* ============================= 网络请求 Start ============================== */

  /**
   * 查询保价费率
   */
  requestInsurePriceRate: function (cityName) {
    wx.showLoading({
      title: '请稍等...',
    })
    let that = this;
    wx.request({
      url: config.URL_Service + config.URL_InsureRate,
      data: {
        "startCity": cityName
      },
      success(res){
        console.log("查询保价费率 success => \n" + JSON.stringify(res))
        if (res.data.data != null) {
          that.data.addServerInsuredPrice.rate = res.data.data.rate * 100;
        } else {
          that.data.addServerInsuredPrice.rate = 0;
          that.data.addServerInsuredPrice.selected = false;
          that.data.addServerInsuredPrice.price = 0;
        }
        that.setData({
          addServerInsuredPrice: that.data.addServerInsuredPrice
        })
      },
      fail(res) {
        console.log("查询保价费率 fail => \n" + JSON.stringify(res))
        wx.showToast({
          title: '查询保价费率失败',
          icon: 'none'
        })
      },
      complete(res) {
        console.log("查询保价费率 complete => \n" + JSON.stringify(res))
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
      icon: 'none'
    })
    let tempData = {
      "openId": loginUtil.getOpenId(),
      "startCity": this.data.beginCity,
      "endCity": this.data.endCity,
      "transportType": this.data.selectedTransportObj.transportId,
      "weight": this.data.petWeight,
      "num": this.data.petCount,
      "leaveDate": this.data.date,
      "petClassify": this.data.petClassify.petClassifyName,
      "petType": this.data.petType,
      "receiverName" : "",
      "receiverPhone": "",
      "senderName": "",
      "senderPhone": "",
      "remarks": "",
    };
    tempData.sendAddress = "";
    if (this.data.addServerSendPet.selected) {
      if (this.data.addServerSendPet.address == null
        || this.data.addServerSendPet.address.length <= 0) {
        wx.showToast({
          title: '请输入送宠地址',
          icon: 'none'
        })
        return;
      } else {
        tempData.sendAddress = this.data.endCity + this.data.addServerSendPet.sendDistrict + this.data.addServerSendPet.address;
      }
    }
    tempData.receiptAddress = "";
    if (this.data.addServerReceivePet.selected) {
      if (this.data.addServerReceivePet.address == null 
        || this.data.addServerReceivePet.address.length <= 0) {
        wx.showToast({
          title: '请输入接宠地址',
          icon: 'none'
        })
        return;
      } else {
        tempData.receiptAddress = this.data.beginCity + this.data.addServerReceivePet.receiveDistrict + this.data.addServerReceivePet.address;
      }
    }
    tempData.buyPetCage = "0";
    if (this.data.addServerAirBox.selected) {
      tempData.buyPetCage = "1"
    }
    tempData.giveFood = "0";
    if (this.data.addServerPetCan.selected) {
      tempData.giveFood = "1";
    }
    tempData.petAmount = 0;
    if (this.data.addServerInsuredPrice.selected) {
      if (this.data.addServerInsuredPrice.price == 0) {
        wx.showToast({
          title: '请输入保价金额',
          icon: 'none'
        })
        return;
      } else {
        tempData.petAmount = this.data.addServerInsuredPrice.price;
      }
    }
    let that = this;
    wx.request({
      url: config.URL_Service + config.URL_PredictPrice,
      data: tempData,
      success(res) {
        console.log("获取预估价格 success => \n" + JSON.stringify(res));
        if (res.data.prompt == config.Prompt_Success) {
          that.setData({
            totalPrice: res.data.root
          })
        } else {
          let msg = res.data.root;
          if (msg == null) {
            msg = "系统异常"
          }
          wx.showToast({
            title: msg,
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

  /**
   * 查询最大重量
   */

  /**
   * 查询可用的运输方式
   */
  checkAbleTransportType: function () {
    let that = this;
    wx.showLoading({
      title: '请稍等...',
      icon: 'none'
    })
    wx.request({
      url: config.URL_Service + config.URL_AbleTransportType,
      data: {
        "startCity" : this.data.beginCity,
        "endCity" : this.data.endCity,
      },
      success(res) {
        console.log("获取可用运输方式 success => \n" + JSON.stringify(res));
        let ableList = res.data.root;
        for (let i = 0; i < that.data.transportTypes.length; i++) {
          that.data.transportTypes[i].disable = true;
        }
        for (let i = 0; i < ableList.length; i++) {
          let index = ableList[i];
          that.data.transportTypes[index-1].disable = false;
        }
        that.setData({
          transportTypes: that.data.transportTypes
        })
      },
      fail(res) {
        console.log("获取可用运输方式 fail => \n" + JSON.stringify(res));
        wx.showToast({
          title: '获取可用运输方式失败',
          icon: 'none'
        })
      },
      complete(res) {
        wx.hideLoading();
      },
    })
  },

  /**
   * 请求宠物类型
   */
  requestPetType: function () {
    let that = this;
    wx.showLoading({
      title: '请稍等...',
    })
    let urlstr = config.URL_Service + config.URL_PetType;
    // 向服务器请求登陆，返回 本微信 在服务器状态，注册|未注册，
    wx.request({
      url: urlstr, // 服务器地址
      success: res => {
        console.log("success => " + JSON.stringify(res));
        if (res.data.prompt == config.Prompt_Success) {
          that.data.petTypes = res.data.root;
          wx.showActionSheet({
            itemList: that.data.petTypes,
            success: function (res) {
              that.setData({
                petType: that.data.petTypes[res.tapIndex],
                petClassify: null
              })
            },
            fail: function (res) {
              console.log(res.errMsg)
            }
          });
        }
      },
      fail(res) {
        wx.showToast({
          title: '查询宠物类型失败',
          icon: 'none',
        })
      },
      complete(res) {
        wx.hideLoading();
      },
    })
  },

  /**
   * 查询宠物箱
   */
  checkPetCage: function () {
    let that = this;
    wx.request({
      url: config.URL_Service + config.URL_AblePetCage,
      data: {
        startCity: this.data.beginCity,
        endCity: this.data.endCity,
        transportType: this.data.selectedTransportObj.transportId,
      },
      success(res) {
        console.log("查询宠物箱 success:\n" + JSON.stringify(res));
        if (res.data.data == null) {
          that.data.addServerAirBox.ableUse = false;
          that.data.addServerAirBox.selected = false;
          that.setData({
            addServerAirBox: that.data.addServerAirBox,
          })
        } else {
          that.data.addServerAirBox.ableUse = true;
          that.data.petMaxWeight = res.data.data;
          that.setData({
            addServerAirBox: that.data.addServerAirBox,
            petMaxWeight: that.data.petMaxWeight,
          })
          that.checkPetWeight();
        }
      },
      fail(res) {
        console.log("查询宠物箱 fail:\n" + JSON.stringify(res));
      },
      complete(res) {
        console.log("查询宠物箱 complete:\n" + JSON.stringify(res));
      }
    })
  },

  /**
   * 查询送宠可用站点
   */
  checkAbleStation: function (cityName) {
    let urlStr = config.URL_Service + config.URL_AbleStation;
    let that = this;
    wx.request({
      url: urlStr,
      data: {
        "endCity": cityName 
      },
      success(res) {
        console.log("查询送宠可用站点 success => \n" + JSON.stringify(res));
        if (res.data.data == null || res.data.data.length <= 0) {
          that.data.addServerSendPet.haveAbleStation = false;
          that.data.addServerSendPet.address = null;
          that.data.addServerSendPet.selected = false;
          that
        } else {
          that.data.addServerSendPet.haveAbleStation = true;
        }
        that.setData({
          addServerSendPet: that.data.addServerSendPet
        })
      },
      fail(res) {
        console.log("查询送宠可用站点 fail => \n" + JSON.stringify(res));
        wx.showToast({
          title: '查询送宠可用站点失败',
          icon: 'none'
        })
      },
      complete(res) {
        console.log("查询送宠可用站点 complete => \n" + JSON.stringify(res));
      }
    })
  },

  /**
   * 请求宠物种类
   */
  requestPetClassify: function (currentType) {
    let that = this;
    wx.showLoading({
      title: '请稍等...',
    })
    let urlstr = config.URL_Service + config.URL_PetClassify;
    // 向服务器请求登陆，返回 本微信 在服务器状态，注册|未注册，
    wx.request({
      url: urlstr, // 服务器地址
      data: {
        "petTypeName": currentType
      },
      success: res => {
        console.log("success => " + JSON.stringify(res));
        if (res.data.prompt == config.Prompt_Success) {
          that.data.petClassifys = res.data.root;
          let tempList = [];
          for (let i = 0; i < that.data.petClassifys.length; i++) {
            tempList[i] = that.data.petClassifys[i].petClassifyName;
          }
          wx.showActionSheet({
            itemList: tempList,
            success: function (res) {
              that.setData({
                petClassify: that.data.petClassifys[res.tapIndex]
              })
              that.predictPrice();
            },
            fail: function (res) {
              console.log(res.errMsg)
            }
          });
        }
      },
      fail(res) {
        wx.showToast({
          title: '查询宠物类型失败',
          icon: 'none',
        })
      },
      complete(res) {
        wx.hideLoading();
      },
    })
  },

  /**
   * 请求商家电话
   */
  requestStroePhoneByCityName: function(cityName) {
    let that = this;
    wx.request({
      url: config.URL_Service + config.URL_GetStorePhoneByCityName,
      data: {
        cityName: cityName
      },
      success(res){
        console.log("获取商家电话 城市（" + cityName + "） success => \n" + JSON.stringify(res));
        that.setData({
          storePhone: res.data.data
        })
      },
      fail(res) {
        console.log("获取商家电话 城市（" + cityName + "） fail => \n" + JSON.stringify(res));
        wx.showToast({
          title: '网络原因，获取客服电话失败',
          icon: 'none'
        })
      },
      complete(res) {
        console.log("获取商家电话 城市（" + cityName + "） complete => \n" + JSON.stringify(res));
      },
    })
  },

  /**
   * 请求Banner数据
   */
  requestBanner: function () {},

  /* ============================= 网络请求 End ============================== */

  /**
   * 检查重量
   */
  checkPetWeight: function(){
    if (this.data.petMaxWeight != null) {
      if (this.data.petWeight > this.data.petMaxWeight) {
        let that = this;
        wx.showModal({
          title: '超出' + this.data.selectedTransportObj.transportName + '托运重量限制',
          content: this.data.beginCity + '——' +this.data.endCity + this.data.selectedTransportObj.transportName + '最大托运重量为' + this.data.petMaxWeight + 'kg',
          showCancel: false,
          success(res) {
            if (res.confirm) {
              that.data.addServerAirBox.selected = false;
              that.data.selectedTransportObj = null;
              that.setData({
                addServerAirBox: that.data.addServerAirBox,
                selectedTransportObj: that.data.selectedTransportObj,
                petMaxWeight: null,
              })
              that.predictPrice();
            }
          }
        })
      }
    }
  },
});

// 区县
var DISTRICT = {
  "北京市": ["东城区", "西城区", "朝阳区", "丰台区", "石景山区", "海淀区", "门头沟区", "房山区", "通州区", "顺义区", "昌平区", "大兴区", "怀柔区", "平谷区", "密云区", "延庆区"],
  "天津市": ["和平区", "河东区", "河西区", "南开区", "河北区", "红桥区", "东丽区", "西青区", "津南区", "北辰区", "武清区", "宝坻区", "滨海新区", "宁河区", "静海区", "蓟州区"],
  "石家庄市": ["长安区", "桥西区", "新华区", "井陉矿区", "裕华区", "藁城区", "鹿泉区", "栾城区", "井陉县", "正定县", "行唐县", "灵寿县", "高邑县", "深泽县", "赞皇县", "无极县", "平山县", "元氏县", "赵县", "石家庄高新技术产业开发区", "石家庄循环化工园区", "辛集市", "晋州市", "新乐市"],
  "唐山市": ["路南区", "路北区", "古冶区", "开平区", "丰南区", "丰润区", "曹妃甸区", "滦县", "滦南县", "乐亭县", "迁西县", "玉田县", "唐山市芦台经济技术开发区", "唐山市汉沽管理区", "唐山高新技术产业开发区", "河北唐山海港经济开发区", "遵化市", "迁安市"],
  "秦皇岛市": ["海港区", "山海关区", "北戴河区", "抚宁区", "青龙满族自治县", "昌黎县", "卢龙县", "秦皇岛市经济技术开发区", "北戴河新区"],
  "邯郸市": ["邯山区", "丛台区", "复兴区", "峰峰矿区", "肥乡区", "永年区", "临漳县", "成安县", "大名县", "涉县", "磁县", "邱县", "鸡泽县", "广平县", "馆陶县", "魏县", "曲周县", "邯郸经济技术开发区", "邯郸冀南新区", "武安市"],
  "邢台市": ["桥东区", "桥西区", "邢台县", "临城县", "内丘县", "柏乡县", "隆尧县", "任县", "南和县", "宁晋县", "巨鹿县", "新河县", "广宗县", "平乡县", "威县", "清河县", "临西县", "河北邢台经济开发区", "南宫市", "沙河市"],
  "保定市": ["竞秀区", "莲池区", "满城区", "清苑区", "徐水区", "涞水县", "阜平县", "定兴县", "唐县", "高阳县", "容城县", "涞源县", "望都县", "安新县", "易县", "曲阳县", "蠡县", "顺平县", "博野县", "雄县", "保定高新技术产业开发区", "保定白沟新城", "涿州市", "定州市", "安国市", "高碑店市"],
  "张家口市": ["桥东区", "桥西区", "宣化区", "下花园区", "万全区", "崇礼区", "张北县", "康保县", "沽源县", "尚义县", "蔚县", "阳原县", "怀安县", "怀来县", "涿鹿县", "赤城县", "张家口市高新技术产业开发区", "张家口市察北管理区", "张家口市塞北管理区"],
  "承德市": ["双桥区", "双滦区", "鹰手营子矿区", "承德县", "兴隆县", "滦平县", "隆化县", "丰宁满族自治县", "宽城满族自治县", "围场满族蒙古族自治县", "承德高新技术产业开发区", "平泉市"],
  "沧州市": ["新华区", "运河区", "沧县", "青县", "东光县", "海兴县", "盐山县", "肃宁县", "南皮县", "吴桥县", "献县", "孟村回族自治县", "河北沧州经济开发区", "沧州高新技术产业开发区", "沧州渤海新区", "泊头市", "任丘市", "黄骅市", "河间市"],
  "廊坊市": ["安次区", "广阳区", "固安县", "永清县", "香河县", "大城县", "文安县", "大厂回族自治县", "廊坊经济技术开发区", "霸州市", "三河市"],
  "衡水市": ["桃城区", "冀州区", "枣强县", "武邑县", "武强县", "饶阳县", "安平县", "故城县", "景县", "阜城县", "河北衡水经济开发区", "衡水滨湖新区", "深州市"],
  "太原市": ["小店区", "迎泽区", "杏花岭区", "尖草坪区", "万柏林区", "晋源区", "清徐县", "阳曲县", "娄烦县", "山西转型综合改革示范区", "古交市"],
  "大同市": ["城区", "矿区", "南郊区", "新荣区", "阳高县", "天镇县", "广灵县", "灵丘县", "浑源县", "左云县", "大同县", "山西大同经济开发区"],
  "阳泉市": ["城区", "矿区", "郊区", "平定县", "盂县", "山西阳泉经济开发区"],
  "长治市": ["城区", "郊区", "长治县", "襄垣县", "屯留县", "平顺县", "黎城县", "壶关县", "长子县", "武乡县", "沁县", "沁源县", "山西长治高新技术产业园区", "潞城市"],
  "晋城市": ["城区", "沁水县", "阳城县", "陵川县", "泽州县", "高平市"],
  "朔州市": ["朔城区", "平鲁区", "山阴县", "应县", "右玉县", "怀仁县", "山西朔州经济开发区"],
  "晋中市": ["榆次区", "榆社县", "左权县", "和顺县", "昔阳县", "寿阳县", "太谷县", "祁县", "平遥县", "灵石县", "介休市"],
  "运城市": ["盐湖区", "临猗县", "万荣县", "闻喜县", "稷山县", "新绛县", "绛县", "垣曲县", "夏县", "平陆县", "芮城县", "永济市", "河津市"],
  "忻州市": ["忻府区", "定襄县", "五台县", "代县", "繁峙县", "宁武县", "静乐县", "神池县", "五寨县", "岢岚县", "河曲县", "保德县", "偏关县", "五台山风景名胜区", "原平市"],
  "临汾市": ["尧都区", "曲沃县", "翼城县", "襄汾县", "洪洞县", "古县", "安泽县", "浮山县", "吉县", "乡宁县", "大宁县", "隰县", "永和县", "蒲县", "汾西县", "侯马市", "霍州市"],
  "吕梁市": ["离石区", "文水县", "交城县", "兴县", "临县", "柳林县", "石楼县", "岚县", "方山县", "中阳县", "交口县", "孝义市", "汾阳市"],
  "呼和浩特市": ["新城区", "回民区", "玉泉区", "赛罕区", "土默特左旗", "托克托县", "和林格尔县", "清水河县", "武川县", "呼和浩特金海工业园区", "呼和浩特经济技术开发区"],
  "包头市": ["东河区", "昆都仑区", "青山区", "石拐区", "白云鄂博矿区", "九原区", "土默特右旗", "固阳县", "达尔罕茂明安联合旗", "包头稀土高新技术产业开发区"],
  "乌海市": ["海勃湾区", "海南区", "乌达区"],
  "赤峰市": ["红山区", "元宝山区", "松山区", "阿鲁科尔沁旗", "巴林左旗", "巴林右旗", "林西县", "克什克腾旗", "翁牛特旗", "喀喇沁旗", "宁城县", "敖汉旗"],
  "通辽市": ["科尔沁区", "科尔沁左翼中旗", "科尔沁左翼后旗", "开鲁县", "库伦旗", "奈曼旗", "扎鲁特旗", "通辽经济技术开发区", "霍林郭勒市"],
  "鄂尔多斯市": ["东胜区", "康巴什区", "达拉特旗", "准格尔旗", "鄂托克前旗", "鄂托克旗", "杭锦旗", "乌审旗", "伊金霍洛旗"],
  "呼伦贝尔市": ["海拉尔区", "扎赉诺尔区", "阿荣旗", "莫力达瓦达斡尔族自治旗", "鄂伦春自治旗", "鄂温克族自治旗", "陈巴尔虎旗", "新巴尔虎左旗", "新巴尔虎右旗", "满洲里市", "牙克石市", "扎兰屯市", "额尔古纳市", "根河市"],
  "巴彦淖尔市": ["临河区", "五原县", "磴口县", "乌拉特前旗", "乌拉特中旗", "乌拉特后旗", "杭锦后旗"],
  "乌兰察布市": ["集宁区", "卓资县", "化德县", "商都县", "兴和县", "凉城县", "察哈尔右翼前旗", "察哈尔右翼中旗", "察哈尔右翼后旗", "四子王旗", "丰镇市"],
  "兴安盟": ["乌兰浩特市", "阿尔山市", "科尔沁右翼前旗", "科尔沁右翼中旗", "扎赉特旗", "突泉县"],
  "锡林郭勒盟": ["二连浩特市", "锡林浩特市", "阿巴嘎旗", "苏尼特左旗", "苏尼特右旗", "东乌珠穆沁旗", "西乌珠穆沁旗", "太仆寺旗", "镶黄旗", "正镶白旗", "正蓝旗", "多伦县", "乌拉盖管委会"],
  "阿拉善盟": ["阿拉善左旗", "阿拉善右旗", "额济纳旗", "内蒙古阿拉善经济开发区"],
  "沈阳市": ["和平区", "沈河区", "大东区", "皇姑区", "铁西区", "苏家屯区", "浑南区", "沈北新区", "于洪区", "辽中区", "康平县", "法库县", "新民市"],
  "大连市": ["中山区", "西岗区", "沙河口区", "甘井子区", "旅顺口区", "金州区", "普兰店区", "长海县", "瓦房店市", "庄河市"],
  "鞍山市": ["铁东区", "铁西区", "立山区", "千山区", "台安县", "岫岩满族自治县", "海城市"],
  "抚顺市": ["新抚区", "东洲区", "望花区", "顺城区", "抚顺县", "新宾满族自治县", "清原满族自治县"],
  "本溪市": ["平山区", "溪湖区", "明山区", "南芬区", "本溪满族自治县", "桓仁满族自治县"],
  "丹东市": ["元宝区", "振兴区", "振安区", "宽甸满族自治县", "东港市", "凤城市"],
  "锦州市": ["古塔区", "凌河区", "太和区", "黑山县", "义县", "凌海市", "北镇市"],
  "营口市": ["站前区", "西市区", "鲅鱼圈区", "老边区", "盖州市", "大石桥市"],
  "阜新市": ["海州区", "新邱区", "太平区", "清河门区", "细河区", "阜新蒙古族自治县", "彰武县"],
  "辽阳市": ["白塔区", "文圣区", "宏伟区", "弓长岭区", "太子河区", "辽阳县", "灯塔市"],
  "盘锦市": ["双台子区", "兴隆台区", "大洼区", "盘山县"],
  "铁岭市": ["银州区", "清河区", "铁岭县", "西丰县", "昌图县", "调兵山市", "开原市"],
  "朝阳市": ["双塔区", "龙城区", "朝阳县", "建平县", "喀喇沁左翼蒙古族自治县", "北票市", "凌源市"],
  "葫芦岛市": ["连山区", "龙港区", "南票区", "绥中县", "建昌县", "兴城市"],
  "长春市": ["南关区", "宽城区", "朝阳区", "二道区", "绿园区", "双阳区", "九台区", "农安县", "长春经济技术开发区", "长春净月高新技术产业开发区", "长春高新技术产业开发区", "长春汽车经济技术开发区", "榆树市", "德惠市"],
  "吉林市": ["昌邑区", "龙潭区", "船营区", "丰满区", "永吉县", "吉林经济开发区", "吉林高新技术产业开发区", "吉林中国新加坡食品区", "蛟河市", "桦甸市", "舒兰市", "磐石市"],
  "四平市": ["铁西区", "铁东区", "梨树县", "伊通满族自治县", "公主岭市", "双辽市"],
  "辽源市": ["龙山区", "西安区", "东丰县", "东辽县"],
  "通化市": ["东昌区", "二道江区", "通化县", "辉南县", "柳河县", "梅河口市", "集安市"],
  "白山市": ["浑江区", "江源区", "抚松县", "靖宇县", "长白朝鲜族自治县", "临江市"],
  "松原市": ["宁江区", "前郭尔罗斯蒙古族自治县", "长岭县", "乾安县", "吉林松原经济开发区", "扶余市"],
  "白城市": ["洮北区", "镇赉县", "通榆县", "吉林白城经济开发区", "洮南市", "大安市"],
  "延边朝鲜族自治州": ["延吉市", "图们市", "敦化市", "珲春市", "龙井市", "和龙市", "汪清县", "安图县"],
  "哈尔滨市": ["道里区", "南岗区", "道外区", "平房区", "松北区", "香坊区", "呼兰区", "阿城区", "双城区", "依兰县", "方正县", "宾县", "巴彦县", "木兰县", "通河县", "延寿县", "尚志市", "五常市"],
  "齐齐哈尔市": ["龙沙区", "建华区", "铁锋区", "昂昂溪区", "富拉尔基区", "碾子山区", "梅里斯达斡尔族区", "龙江县", "依安县", "泰来县", "甘南县", "富裕县", "克山县", "克东县", "拜泉县", "讷河市"],
  "鸡西市": ["鸡冠区", "恒山区", "滴道区", "梨树区", "城子河区", "麻山区", "鸡东县", "虎林市", "密山市"],
  "鹤岗市": ["向阳区", "工农区", "南山区", "兴安区", "东山区", "兴山区", "萝北县", "绥滨县"],
  "双鸭山市": ["尖山区", "岭东区", "四方台区", "宝山区", "集贤县", "友谊县", "宝清县", "饶河县"],
  "大庆市": ["萨尔图区", "龙凤区", "让胡路区", "红岗区", "大同区", "肇州县", "肇源县", "林甸县", "杜尔伯特蒙古族自治县", "大庆高新技术产业开发区"],
  "伊春市": ["伊春区", "南岔区", "友好区", "西林区", "翠峦区", "新青区", "美溪区", "金山屯区", "五营区", "乌马河区", "汤旺河区", "带岭区", "乌伊岭区", "红星区", "上甘岭区", "嘉荫县", "铁力市"],
  "佳木斯市": ["向阳区", "前进区", "东风区", "郊区", "桦南县", "桦川县", "汤原县", "同江市", "富锦市", "抚远市"],
  "七台河市": ["新兴区", "桃山区", "茄子河区", "勃利县"],
  "牡丹江市": ["东安区", "阳明区", "爱民区", "西安区", "林口县", "牡丹江经济技术开发区", "绥芬河市", "海林市", "宁安市", "穆棱市", "东宁市"],
  "黑河市": ["爱辉区", "嫩江县", "逊克县", "孙吴县", "北安市", "五大连池市"],
  "绥化市": ["北林区", "望奎县", "兰西县", "青冈县", "庆安县", "明水县", "绥棱县", "安达市", "肇东市", "海伦市"],
  "大兴安岭地区": ["加格达奇区", "松岭区", "新林区", "呼中区", "呼玛县", "塔河县", "漠河县"],
  "上海市": ["黄浦区", "徐汇区", "长宁区", "静安区", "普陀区", "虹口区", "杨浦区", "闵行区", "宝山区", "嘉定区", "浦东新区", "金山区", "松江区", "青浦区", "奉贤区", "崇明区"],
  "南京市": ["玄武区", "秦淮区", "建邺区", "鼓楼区", "浦口区", "栖霞区", "雨花台区", "江宁区", "六合区", "溧水区", "高淳区"],
  "无锡市": ["锡山区", "惠山区", "滨湖区", "梁溪区", "新吴区", "江阴市", "宜兴市"],
  "徐州市": ["鼓楼区", "云龙区", "贾汪区", "泉山区", "铜山区", "丰县", "沛县", "睢宁县", "徐州经济技术开发区", "新沂市", "邳州市"],
  "常州市": ["天宁区", "钟楼区", "新北区", "武进区", "金坛区", "溧阳市"],
  "苏州市": ["虎丘区", "吴中区", "相城区", "姑苏区", "吴江区", "苏州工业园区", "常熟市", "张家港市", "昆山市", "太仓市"],
  "南通市": ["崇川区", "港闸区", "通州区", "海安县", "如东县", "南通经济技术开发区", "启东市", "如皋市", "海门市"],
  "连云港市": ["连云区", "海州区", "赣榆区", "东海县", "灌云县", "灌南县", "连云港经济技术开发区", "连云港高新技术产业开发区"],
  "淮安市": ["淮安区", "淮阴区", "清江浦区", "洪泽区", "涟水县", "盱眙县", "金湖县", "淮安经济技术开发区"],
  "盐城市": ["亭湖区", "盐都区", "大丰区", "响水县", "滨海县", "阜宁县", "射阳县", "建湖县", "盐城经济技术开发区", "东台市"],
  "扬州市": ["广陵区", "邗江区", "江都区", "宝应县", "扬州经济技术开发区", "仪征市", "高邮市"],
  "镇江市": ["京口区", "润州区", "丹徒区", "镇江新区", "丹阳市", "扬中市", "句容市"],
  "泰州市": ["海陵区", "高港区", "姜堰区", "泰州医药高新技术产业开发区", "兴化市", "靖江市", "泰兴市"],
  "宿迁市": ["宿城区", "宿豫区", "沭阳县", "泗阳县", "泗洪县", "宿迁经济技术开发区"],
  "杭州市": ["上城区", "下城区", "江干区", "拱墅区", "西湖区", "滨江区", "萧山区", "余杭区", "富阳区", "临安区", "桐庐县", "淳安县", "建德市"],
  "宁波市": ["海曙区", "江北区", "北仑区", "镇海区", "鄞州区", "奉化区", "象山县", "宁海县", "余姚市", "慈溪市"],
  "温州市": ["鹿城区", "龙湾区", "瓯海区", "洞头区", "永嘉县", "平阳县", "苍南县", "文成县", "泰顺县", "温州经济技术开发区", "瑞安市", "乐清市"],
  "嘉兴市": ["南湖区", "秀洲区", "嘉善县", "海盐县", "海宁市", "平湖市", "桐乡市"],
  "湖州市": ["吴兴区", "南浔区", "德清县", "长兴县", "安吉县"],
  "绍兴市": ["越城区", "柯桥区", "上虞区", "新昌县", "诸暨市", "嵊州市"],
  "金华市": ["婺城区", "金东区", "武义县", "浦江县", "磐安县", "兰溪市", "义乌市", "东阳市", "永康市"],
  "衢州市": ["柯城区", "衢江区", "常山县", "开化县", "龙游县", "江山市"],
  "舟山市": ["定海区", "普陀区", "岱山县", "嵊泗县"],
  "台州市": ["椒江区", "黄岩区", "路桥区", "三门县", "天台县", "仙居县", "温岭市", "临海市", "玉环市"],
  "丽水市": ["莲都区", "青田县", "缙云县", "遂昌县", "松阳县", "云和县", "庆元县", "景宁畲族自治县", "龙泉市"],
  "合肥市": ["瑶海区", "庐阳区", "蜀山区", "包河区", "长丰县", "肥东县", "肥西县", "庐江县", "合肥高新技术产业开发区", "合肥经济技术开发区", "合肥新站高新技术产业开发区", "巢湖市"],
  "芜湖市": ["镜湖区", "弋江区", "鸠江区", "三山区", "芜湖县", "繁昌县", "南陵县", "无为县", "芜湖经济技术开发区", "安徽芜湖长江大桥经济开发区"],
  "蚌埠市": ["龙子湖区", "蚌山区", "禹会区", "淮上区", "怀远县", "五河县", "固镇县", "蚌埠市高新技术开发区", "蚌埠市经济开发区"],
  "淮南市": ["大通区", "田家庵区", "谢家集区", "八公山区", "潘集区", "凤台县", "寿县"],
  "马鞍山市": ["花山区", "雨山区", "博望区", "当涂县", "含山县", "和县"],
  "淮北市": ["杜集区", "相山区", "烈山区", "濉溪县"],
  "铜陵市": ["铜官区", "义安区", "郊区", "枞阳县"],
  "安庆市": ["迎江区", "大观区", "宜秀区", "怀宁县", "潜山县", "太湖县", "宿松县", "望江县", "岳西县", "安徽安庆经济开发区", "桐城市"],
  "黄山市": ["屯溪区", "黄山区", "徽州区", "歙县", "休宁县", "黟县", "祁门县"],
  "滁州市": ["琅琊区", "南谯区", "来安县", "全椒县", "定远县", "凤阳县", "苏滁现代产业园", "滁州经济技术开发区", "天长市", "明光市"],
  "阜阳市": ["颍州区", "颍东区", "颍泉区", "临泉县", "太和县", "阜南县", "颍上县", "阜阳合肥现代产业园区", "阜阳经济技术开发区", "界首市"],
  "宿州市": ["埇桥区", "砀山县", "萧县", "灵璧县", "泗县", "宿州马鞍山现代产业园区", "宿州经济技术开发区"],
  "六安市": ["金安区", "裕安区", "叶集区", "霍邱县", "舒城县", "金寨县", "霍山县"],
  "亳州市": ["谯城区", "涡阳县", "蒙城县", "利辛县"],
  "池州市": ["贵池区", "东至县", "石台县", "青阳县"],
  "宣城市": ["宣州区", "郎溪县", "广德县", "泾县", "绩溪县", "旌德县", "宣城市经济开发区", "宁国市"],
  "福州市": ["鼓楼区", "台江区", "仓山区", "马尾区", "晋安区", "闽侯县", "连江县", "罗源县", "闽清县", "永泰县", "平潭县", "福清市", "长乐市"],
  "厦门市": ["思明区", "海沧区", "湖里区", "集美区", "同安区", "翔安区"],
  "莆田市": ["城厢区", "涵江区", "荔城区", "秀屿区", "仙游县"],
  "三明市": ["梅列区", "三元区", "明溪县", "清流县", "宁化县", "大田县", "尤溪县", "沙县", "将乐县", "泰宁县", "建宁县", "永安市"],
  "泉州市": ["鲤城区", "丰泽区", "洛江区", "泉港区", "惠安县", "安溪县", "永春县", "德化县", "金门县", "石狮市", "晋江市", "南安市"],
  "漳州市": ["芗城区", "龙文区", "云霄县", "漳浦县", "诏安县", "长泰县", "东山县", "南靖县", "平和县", "华安县", "龙海市"],
  "南平市": ["延平区", "建阳区", "顺昌县", "浦城县", "光泽县", "松溪县", "政和县", "邵武市", "武夷山市", "建瓯市"],
  "龙岩市": ["新罗区", "永定区", "长汀县", "上杭县", "武平县", "连城县", "漳平市"],
  "宁德市": ["蕉城区", "霞浦县", "古田县", "屏南县", "寿宁县", "周宁县", "柘荣县", "福安市", "福鼎市"],
  "南昌市": ["东湖区", "西湖区", "青云谱区", "湾里区", "青山湖区", "新建区", "南昌县", "安义县", "进贤县"],
  "景德镇市": ["昌江区", "珠山区", "浮梁县", "乐平市"],
  "萍乡市": ["安源区", "湘东区", "莲花县", "上栗县", "芦溪县"],
  "九江市": ["濂溪区", "浔阳区", "柴桑区", "武宁县", "修水县", "永修县", "德安县", "都昌县", "湖口县", "彭泽县", "瑞昌市", "共青城市", "庐山市"],
  "新余市": ["渝水区", "分宜县"],
  "鹰潭市": ["月湖区", "余江县", "贵溪市"],
  "赣州市": ["章贡区", "南康区", "赣县区", "信丰县", "大余县", "上犹县", "崇义县", "安远县", "龙南县", "定南县", "全南县", "宁都县", "于都县", "兴国县", "会昌县", "寻乌县", "石城县", "瑞金市"],
  "吉安市": ["吉州区", "青原区", "吉安县", "吉水县", "峡江县", "新干县", "永丰县", "泰和县", "遂川县", "万安县", "安福县", "永新县", "井冈山市"],
  "宜春市": ["袁州区", "奉新县", "万载县", "上高县", "宜丰县", "靖安县", "铜鼓县", "丰城市", "樟树市", "高安市"],
  "抚州市": ["临川区", "东乡区", "南城县", "黎川县", "南丰县", "崇仁县", "乐安县", "宜黄县", "金溪县", "资溪县", "广昌县"],
  "上饶市": ["信州区", "广丰区", "上饶县", "玉山县", "铅山县", "横峰县", "弋阳县", "余干县", "鄱阳县", "万年县", "婺源县", "德兴市"],
  "济南市": ["历下区", "市中区", "槐荫区", "天桥区", "历城区", "长清区", "章丘区", "平阴县", "济阳县", "商河县", "济南高新技术产业开发区"],
  "青岛市": ["市南区", "市北区", "黄岛区", "崂山区", "李沧区", "城阳区", "即墨区", "青岛高新技术产业开发区", "胶州市", "平度市", "莱西市"],
  "淄博市": ["淄川区", "张店区", "博山区", "临淄区", "周村区", "桓台县", "高青县", "沂源县"],
  "枣庄市": ["市中区", "薛城区", "峄城区", "台儿庄区", "山亭区", "滕州市"],
  "东营市": ["东营区", "河口区", "垦利区", "利津县", "广饶县", "东营经济技术开发区", "东营港经济开发区"],
  "烟台市": ["芝罘区", "福山区", "牟平区", "莱山区", "长岛县", "烟台高新技术产业开发区", "烟台经济技术开发区", "龙口市", "莱阳市", "莱州市", "蓬莱市", "招远市", "栖霞市", "海阳市"],
  "潍坊市": ["潍城区", "寒亭区", "坊子区", "奎文区", "临朐县", "昌乐县", "潍坊滨海经济技术开发区", "青州市", "诸城市", "寿光市", "安丘市", "高密市", "昌邑市"],
  "济宁市": ["任城区", "兖州区", "微山县", "鱼台县", "金乡县", "嘉祥县", "汶上县", "泗水县", "梁山县", "济宁高新技术产业开发区", "曲阜市", "邹城市"],
  "泰安市": ["泰山区", "岱岳区", "宁阳县", "东平县", "新泰市", "肥城市"],
  "威海市": ["环翠区", "文登区", "威海火炬高技术产业开发区", "威海经济技术开发区", "威海临港经济技术开发区", "荣成市", "乳山市"],
  "日照市": ["东港区", "岚山区", "五莲县", "莒县", "日照经济技术开发区", "日照国际海洋城"],
  "莱芜市": ["莱城区", "钢城区"],
  "临沂市": ["兰山区", "罗庄区", "河东区", "沂南县", "郯城县", "沂水县", "兰陵县", "费县", "平邑县", "莒南县", "蒙阴县", "临沭县", "临沂高新技术产业开发区", "临沂经济技术开发区", "临沂临港经济开发区"],
  "德州市": ["德城区", "陵城区", "宁津县", "庆云县", "临邑县", "齐河县", "平原县", "夏津县", "武城县", "德州经济技术开发区", "德州运河经济开发区", "乐陵市", "禹城市"],
  "聊城市": ["东昌府区", "阳谷县", "莘县", "茌平县", "东阿县", "冠县", "高唐县", "临清市"],
  "滨州市": ["滨城区", "沾化区", "惠民县", "阳信县", "无棣县", "博兴县", "邹平县"],
  "菏泽市": ["牡丹区", "定陶区", "曹县", "单县", "成武县", "巨野县", "郓城县", "鄄城县", "东明县", "菏泽经济技术开发区", "菏泽高新技术开发区"],
  "郑州市": ["中原区", "二七区", "管城回族区", "金水区", "上街区", "惠济区", "中牟县", "郑州经济技术开发区", "郑州高新技术产业开发区", "郑州航空港经济综合实验区", "巩义市", "荥阳市", "新密市", "新郑市", "登封市"],
  "开封市": ["龙亭区", "顺河回族区", "鼓楼区", "禹王台区", "祥符区", "杞县", "通许县", "尉氏县", "兰考县"],
  "洛阳市": ["老城区", "西工区", "瀍河回族区", "涧西区", "吉利区", "洛龙区", "孟津县", "新安县", "栾川县", "嵩县", "汝阳县", "宜阳县", "洛宁县", "伊川县", "洛阳高新技术产业开发区", "偃师市"],
  "平顶山市": ["新华区", "卫东区", "石龙区", "湛河区", "宝丰县", "叶县", "鲁山县", "郏县", "平顶山高新技术产业开发区", "平顶山市新城区", "舞钢市", "汝州市"],
  "安阳市": ["文峰区", "北关区", "殷都区", "龙安区", "安阳县", "汤阴县", "滑县", "内黄县", "安阳高新技术产业开发区", "林州市"],
  "鹤壁市": ["鹤山区", "山城区", "淇滨区", "浚县", "淇县", "鹤壁经济技术开发区"],
  "新乡市": ["红旗区", "卫滨区", "凤泉区", "牧野区", "新乡县", "获嘉县", "原阳县", "延津县", "封丘县", "长垣县", "新乡高新技术产业开发区", "新乡经济技术开发区", "新乡市平原城乡一体化示范区", "卫辉市", "辉县市"],
  "焦作市": ["解放区", "中站区", "马村区", "山阳区", "修武县", "博爱县", "武陟县", "温县", "焦作城乡一体化示范区", "沁阳市", "孟州市"],
  "濮阳市": ["华龙区", "清丰县", "南乐县", "范县", "台前县", "濮阳县", "河南濮阳工业园区", "濮阳经济技术开发区"],
  "许昌市": ["魏都区", "建安区", "鄢陵县", "襄城县", "许昌经济技术开发区", "禹州市", "长葛市"],
  "漯河市": ["源汇区", "郾城区", "召陵区", "舞阳县", "临颍县", "漯河经济技术开发区"],
  "三门峡市": ["湖滨区", "陕州区", "渑池县", "卢氏县", "河南三门峡经济开发区", "义马市", "灵宝市"],
  "南阳市": ["宛城区", "卧龙区", "南召县", "方城县", "西峡县", "镇平县", "内乡县", "淅川县", "社旗县", "唐河县", "新野县", "桐柏县", "南阳高新技术产业开发区", "南阳市城乡一体化示范区", "邓州市"],
  "商丘市": ["梁园区", "睢阳区", "民权县", "睢县", "宁陵县", "柘城县", "虞城县", "夏邑县", "豫东综合物流产业聚集区", "河南商丘经济开发区", "永城市"],
  "信阳市": ["浉河区", "平桥区", "罗山县", "光山县", "新县", "商城县", "固始县", "潢川县", "淮滨县", "息县", "信阳高新技术产业开发区"],
  "周口市": ["川汇区", "扶沟县", "西华县", "商水县", "沈丘县", "郸城县", "淮阳县", "太康县", "鹿邑县", "河南周口经济开发区", "项城市"],
  "驻马店市": ["驿城区", "西平县", "上蔡县", "平舆县", "正阳县", "确山县", "泌阳县", "汝南县", "遂平县", "新蔡县", "河南驻马店经济开发区"],
  "省直辖县级行政区划": ["济源市"],
  "武汉市": ["江岸区", "江汉区", "硚口区", "汉阳区", "武昌区", "青山区", "洪山区", "东西湖区", "汉南区", "蔡甸区", "江夏区", "黄陂区", "新洲区"],
  "黄石市": ["黄石港区", "西塞山区", "下陆区", "铁山区", "阳新县", "大冶市"],
  "十堰市": ["茅箭区", "张湾区", "郧阳区", "郧西县", "竹山县", "竹溪县", "房县", "丹江口市"],
  "宜昌市": ["西陵区", "伍家岗区", "点军区", "猇亭区", "夷陵区", "远安县", "兴山县", "秭归县", "长阳土家族自治县", "五峰土家族自治县", "宜都市", "当阳市", "枝江市"],
  "襄阳市": ["襄城区", "樊城区", "襄州区", "南漳县", "谷城县", "保康县", "老河口市", "枣阳市", "宜城市"],
  "鄂州市": ["梁子湖区", "华容区", "鄂城区"],
  "荆门市": ["东宝区", "掇刀区", "京山县", "沙洋县", "钟祥市"],
  "孝感市": ["孝南区", "孝昌县", "大悟县", "云梦县", "应城市", "安陆市", "汉川市"],
  "荆州市": ["沙市区", "荆州区", "公安县", "监利县", "江陵县", "荆州经济技术开发区", "石首市", "洪湖市", "松滋市"],
  "黄冈市": ["黄州区", "团风县", "红安县", "罗田县", "英山县", "浠水县", "蕲春县", "黄梅县", "龙感湖管理区", "麻城市", "武穴市"],
  "咸宁市": ["咸安区", "嘉鱼县", "通城县", "崇阳县", "通山县", "赤壁市"],
  "随州市": ["曾都区", "随县", "广水市"],
  "恩施土家族苗族自治州": ["恩施市", "利川市", "建始县", "巴东县", "宣恩县", "咸丰县", "来凤县", "鹤峰县"],
  "省直辖县级行政区划": ["仙桃市", "潜江市", "天门市", "神农架林区"],
  "长沙市": ["芙蓉区", "天心区", "岳麓区", "开福区", "雨花区", "望城区", "长沙县", "浏阳市", "宁乡市"],
  "株洲市": ["荷塘区", "芦淞区", "石峰区", "天元区", "株洲县", "攸县", "茶陵县", "炎陵县", "云龙示范区", "醴陵市"],
  "湘潭市": ["雨湖区", "岳塘区", "湘潭县", "湖南湘潭高新技术产业园区", "湘潭昭山示范区", "湘潭九华示范区", "湘乡市", "韶山市"],
  "衡阳市": ["珠晖区", "雁峰区", "石鼓区", "蒸湘区", "南岳区", "衡阳县", "衡南县", "衡山县", "衡东县", "祁东县", "衡阳综合保税区", "湖南衡阳高新技术产业园区", "湖南衡阳松木经济开发区", "耒阳市", "常宁市"],
  "邵阳市": ["双清区", "大祥区", "北塔区", "邵东县", "新邵县", "邵阳县", "隆回县", "洞口县", "绥宁县", "新宁县", "城步苗族自治县", "武冈市"],
  "岳阳市": ["岳阳楼区", "云溪区", "君山区", "岳阳县", "华容县", "湘阴县", "平江县", "岳阳市屈原管理区", "汨罗市", "临湘市"],
  "常德市": ["武陵区", "鼎城区", "安乡县", "汉寿县", "澧县", "临澧县", "桃源县", "石门县", "常德市西洞庭管理区", "津市市"],
  "张家界市": ["永定区", "武陵源区", "慈利县", "桑植县"],
  "益阳市": ["资阳区", "赫山区", "南县", "桃江县", "安化县", "益阳市大通湖管理区", "湖南益阳高新技术产业园区", "沅江市"],
  "郴州市": ["北湖区", "苏仙区", "桂阳县", "宜章县", "永兴县", "嘉禾县", "临武县", "汝城县", "桂东县", "安仁县", "资兴市"],
  "永州市": ["零陵区", "冷水滩区", "祁阳县", "东安县", "双牌县", "道县", "江永县", "宁远县", "蓝山县", "新田县", "江华瑶族自治县", "永州经济技术开发区", "永州市金洞管理区", "永州市回龙圩管理区"],
  "怀化市": ["鹤城区", "中方县", "沅陵县", "辰溪县", "溆浦县", "会同县", "麻阳苗族自治县", "新晃侗族自治县", "芷江侗族自治县", "靖州苗族侗族自治县", "通道侗族自治县", "怀化市洪江管理区", "洪江市"],
  "娄底市": ["娄星区", "双峰县", "新化县", "冷水江市", "涟源市"],
  "湘西土家族苗族自治州": ["吉首市", "泸溪县", "凤凰县", "花垣县", "保靖县", "古丈县", "永顺县", "龙山县", "湖南吉首经济开发区", "湖南永顺经济开发区"],
  "广州市": ["荔湾区", "越秀区", "海珠区", "天河区", "白云区", "黄埔区", "番禺区", "花都区", "南沙区", "从化区", "增城区"],
  "韶关市": ["武江区", "浈江区", "曲江区", "始兴县", "仁化县", "翁源县", "乳源瑶族自治县", "新丰县", "乐昌市", "南雄市"],
  "深圳市": ["罗湖区", "福田区", "南山区", "宝安区", "龙岗区", "盐田区", "龙华区", "坪山区"],
  "珠海市": ["香洲区", "斗门区", "金湾区"],
  "汕头市": ["龙湖区", "金平区", "濠江区", "潮阳区", "潮南区", "澄海区", "南澳县"],
  "佛山市": ["禅城区", "南海区", "顺德区", "三水区", "高明区"],
  "江门市": ["蓬江区", "江海区", "新会区", "台山市", "开平市", "鹤山市", "恩平市"],
  "湛江市": ["赤坎区", "霞山区", "坡头区", "麻章区", "遂溪县", "徐闻县", "廉江市", "雷州市", "吴川市"],
  "茂名市": ["茂南区", "电白区", "高州市", "化州市", "信宜市"],
  "肇庆市": ["端州区", "鼎湖区", "高要区", "广宁县", "怀集县", "封开县", "德庆县", "四会市"],
  "惠州市": ["惠城区", "惠阳区", "博罗县", "惠东县", "龙门县"],
  "梅州市": ["梅江区", "梅县区", "大埔县", "丰顺县", "五华县", "平远县", "蕉岭县", "兴宁市"],
  "汕尾市": ["城区", "海丰县", "陆河县", "陆丰市"],
  "河源市": ["源城区", "紫金县", "龙川县", "连平县", "和平县", "东源县"],
  "阳江市": ["江城区", "阳东区", "阳西县", "阳春市"],
  "清远市": ["清城区", "清新区", "佛冈县", "阳山县", "连山壮族瑶族自治县", "连南瑶族自治县", "英德市", "连州市"],
  "东莞市": ["东城街道", "南城街道", "万江街道", "莞城街道", "石碣镇", "石龙镇", "茶山镇", "石排镇", "企石镇", "横沥镇", "桥头镇", "谢岗镇", "东坑镇", "常平镇", "寮步镇", "樟木头镇", "大朗镇", "黄江镇", "清溪镇", "塘厦镇", "凤岗镇", "大岭山镇", "长安镇", "虎门镇", "厚街镇", "沙田镇", "道滘镇", "洪梅镇", "麻涌镇", "望牛墩镇", "中堂镇", "高埗镇", "松山湖管委会", "东莞港", "东莞生态园"],
  "中山市": ["石岐区街道", "东区街道", "火炬开发区街道", "西区街道", "南区街道", "五桂山街道", "小榄镇", "黄圃镇", "民众镇", "东凤镇", "东升镇", "古镇镇", "沙溪镇", "坦洲镇", "港口镇", "三角镇", "横栏镇", "南头镇", "阜沙镇", "南朗镇", "三乡镇", "板芙镇", "大涌镇", "神湾镇"],
  "潮州市": ["湘桥区", "潮安区", "饶平县"],
  "揭阳市": ["榕城区", "揭东区", "揭西县", "惠来县", "普宁市"],
  "云浮市": ["云城区", "云安区", "新兴县", "郁南县", "罗定市"],
  "南宁市": ["兴宁区", "青秀区", "江南区", "西乡塘区", "良庆区", "邕宁区", "武鸣区", "隆安县", "马山县", "上林县", "宾阳县", "横县"],
  "柳州市": ["城中区", "鱼峰区", "柳南区", "柳北区", "柳江区", "柳城县", "鹿寨县", "融安县", "融水苗族自治县", "三江侗族自治县"],
  "桂林市": ["秀峰区", "叠彩区", "象山区", "七星区", "雁山区", "临桂区", "阳朔县", "灵川县", "全州县", "兴安县", "永福县", "灌阳县", "龙胜各族自治县", "资源县", "平乐县", "荔浦县", "恭城瑶族自治县"],
  "梧州市": ["万秀区", "长洲区", "龙圩区", "苍梧县", "藤县", "蒙山县", "岑溪市"],
  "北海市": ["海城区", "银海区", "铁山港区", "合浦县"],
  "防城港市": ["港口区", "防城区", "上思县", "东兴市"],
  "钦州市": ["钦南区", "钦北区", "灵山县", "浦北县"],
  "贵港市": ["港北区", "港南区", "覃塘区", "平南县", "桂平市"],
  "玉林市": ["玉州区", "福绵区", "容县", "陆川县", "博白县", "兴业县", "北流市"],
  "百色市": ["右江区", "田阳县", "田东县", "平果县", "德保县", "那坡县", "凌云县", "乐业县", "田林县", "西林县", "隆林各族自治县", "靖西市"],
  "贺州市": ["八步区", "平桂区", "昭平县", "钟山县", "富川瑶族自治县"],
  "河池市": ["金城江区", "宜州区", "南丹县", "天峨县", "凤山县", "东兰县", "罗城仫佬族自治县", "环江毛南族自治县", "巴马瑶族自治县", "都安瑶族自治县", "大化瑶族自治县"],
  "来宾市": ["兴宾区", "忻城县", "象州县", "武宣县", "金秀瑶族自治县", "合山市"],
  "崇左市": ["江州区", "扶绥县", "宁明县", "龙州县", "大新县", "天等县", "凭祥市"],
  "海口市": ["秀英区", "龙华区", "琼山区", "美兰区"],
  "三亚市": ["海棠区", "吉阳区", "天涯区", "崖州区"],
  "三沙市": ["西沙群岛", "南沙群岛", "中沙群岛的岛礁及其海域"],
  "儋州市": ["那大镇", "和庆镇", "南丰镇", "大成镇", "雅星镇", "兰洋镇", "光村镇", "木棠镇", "海头镇", "峨蔓镇", "王五镇", "白马井镇", "中和镇", "排浦镇", "东成镇", "新州镇", "洋浦经济开发区", "华南热作学院"],
  "省直辖县级行政区划": ["五指山市", "琼海市", "文昌市", "万宁市", "东方市", "定安县", "屯昌县", "澄迈县", "临高县", "白沙黎族自治县", "昌江黎族自治县", "乐东黎族自治县", "陵水黎族自治县", "保亭黎族苗族自治县", "琼中黎族苗族自治县"],
  "重庆市": ["万州区", "涪陵区", "渝中区", "大渡口区", "江北区", "沙坪坝区", "九龙坡区", "南岸区", "北碚区", "綦江区", "大足区", "渝北区", "巴南区", "黔江区", "长寿区", "江津区", "合川区", "永川区", "南川区", "璧山区", "铜梁区", "潼南区", "荣昌区", "开州区", "梁平区", "武隆区"],
  "县": ["城口县", "丰都县", "垫江县", "忠县", "云阳县", "奉节县", "巫山县", "巫溪县", "石柱土家族自治县", "秀山土家族苗族自治县", "酉阳土家族苗族自治县", "彭水苗族土家族自治县"],
  "成都市": ["锦江区", "青羊区", "金牛区", "武侯区", "成华区", "龙泉驿区", "青白江区", "新都区", "温江区", "双流区", "郫都区", "金堂县", "大邑县", "蒲江县", "新津县", "都江堰市", "彭州市", "邛崃市", "崇州市", "简阳市"],
  "自贡市": ["自流井区", "贡井区", "大安区", "沿滩区", "荣县", "富顺县"],
  "攀枝花市": ["东区", "西区", "仁和区", "米易县", "盐边县"],
  "泸州市": ["江阳区", "纳溪区", "龙马潭区", "泸县", "合江县", "叙永县", "古蔺县"],
  "德阳市": ["旌阳区", "罗江区", "中江县", "广汉市", "什邡市", "绵竹市"],
  "绵阳市": ["涪城区", "游仙区", "安州区", "三台县", "盐亭县", "梓潼县", "北川羌族自治县", "平武县", "江油市"],
  "广元市": ["利州区", "昭化区", "朝天区", "旺苍县", "青川县", "剑阁县", "苍溪县"],
  "遂宁市": ["船山区", "安居区", "蓬溪县", "射洪县", "大英县"],
  "内江市": ["市中区", "东兴区", "威远县", "资中县", "内江经济开发区", "隆昌市"],
  "乐山市": ["市中区", "沙湾区", "五通桥区", "金口河区", "犍为县", "井研县", "夹江县", "沐川县", "峨边彝族自治县", "马边彝族自治县", "峨眉山市"],
  "南充市": ["顺庆区", "高坪区", "嘉陵区", "南部县", "营山县", "蓬安县", "仪陇县", "西充县", "阆中市"],
  "眉山市": ["东坡区", "彭山区", "仁寿县", "洪雅县", "丹棱县", "青神县"],
  "宜宾市": ["翠屏区", "南溪区", "宜宾县", "江安县", "长宁县", "高县", "珙县", "筠连县", "兴文县", "屏山县"],
  "广安市": ["广安区", "前锋区", "岳池县", "武胜县", "邻水县", "华蓥市"],
  "达州市": ["通川区", "达川区", "宣汉县", "开江县", "大竹县", "渠县", "达州经济开发区", "万源市"],
  "雅安市": ["雨城区", "名山区", "荥经县", "汉源县", "石棉县", "天全县", "芦山县", "宝兴县"],
  "巴中市": ["巴州区", "恩阳区", "通江县", "南江县", "平昌县", "巴中经济开发区"],
  "资阳市": ["雁江区", "安岳县", "乐至县"],
  "阿坝藏族羌族自治州": ["马尔康市", "汶川县", "理县", "茂县", "松潘县", "九寨沟县", "金川县", "小金县", "黑水县", "壤塘县", "阿坝县", "若尔盖县", "红原县"],
  "甘孜藏族自治州": ["康定市", "泸定县", "丹巴县", "九龙县", "雅江县", "道孚县", "炉霍县", "甘孜县", "新龙县", "德格县", "白玉县", "石渠县", "色达县", "理塘县", "巴塘县", "乡城县", "稻城县", "得荣县"],
  "凉山彝族自治州": ["西昌市", "木里藏族自治县", "盐源县", "德昌县", "会理县", "会东县", "宁南县", "普格县", "布拖县", "金阳县", "昭觉县", "喜德县", "冕宁县", "越西县", "甘洛县", "美姑县", "雷波县"],
  "贵阳市": ["南明区", "云岩区", "花溪区", "乌当区", "白云区", "观山湖区", "开阳县", "息烽县", "修文县", "清镇市"],
  "六盘水市": ["钟山区", "六枝特区", "水城县", "盘州市"],
  "遵义市": ["红花岗区", "汇川区", "播州区", "桐梓县", "绥阳县", "正安县", "道真仡佬族苗族自治县", "务川仡佬族苗族自治县", "凤冈县", "湄潭县", "余庆县", "习水县", "赤水市", "仁怀市"],
  "安顺市": ["西秀区", "平坝区", "普定县", "镇宁布依族苗族自治县", "关岭布依族苗族自治县", "紫云苗族布依族自治县"],
  "毕节市": ["七星关区", "大方县", "黔西县", "金沙县", "织金县", "纳雍县", "威宁彝族回族苗族自治县", "赫章县"],
  "铜仁市": ["碧江区", "万山区", "江口县", "玉屏侗族自治县", "石阡县", "思南县", "印江土家族苗族自治县", "德江县", "沿河土家族自治县", "松桃苗族自治县"],
  "黔西南布依族苗族自治州": ["兴义市", "兴仁县", "普安县", "晴隆县", "贞丰县", "望谟县", "册亨县", "安龙县"],
  "黔东南苗族侗族自治州": ["凯里市", "黄平县", "施秉县", "三穗县", "镇远县", "岑巩县", "天柱县", "锦屏县", "剑河县", "台江县", "黎平县", "榕江县", "从江县", "雷山县", "麻江县", "丹寨县"],
  "黔南布依族苗族自治州": ["都匀市", "福泉市", "荔波县", "贵定县", "瓮安县", "独山县", "平塘县", "罗甸县", "长顺县", "龙里县", "惠水县", "三都水族自治县"],
  "昆明市": ["五华区", "盘龙区", "官渡区", "西山区", "东川区", "呈贡区", "晋宁区", "富民县", "宜良县", "石林彝族自治县", "嵩明县", "禄劝彝族苗族自治县", "寻甸回族彝族自治县", "安宁市"],
  "曲靖市": ["麒麟区", "沾益区", "马龙县", "陆良县", "师宗县", "罗平县", "富源县", "会泽县", "宣威市"],
  "玉溪市": ["红塔区", "江川区", "澄江县", "通海县", "华宁县", "易门县", "峨山彝族自治县", "新平彝族傣族自治县", "元江哈尼族彝族傣族自治县"],
  "保山市": ["隆阳区", "施甸县", "龙陵县", "昌宁县", "腾冲市"],
  "昭通市": ["昭阳区", "鲁甸县", "巧家县", "盐津县", "大关县", "永善县", "绥江县", "镇雄县", "彝良县", "威信县", "水富县"],
  "丽江市": ["古城区", "玉龙纳西族自治县", "永胜县", "华坪县", "宁蒗彝族自治县"],
  "普洱市": ["思茅区", "宁洱哈尼族彝族自治县", "墨江哈尼族自治县", "景东彝族自治县", "景谷傣族彝族自治县", "镇沅彝族哈尼族拉祜族自治县", "江城哈尼族彝族自治县", "孟连傣族拉祜族佤族自治县", "澜沧拉祜族自治县", "西盟佤族自治县"],
  "临沧市": ["临翔区", "凤庆县", "云县", "永德县", "镇康县", "双江拉祜族佤族布朗族傣族自治县", "耿马傣族佤族自治县", "沧源佤族自治县"],
  "楚雄彝族自治州": ["楚雄市", "双柏县", "牟定县", "南华县", "姚安县", "大姚县", "永仁县", "元谋县", "武定县", "禄丰县"],
  "红河哈尼族彝族自治州": ["个旧市", "开远市", "蒙自市", "弥勒市", "屏边苗族自治县", "建水县", "石屏县", "泸西县", "元阳县", "红河县", "金平苗族瑶族傣族自治县", "绿春县", "河口瑶族自治县"],
  "文山壮族苗族自治州": ["文山市", "砚山县", "西畴县", "麻栗坡县", "马关县", "丘北县", "广南县", "富宁县"],
  "西双版纳傣族自治州": ["景洪市", "勐海县", "勐腊县"],
  "大理白族自治州": ["大理市", "漾濞彝族自治县", "祥云县", "宾川县", "弥渡县", "南涧彝族自治县", "巍山彝族回族自治县", "永平县", "云龙县", "洱源县", "剑川县", "鹤庆县"],
  "德宏傣族景颇族自治州": ["瑞丽市", "芒市", "梁河县", "盈江县", "陇川县"],
  "怒江傈僳族自治州": ["泸水市", "福贡县", "贡山独龙族怒族自治县", "兰坪白族普米族自治县"],
  "迪庆藏族自治州": ["香格里拉市", "德钦县", "维西傈僳族自治县"],
  "拉萨市": ["城关区", "堆龙德庆区", "林周县", "当雄县", "尼木县", "曲水县", "达孜县", "墨竹工卡县", "格尔木藏青工业园区", "拉萨经济技术开发区", "西藏文化旅游创意园区", "达孜工业园区"],
  "日喀则市": ["桑珠孜区", "南木林县", "江孜县", "定日县", "萨迦县", "拉孜县", "昂仁县", "谢通门县", "白朗县", "仁布县", "康马县", "定结县", "仲巴县", "亚东县", "吉隆县", "聂拉木县", "萨嘎县", "岗巴县"],
  "昌都市": ["卡若区", "江达县", "贡觉县", "类乌齐县", "丁青县", "察雅县", "八宿县", "左贡县", "芒康县", "洛隆县", "边坝县"],
  "林芝市": ["巴宜区", "工布江达县", "米林县", "墨脱县", "波密县", "察隅县", "朗县"],
  "山南市": ["乃东区", "扎囊县", "贡嘎县", "桑日县", "琼结县", "曲松县", "措美县", "洛扎县", "加查县", "隆子县", "错那县", "浪卡子县"],
  "那曲地区": ["那曲县", "嘉黎县", "比如县", "聂荣县", "安多县", "申扎县", "索县", "班戈县", "巴青县", "尼玛县", "双湖县"],
  "阿里地区": ["普兰县", "札达县", "噶尔县", "日土县", "革吉县", "改则县", "措勤县"],
  "西安市": ["新城区", "碑林区", "莲湖区", "灞桥区", "未央区", "雁塔区", "阎良区", "临潼区", "长安区", "高陵区", "鄠邑区", "蓝田县", "周至县"],
  "铜川市": ["王益区", "印台区", "耀州区", "宜君县"],
  "宝鸡市": ["渭滨区", "金台区", "陈仓区", "凤翔县", "岐山县", "扶风县", "眉县", "陇县", "千阳县", "麟游县", "凤县", "太白县"],
  "咸阳市": ["秦都区", "杨陵区", "渭城区", "三原县", "泾阳县", "乾县", "礼泉县", "永寿县", "彬县", "长武县", "旬邑县", "淳化县", "武功县", "兴平市"],
  "渭南市": ["临渭区", "华州区", "潼关县", "大荔县", "合阳县", "澄城县", "蒲城县", "白水县", "富平县", "韩城市", "华阴市"],
  "延安市": ["宝塔区", "安塞区", "延长县", "延川县", "子长县", "志丹县", "吴起县", "甘泉县", "富县", "洛川县", "宜川县", "黄龙县", "黄陵县"],
  "汉中市": ["汉台区", "南郑区", "城固县", "洋县", "西乡县", "勉县", "宁强县", "略阳县", "镇巴县", "留坝县", "佛坪县"],
  "榆林市": ["榆阳区", "横山区", "府谷县", "靖边县", "定边县", "绥德县", "米脂县", "佳县", "吴堡县", "清涧县", "子洲县", "神木市"],
  "安康市": ["汉滨区", "汉阴县", "石泉县", "宁陕县", "紫阳县", "岚皋县", "平利县", "镇坪县", "旬阳县", "白河县"],
  "商洛市": ["商州区", "洛南县", "丹凤县", "商南县", "山阳县", "镇安县", "柞水县"],
  "兰州市": ["城关区", "七里河区", "西固区", "安宁区", "红古区", "永登县", "皋兰县", "榆中县", "兰州新区"],
  "嘉峪关市": ["新城镇", "峪泉镇", "文殊镇", "雄关区", "镜铁区", "长城区"],
  "金昌市": ["金川区", "永昌县"],
  "白银市": ["白银区", "平川区", "靖远县", "会宁县", "景泰县"],
  "天水市": ["秦州区", "麦积区", "清水县", "秦安县", "甘谷县", "武山县", "张家川回族自治县"],
  "武威市": ["凉州区", "民勤县", "古浪县", "天祝藏族自治县"],
  "张掖市": ["甘州区", "肃南裕固族自治县", "民乐县", "临泽县", "高台县", "山丹县"],
  "平凉市": ["崆峒区", "泾川县", "灵台县", "崇信县", "华亭县", "庄浪县", "静宁县", "平凉工业园区"],
  "酒泉市": ["肃州区", "金塔县", "瓜州县", "肃北蒙古族自治县", "阿克塞哈萨克族自治县", "玉门市", "敦煌市"],
  "庆阳市": ["西峰区", "庆城县", "环县", "华池县", "合水县", "正宁县", "宁县", "镇原县"],
  "定西市": ["安定区", "通渭县", "陇西县", "渭源县", "临洮县", "漳县", "岷县"],
  "陇南市": ["武都区", "成县", "文县", "宕昌县", "康县", "西和县", "礼县", "徽县", "两当县"],
  "临夏回族自治州": ["临夏市", "临夏县", "康乐县", "永靖县", "广河县", "和政县", "东乡族自治县", "积石山保安族东乡族撒拉族自治县"],
  "甘南藏族自治州": ["合作市", "临潭县", "卓尼县", "舟曲县", "迭部县", "玛曲县", "碌曲县", "夏河县"],
  "西宁市": ["城东区", "城中区", "城西区", "城北区", "大通回族土族自治县", "湟中县", "湟源县"],
  "海东市": ["乐都区", "平安区", "民和回族土族自治县", "互助土族自治县", "化隆回族自治县", "循化撒拉族自治县"],
  "海北藏族自治州": ["门源回族自治县", "祁连县", "海晏县", "刚察县"],
  "黄南藏族自治州": ["同仁县", "尖扎县", "泽库县", "河南蒙古族自治县"],
  "海南藏族自治州": ["共和县", "同德县", "贵德县", "兴海县", "贵南县"],
  "果洛藏族自治州": ["玛沁县", "班玛县", "甘德县", "达日县", "久治县", "玛多县"],
  "玉树藏族自治州": ["玉树市", "杂多县", "称多县", "治多县", "囊谦县", "曲麻莱县"],
  "海西蒙古族藏族自治州": ["格尔木市", "德令哈市", "乌兰县", "都兰县", "天峻县", "大柴旦行政委员会", "冷湖行政委员会", "茫崖行政委员会"],
  "银川市": ["兴庆区", "西夏区", "金凤区", "永宁县", "贺兰县", "灵武市"],
  "石嘴山市": ["大武口区", "惠农区", "平罗县"],
  "吴忠市": ["利通区", "红寺堡区", "盐池县", "同心县", "青铜峡市"],
  "固原市": ["原州区", "西吉县", "隆德县", "泾源县", "彭阳县"],
  "中卫市": ["沙坡头区", "中宁县", "海原县"],
  "乌鲁木齐市": ["天山区", "沙依巴克区", "新市区", "水磨沟区", "头屯河区", "达坂城区", "米东区", "乌鲁木齐县", "乌鲁木齐经济技术开发区", "乌鲁木齐高新技术产业开发区"],
  "克拉玛依市": ["独山子区", "克拉玛依区", "白碱滩区", "乌尔禾区"],
  "吐鲁番市": ["高昌区", "鄯善县", "托克逊县"],
  "哈密市": ["伊州区", "巴里坤哈萨克自治县", "伊吾县"],
  "昌吉回族自治州": ["昌吉市", "阜康市", "呼图壁县", "玛纳斯县", "奇台县", "吉木萨尔县", "木垒哈萨克自治县"],
  "博尔塔拉蒙古自治州": ["博乐市", "阿拉山口市", "精河县", "温泉县"],
  "巴音郭楞蒙古自治州": ["库尔勒市", "轮台县", "尉犁县", "若羌县", "且末县", "焉耆回族自治县", "和静县", "和硕县", "博湖县", "库尔勒经济技术开发区"],
  "阿克苏地区": ["阿克苏市", "温宿县", "库车县", "沙雅县", "新和县", "拜城县", "乌什县", "阿瓦提县", "柯坪县"],
  "克孜勒苏柯尔克孜自治州": ["阿图什市", "阿克陶县", "阿合奇县", "乌恰县"],
  "喀什地区": ["喀什市", "疏附县", "疏勒县", "英吉沙县", "泽普县", "莎车县", "叶城县", "麦盖提县", "岳普湖县", "伽师县", "巴楚县", "塔什库尔干塔吉克自治县"],
  "和田地区": ["和田市", "和田县", "墨玉县", "皮山县", "洛浦县", "策勒县", "于田县", "民丰县"],
  "伊犁哈萨克自治州": ["伊宁市", "奎屯市", "霍尔果斯市", "伊宁县", "察布查尔锡伯自治县", "霍城县", "巩留县", "新源县", "昭苏县", "特克斯县", "尼勒克县"],
  "塔城地区": ["塔城市", "乌苏市", "额敏县", "沙湾县", "托里县", "裕民县", "和布克赛尔蒙古自治县"],
  "阿勒泰地区": ["阿勒泰市", "布尔津县", "富蕴县", "福海县", "哈巴河县", "青河县", "吉木乃县"],
  "自治区直辖县级行政区划": ["石河子市", "阿拉尔市", "图木舒克市", "五家渠市", "铁门关市"]
}