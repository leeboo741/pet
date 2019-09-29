// pages/bluetooth/search.js
var app = getApp()

const pagePath = require("../../utils/pagePath.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [], // 设备列表
    services: [], // 链接的 蓝牙设备 服务列表
    serviceId: 0, // 可用 服务 id
    writeCharacter: false, // 是否查到 写入 服务
    readCharacter: false, // 是否查到 读取 服务
    notifyCharacter: false, // 是否查到 通知 服务
    isScanning: false // 是否正在扫描蓝牙设备
  },

  /**
   * 开始搜索设备
   */
  startSearch: function () {
    var that = this
    // 初始化小程序蓝牙模块
    wx.openBluetoothAdapter({
      // 初始化成功
      success: function (res) {
        // 获取本机蓝牙适配器状态
        wx.getBluetoothAdapterState({
          success: function (res) {
            // 本机蓝牙可用
            if (res.available) {
              // 正在搜索设备
              if (res.discovering) {
                // 停止搜索设备
                wx.stopBluetoothDevicesDiscovery({
                  success: function (res) {
                    console.log("停止搜索设备" + res)
                  }
                })
              }
              // 检查授权
              that.checkPemission()
            } else { // 本机蓝牙不可用
              wx.showModal({
                title: '提示',
                content: '本机蓝牙不可用',
              })
              wx.stopPullDownRefresh();
            }
          },
        })
      }, 
      // 初始化失败
      fail: function () {
        wx.showModal({
          title: '提示',
          content: '蓝牙初始化失败，请打开蓝牙',
        })
        wx.stopPullDownRefresh();
      }
    })
  },

  /**
   * 检查授权
   * android 6.0以上需授权地理位置权限
   */
  checkPemission: function () {
    var that = this
    // 获取 当前全局存储 蓝牙信息中的 平台信息
    var platform = app.BLEInformation.platform
    // 如果是 ios 平台
    if (platform == "ios") {
       // 设置全局存储中的 平台信息为 ios
      app.globalData.platform = "ios"
      // 获取蓝牙设备
      that.getBluetoothDevices()
    } 
    // 如果是 安卓 平台
    else if (platform == "android") {
      // 设置全局存储中的 平台信息为 ios
      app.globalData.platform = "android"
      console.log(app.getSystem().substring(app.getSystem().length - (app.getSystem().length - 8), app.getSystem().length - (app.getSystem().length - 8) + 1))
      if (app.getSystem().substring(app.getSystem().length - (app.getSystem().length - 8), app.getSystem().length - (app.getSystem().length - 8) + 1) > 5) {
        // 判断权限
        wx.getSetting({
          success: function (res) {
            console.log(res)
            // 是否授权 获取地理位置权限
            if (!res.authSetting['scope.userLocation']) {
              wx.authorize({
                scope: 'scope.userLocation',
                complete: function (res) {
                  // 获取蓝牙设备信息
                  that.getBluetoothDevices()
                }
              })
            } else {
              // 获取蓝牙设备信息
              that.getBluetoothDevices()
            }
          }
        })
      } else {
        // 获取蓝牙设备信息
        that.getBluetoothDevices()
      }
    }
  },

  /**
   * 获取蓝牙设备信息
   */
  getBluetoothDevices: function () {  //获取蓝牙设备信息
    var that = this
    console.log("start search")
    wx.showLoading({
      title: '正在加载',
    })
    that.setData({
      isScanning: true
    })
    // 开始搜索 附近的 蓝牙外围设备
    // 比较耗电 
    // 请在搜索并连接到设备后调用 stop 方法停止搜索
    wx.startBluetoothDevicesDiscovery({
      success: function (res) {
        console.log(res)
        // 开启定时器 轮询 设备
        setTimeout(function () {
          // 获取在小程序蓝牙模块生效期内所有已发现的蓝牙设备
          wx.getBluetoothDevices({
            success: function (res) {
              var devices = []
              var num = 0
              for (var i = 0; i < res.devices.length; ++i) {
                if (res.devices[i].name != "未知设备") {
                  devices[num] = res.devices[i]
                  num++
                }
              }
              // 更新设备列表
              // 更新扫描状态
              that.setData({
                list: devices,
                isScanning: false
              })
              wx.hideLoading()
              wx.stopPullDownRefresh()
            },
          })
        }, 3000)
      },
    })
  },

  /**
   * 点击设备item
   */
  bindViewTap: function (e) {
    var that = this
    // 停止搜索 附近的 蓝牙外围设备
    // 对应上一方法的操作
    wx.stopBluetoothDevicesDiscovery({
      success: function (res) { console.log(res) },
    })
    // 重置状态
    that.setData({
      serviceId: 0,
      writeCharacter: false,
      readCharacter: false,
      notifyCharacter: false
    })
    console.log(e.currentTarget.dataset.title)
    wx.showLoading({
      title: '正在连接',
    })
    // 链接蓝牙设备
    wx.createBLEConnection({
      deviceId: e.currentTarget.dataset.title,
      // 链接成功
      success: function (res) {
        console.log(res)
        // 更新全局保存的 已连接 蓝牙设备 id
        app.BLEInformation.deviceId = e.currentTarget.dataset.title;
        app.BLEInformation.deviceName = e.currentTarget.dataset.name;
        // 获取蓝牙设备 服务 service id
        that.getSeviceId()
      }, 
      // 链接失败
      fail: function (e) {
        wx.showModal({
          title: '提示',
          content: '连接失败',
        })
        console.log(e)
        wx.hideLoading()
      }, 
      // 链接完成
      complete: function (e) {
        console.log(e)
      }
    })
  },

  /**
   * 获取 蓝牙设备 service 服务 id
   */
  getSeviceId: function () {
    var that = this
    var platform = app.BLEInformation.platform
    console.log(app.BLEInformation.deviceId)
    // 获取蓝牙设备所有service(服务)
    wx.getBLEDeviceServices({
      deviceId: app.BLEInformation.deviceId,
      success: function (res) {
        console.log(res)
        that.setData({
          services: res.services
        })
        // 获取蓝牙设备 特征值 信息
        that.getCharacteristics()
      }, fail: function (e) {
        console.log(e)
      }, complete: function (e) {
        console.log(e)
      }
    })
  },

  /**
   * 获取蓝牙设备 特征值 信息
   */
  getCharacteristics: function () {
    var that = this
    var list = that.data.services // 服务
    var num = that.data.serviceId // 服务id(index) 0
    var write = that.data.writeCharacter // 写入服务以获取 false
    var read = that.data.readCharacter // 读取服务以获取 false
    var notify = that.data.notifyCharacter // 通知服务以获取 false
    // 获取蓝牙设备 特征值 信息
    wx.getBLEDeviceCharacteristics({
      deviceId: app.BLEInformation.deviceId,
      serviceId: list[num].uuid,
      success: function (res) {
        console.log(res)
        // 循环 服务 service 特征值
        for (var i = 0; i < res.characteristics.length; ++i) {
          // 服务 特征值 属性列表
          var properties = res.characteristics[i].properties
          // 服务 特征值 uuid
          var item = res.characteristics[i].uuid
          // 如果通知服务未获取 判断 特征值 是否 可通知
          if (!notify) {
            // 如果可通知 记录下来
            if (properties.notify) {
              app.BLEInformation.notifyCharaterId = item // 特征值 id
              app.BLEInformation.notifyServiceId = list[num].uuid // 服务id
              notify = true // 通知服务已获取
            }
          }
          // 如果写入服务未获取 判断 特征值 是否 可写入
          if (!write) {
            // 如果可写入 记录下来
            if (properties.write) {
              app.BLEInformation.writeCharaterId = item // 特征值 id
              app.BLEInformation.writeServiceId = list[num].uuid // 服务id
              write = true // 写入服务已获取
            }
          }
          // 如果读取服务未获取 判断 特征值 是否 可读取
          if (!read) {
            // 如果可读取 记录下来
            if (properties.read) {
              app.BLEInformation.readCharaterId = item // 特征值 id
              app.BLEInformation.readServiceId = list[num].uuid // 服务id
              read = true // 读取服务已获取
            }
          }
        } // 结束循环
        // 是否 写入 读取 通知 同时通过
        // 如果通过 进入打印页面
        // 如果没通过 查下一个服务
        // 如果没通过 并且没有下一服务 弹窗提示
        if (!write || !notify || !read) {
          // 要查询的 服务index + 1
          num++
          that.setData({
            writeCharacter: write,
            readCharacter: read,
            notifyCharacter: notify,
            serviceId: num
          })
          // 如果 已经全部服务 都已经查过了 还是没法 成立 通知外部
          // 如果 没有查询完成全部 服务 ，继续查询
          if (num == list.length) {
            wx.showModal({
              title: '提示',
              content: '找不到该读写的特征值',
            })
          } else {
            that.getCharacteristics()
          }
        } else {
          wx.hideLoading();
          that.openControl()
        }
      }, fail: function (e) {
        console.log(e)
      }, complete: function (e) {
        console.log("write:" + app.BLEInformation.writeCharaterId)
        console.log("read:" + app.BLEInformation.readCharaterId)
        console.log("notify:" + app.BLEInformation.notifyCharaterId)
      }
    })
  },
  openControl: function () {
    wx.navigateTo({
      url: pagePath.Path_Print_Print,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.BLEInformation.platform = app.getPlatform()
    wx.startPullDownRefresh();
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
    // var that = this
    // wx.startPullDownRefresh({})
    this.startSearch()
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