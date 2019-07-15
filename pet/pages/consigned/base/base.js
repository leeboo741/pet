/**
 * ******** 托运页面 ********
 * ===================================================================================================================================
 * 购买托运服务===================================================================================================================================
 */
//获取应用实例
const app = getApp()
var util = require("../../../utils/util.js");

Page({
  data: {
    bannerData: [
      { 
        imgPath: 'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=2313265963,3645707579&fm=26&gp=0.jpg'
      },
      { 
        imgPath: 'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=491368047,2525649626&fm=26&gp=0.jpg'
      }
    ], // banner 数据
    rate: 2, // 保价费率
    totalPrice: 0, // 总计金额
    beginCity: null, // 始发城市
    endCity: null, // 目的城市
    date: null, // 发货日期
    startDate: null, // 选择开始日期
    endDate: null, // 选择结束日期
    week: null, // 发货星期
    petCount: 0, // 发货数量
    petType: null, // 宠物列别
    petClassify: null, // 宠物类型
    petWeight: 0, // 宠物重量
    petTypes: [],
    petClassifys: [],
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
        // transportDescription: "主人陪同坐飞机", // 运输方式说明
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
      name: "购买航空箱", // 增值服务名称
      selected: false, // 是否选中
    },
    addServerReceivePet: {
      name: "上门接宠",
      selected: false, // 是否选中
      address: null, // 地址
    },
    addServerSendPet: {
      name: "送宠到家",
      selected: false, 
      address: null, // 地址
    },
    addServerInsuredPrice: {
      name: "保价",
      selected: false,
      rate: 2, // 费率
      price: 0, // 保价金额
    },
  },

  /* ============================= 页面生命周期 Start ============================== */

  /**
  * 生命周期函数--监听页面加载
  */
  onLoad: function () {
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
    if (app.globalData.trainBeginCity != null) {
      for (let i = 0; i < this.data.transportTypes.length; i++){
        this.data.transportTypes[i].disable = true;
      }
      this.setData({
        beginCity: app.globalData.trainBeginCity,
        endCity: null,
        selectedTransportObj: null,
        transportTypes: this.data.transportTypes
      })
    }
    if (app.globalData.trainEndCity != null) {
      this.setData({
        endCity: app.globalData.trainEndCity,
        selectedTransportObj: null,
      })
      this.checkAbleTransportType();
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

  /* ============================= 页面生命周期 End ============================== */

  /* ============================= 页面事件 Start ============================== */

  /**
   * 购买航空箱
   */
  tapAddServerAirBox: function () {
    this.data.addServerAirBox.selected = !this.data.addServerAirBox.selected;
    this.setData({
      addServerAirBox: this.data.addServerAirBox
    })
    this.predictPrice();
  },

  /**
   * 上门接宠
   */
  tapAddServerReceivePet: function () {
    this.data.addServerReceivePet.selected = !this.data.addServerReceivePet.selected;
    if (!this.data.addServerReceivePet.selected) {
      this.data.addServerReceivePet.address = null
    }
    this.setData({
      addServerReceivePet: this.data.addServerReceivePet
    })
  },

  /**
   * 送宠到家
   */
  tapAddServerSendPet: function () {
    this.data.addServerSendPet.selected = !this.data.addServerSendPet.selected;
    if (!this.data.addServerSendPet.selected) {
      this.data.addServerSendPet.address = null
    }
    this.setData({
      addServerSendPet: this.data.addServerSendPet
    })
  },

  /**
   * 保价
   */
  tapAddServerInsuredPrice: function () {
    this.data.addServerInsuredPrice.selected = !this.data.addServerInsuredPrice.selected;
    if (!this.data.addServerInsuredPrice.selected) {
      this.data.addServerInsuredPrice.price = 0
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
    if (tempInput == null) {
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
    if (tempInput == null) {
      tempInput = 0;
    }
    tempInput = parseInt(tempInput);
    this.setData({
      petWeight: tempInput
    })
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
    wx.makePhoneCall({
      phoneNumber: app.globalData.servicePhone,
    })
  },

  /**
   * 点击预定
   */
  tapTakeOrderAction: function(){
    let tempUrl = '../pay/pay?start=' + this.data.beginCity
                  + '&end=' + this.data.endCity
                  + '&count=' + this.data.petCount
                  + '&type=' + this.data.petType
                  + '&classify=' + this.data.petClassify.petClassifyName
                  + '&weight=' + this.data.petWeight
                  + '&transport=' + this.data.selectedTransportObj.transportId;
    if (this.data.addServerAirBox.selected) {
      tempUrl = tempUrl + "&airbox=1";
    }
    if (this.data.addServerReceivePet.selected) {
      tempUrl = tempUrl + "&receiveaddress=" + this.data.addServerReceivePet.address;
    }
    if (this.data.addServerSendPet.selected) {
      tempUrl = tempUrl + "&sendaddress=" + this.data.addServerSendPet.address;
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
    if (this.data.selectedTransportObj == null) {
      return;
    }
    this.requestPredictPrice();
  },

  /* ============================= 页面事件 End ============================== */

  /* ============================= 网络请求 Start ============================== */

  /**
   * 查询预估金额
   */
  requestPredictPrice: function () {
    wx.showLoading({
      title: '请稍等...',
      icon: 'none'
    })
    let tempData = {
      "openId": app.globalData.userInfo.openid,
      "startCity": this.data.beginCity,
      "endCity": this.data.endCity,
      "transportType": this.data.selectedTransportObj.transportId,
      "weight": this.data.petWeight,
      "num": this.data.petCount,
    };

    if (this.data.addServerSendPet.selected) {
      if (this.data.addServerSendPet.address == null) {
        wx.showToast({
          title: '请输入送宠地址',
          icon: 'none'
        })
        return;
      } else {
        tempData.sendAddress = this.data.addServerSendPet.address;
      }
    }

    if (this.data.addServerReceivePet.selected) {
      if (this.data.addServerReceivePet.address == null) {
        wx.showToast({
          title: '请输入接宠地址',
          icon: 'none'
        })
        return;
      } else {
        tempData.receiptAddress = this.data.addServerReceivePet.address;
      }
    }

    if (this.data.addServerAirBox.selected) {
      tempData.buyAirBox = "1"
    }

    if (this.data.addServerInsuredPrice.selected) {
      if (this.data.addServerInsuredPrice.price == 0) {
        wx.showToast({
          title: '请输入保价金额',
          icon: 'none'
        })
        return;
      } else {
        tempData.insureAmount = this.data.addServerInsuredPrice.price;
      }
    }
    let that = this;
    wx.request({
      url: app.url.url + app.url.predictPrice,
      data: tempData,
      success(res) {
        console.log("获取预估价格 success => \n" + JSON.stringify(res));
        if (res.data.prompt == app.requestPromptValueName.success) {
          that.setData({
            totalPrice: res.data.root
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
      url: app.url.url + app.url.ableTransportType,
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
    let urlstr = app.url.url + app.url.petType;
    // 向服务器请求登陆，返回 本微信 在服务器状态，注册|未注册，
    wx.request({
      url: urlstr, // 服务器地址
      success: res => {
        console.log("success => " + JSON.stringify(res));
        if (res.data.prompt == app.requestPromptValueName.success) {
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
   * 请求宠物种类
   */
  requestPetClassify: function (currentType) {
    let that = this;
    wx.showLoading({
      title: '请稍等...',
    })
    let urlstr = app.url.url + app.url.petClassify;
    // 向服务器请求登陆，返回 本微信 在服务器状态，注册|未注册，
    wx.request({
      url: urlstr, // 服务器地址
      data: {
        "petTypeName": currentType
      },
      success: res => {
        console.log("success => " + JSON.stringify(res));
        if (res.data.prompt == app.requestPromptValueName.success) {
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
   * 请求Banner数据
   */
  requestBanner: function () {

  },

  /**
   * 查询价格
   */
  requestPrice: function() {

  },

  /**
   * 提交预定
   */
  requestOrder: function () {

  },

  /* ============================= 网络请求 End ============================== */
});