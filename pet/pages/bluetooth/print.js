// pages/bluetooth/print.js
/**，
 * 小程序支持的蓝牙为低功耗蓝牙（BLE），数据量大需分包发送
 */

var app = getApp();
var tsc = require("../../libs/tsc.js");
var esc = require("../../libs/esc.js");
var encode = require("../../libs/encoding.js");

const pagePath = require("../../utils/pagePath.js");
const ShareUtil = require("../../utils/shareUtils.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    sendContent: "",
    looptime: 0,
    currentTime: 1,
    lastData: 0,
    oneTimeData: 0,
    returnResult: "",
    canvasWidth: 180,
    canvasHeight: 180,
    imageSrc: '../../imags/abc_ic_star_black_16dp.png',
    buffSize: [],
    buffIndex: 0,
    printNum: [],
    printNumIndex: 0,
    printerNum: 1,
    currentPrint: 1,
    isReceiptSend: false,
    isLabelSend: false,

    printName: null,

    errorList: [],

    timeOutIntervel: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    this.setData({
      printName: app.BLEInformation.deviceName,
      orderNo: app.globalData.printOrder.orderNo
    })
    wx.notifyBLECharacteristicValueChange({
      deviceId: app.BLEInformation.deviceId,
      serviceId: app.BLEInformation.notifyServiceId,
      characteristicId: app.BLEInformation.notifyCharaterId,
      state: true,
      success: function (res) {
        wx.onBLECharacteristicValueChange(function (r) {
          console.log(`characteristic ${r.characteristicId} has changed, now is ${r}`)
        })
      },
      fail: function (e) {
        console.log(e)
      },
      complete: function (e) {
        console.log(e)
      }
    })
  },

  /**
   * 重选打印机
   */
  changePrinter: function () {
    wx.navigateTo({
      url: pagePath.Path_Print_Search,
    })
  },

  labelTest: function () { //标签测试
    var that = this;

    that.setData({
      isLabelSend: true
    })
    var canvasWidth = that.data.canvasWidth
    var canvasHeight = that.data.canvasHeight
    var command = tsc.jpPrinter.createNew()
    command.setSize(75, 60)
    command.setGap(0)
    command.setCls()
    command.setText(20, 30, "TSS48.BF2", 1, 1, app.globalData.printOrder.transport.startCity + "-" + app.globalData.printOrder.transport.endCity);
    command.setText(20, 150, "TSS24.BF2", 1, 1, "订单编号：" + app.globalData.printOrder.orderNo);
    command.setText(20, 210, "TSS24.BF2", 1, 1, "下单时间：" + app.globalData.printOrder.orderDate + " " + app.globalData.printOrder.orderTime);
    command.setText(20, 270, "TSS24.BF2", 1, 1, "出发时间：" + app.globalData.printOrder.leaveDate);
    let transportTypeStr = "";
    let type = app.globalData.printOrder.transport.transportType;
    if (type == 1) {
      transportTypeStr = "专车";
    } else if (type == 2) {
      transportTypeStr = "铁路";
    } else if (type == 3) {
      transportTypeStr = "单飞";
    } else if (type == 4) {
      transportTypeStr = "随机";
    } else {
      transportTypeStr = "大巴";
    }
    command.setText(20, 330, "TSS24.BF2", 1, 1, "运输方式：" + transportTypeStr);
    command.setText(20, 390, "TSS24.BF2", 1, 1, "宠物：" + app.globalData.printOrder.petType.petTypeName + " -- " + app.globalData.printOrder.petClassify.petClassifyName);
    command.setQR(380, 150, "L", 8, "A", app.globalData.printOrder.orderNo);
    // command.setBarCode(170, 180, "EAN8", 64, 1, 3, 3, "1234567")

    this.data.timeOutIntervel = setTimeout(function(){
      var printThis = this;
      wx.canvasGetImageData({
        canvasId: 'edit_area_canvas',
        x: 0,
        y: 0,
        width: canvasWidth,
        height: canvasHeight,
        success: function (res) {
          console.log("canvasGetImageData success ")
          command.setBitmap(60, 0, 1, res)

        },
        fail: function (res) {
          console.log("canvasGetImageData fail " + JSON.stringify(res))
        },
        complete: function (res) {
          command.setPagePrint()

          that.prepareSend(command.getData())
        }
      }, printThis)

    },3000)
    
  },

  prepareSend: function (buff) { //准备发送，根据每次发送字节数来处理分包数量
    console.log(buff)
    var that = this;
    var time = that.data.oneTimeData
    var looptime = parseInt(buff.length / time);
    var lastData = parseInt(buff.length % time);
    console.log(looptime + "---" + lastData)
    that.setData({
      looptime: looptime + 1,
      lastData: lastData,
      currentTime: 1,
    })
    that.Send(buff)
  },

  queryStatus: function () { //查询打印机状态
    var command = esc.jpPrinter.Query();
    command.getRealtimeStatusTransmission(1);
  },

  Send: function (buff) { //分包发送
    var that = this;

    var currentTime = that.data.currentTime
    var loopTime = that.data.looptime
    var lastData = that.data.lastData
    var onTimeData = that.data.oneTimeData
    var printNum = that.data.printerNum
    var currentPrint = that.data.currentPrint
    var buf
    var dataView
    if (currentTime < loopTime) {
      buf = new ArrayBuffer(onTimeData)
      dataView = new DataView(buf)
      for (var i = 0; i < onTimeData; ++i) {
        dataView.setUint8(i, buff[(currentTime - 1) * onTimeData + i])
      }
    } else {
      buf = new ArrayBuffer(lastData)
      dataView = new DataView(buf)
      for (var i = 0; i < lastData; ++i) {
        dataView.setUint8(i, buff[(currentTime - 1) * onTimeData + i])
      }
    }
    console.log("第" + currentTime + "次发送数据大小为：" + buf.byteLength)
    wx.writeBLECharacteristicValue({
      deviceId: app.BLEInformation.deviceId,
      serviceId: app.BLEInformation.writeServiceId,
      characteristicId: app.BLEInformation.writeCharaterId,
      value: buf,
      success: function (res) {
        console.log("writeBLECharacteristicValue success ")
      },
      fail: function (e) {
        console.log("writeBLECharacteristicValue fail " + JSON.stringify(e))
      },
      complete: function (e) {
        currentTime++
        if (currentTime <= loopTime) {
          that.setData({
            currentTime: currentTime
          })
          that.Send(buff)
        } else {
          wx.showToast({
            title: '已打印' + currentPrint + '张',
          })
          if (currentPrint == printNum) {
            that.setData({
              looptime: 0,
              lastData: 0,
              currentTime: 1,
              isReceiptSend: false,
              isLabelSend: false,
              currentPrint: 1
            })
          } else {
            currentPrint++
            that.setData({
              currentPrint: currentPrint,
              currentTime: 1,
            })
            that.Send(buff)
          }
        }
      }
    })

  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var list = []
    var numList = []
    var j = 0
    for (var i = 20; i < 200; i += 10) {
      list[j] = i;
      j++
    }
    for (var i = 1; i < 10; i++) {
      numList[i - 1] = i
    }
    this.setData({
      buffSize: list,
      oneTimeData: list[0],
      printNum: numList,
      printerNum: numList[0]
    })

    // var that = this
    // wx.getImageInfo({
    //   src: that.data.imageSrc,
    //   success(res) {
    //     console.log(res.width)
    //     console.log(res.height)
    //     that.setData({
    //       canvasWidth: res.width,
    //       canvasHeight: res.height
    //     })
    //   }
    // })
    // that.setData({
    //   canvasWidth: width,
    //   canvasHeight: height
    // })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    
    var width
    var height
    wx.getImageInfo({
      src: that.data.imageSrc,
      success(res) {
        console.log(res.width)
        console.log(res.height)
        width = res.width
        height = res.height
        that.setData({
          canvasWidth: res.width,
          canvasHeight: res.height
        })
      }
    })
    const ctx = wx.createCanvasContext("edit_area_canvas", this);
    // if (app.globalData.platform == "android") {
    //   ctx.translate(width, height)
    //   ctx.rotate(180 * Math.PI / 180)
    // }
    ctx.drawImage(this.data.imageSrc, 0, 0, width, height);
    ctx.draw();
  },

  buffBindChange: function (res) { //更改打印字节数
    var index = res.detail.value
    var time = this.data.buffSize[index]
    this.setData({
      buffIndex: index,
      oneTimeData: time
    })
  },
  printNumBindChange: function (res) { //更改打印份数
    var index = res.detail.value
    var num = this.data.printNum[index]
    this.setData({
      printNumIndex: index,
      printerNum: num
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    clearTimeout(this.data.timeOutIntervel);
    wx.closeBLEConnection({
      deviceId: app.BLEInformation.deviceId,
      success: function (res) {
        console.log("关闭蓝牙成功")
      },
    })
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

    return ShareUtil.getOnShareAppMessageForShareOpenId();
  }
})