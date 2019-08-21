/**
 * ******** 城市选择页面 ********
 * ===================================================================================================================================
 * 选择城市===================================================================================================================================
 */
const app = getApp()
const config = require("../../../utils/config.js")
Page({
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      cityType: options.cityType,
    })
    if (options.start != null) {
      this.setData({
        startCity: options.start
      })
    }
    app.globalData.trainBeginCity = null;
    app.globalData.trainEndCity = null;
    if (this.data.cityType == "begin") {
      this.requestStartCityData();
    } else {
      this.requestEndCityData();
    }
  },
  /**
   * 请求始发城市数据
   */
  requestStartCityData: function () {
    let that = this;
    wx.showLoading({
      title: '请稍等...',
    })
    wx.request({
      url: config.URL_Service + config.URL_StartCity,
      success (res) {
        that.data.citys = res.data.root.bodys;
        that.data.cityAZ = res.data.root.headers;
        that.setData({
          cityAZ: that.data.cityAZ,
          citys : that.data.citys,
          cityResults: that.data.citys,
        })
      },
      fail (res) {
        wx.showToast({
          title: '获取城市列表失败',
          icon: 'none'
        })
      },
      complete(res) {
        wx.hideLoading();
      }
    })
  },
  /**
   * 请求目的城市列表
   */
  requestEndCityData: function () {
    let that = this;
    wx.showLoading({
      title: '请稍等...',
    })
    wx.request({
      url: config.URL_Service + config.URL_EndCity,
      data: {
        "startCity": this.data.startCity
      },
      success(res) {
        that.data.citys = res.data.root.bodys;
        that.data.cityAZ = res.data.root.headers;
        that.setData({
          cityAZ: that.data.cityAZ,
          citys: that.data.citys,
          cityResults: that.data.citys,
        })
      },
      fail(res) {
        wx.showToast({
          title: '获取城市列表失败',
          icon: 'none'
        })
      },
      complete(res) {
        wx.hideLoading();
      }
    })
  },
  bindAZ: function (e) {
    var currentCityName = e.currentTarget.dataset.id
    var that = this;
    //放入A-Z的scrollTop参数
    if (that.data.scrollAZ == null) {
      wx.createSelectorQuery().selectAll('.city-item-A-Z').fields({
        dataset: true,
        size: true,
        rect: true
      }, function (res) {
        res.forEach(function (re) {
          if (currentCityName == re.dataset.cityname) {
            wx.pageScrollTo({
              scrollTop: re.top + that.data.scrollNow - 55.5,
              duration: 0
            })
          }
        })
      }).exec();
    } else {
      this.data.scrollAZ.forEach(function (re) {
        if (currentCityName == re.dataset.cityname) {
          wx.pageScrollTo({
            scrollTop: re.top + that.data.scrollNow - 55.5,
            duration: 0
          })
        }
      })
    }


  },
  onPageScroll: function (e) { // 获取滚动条当前位置
    this.setData({
      scrollNow: e.scrollTop
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  citySelected: function (e) {
    var cityNameTemp = e.currentTarget.dataset.cityname

    if (this.data.cityType == 'begin') {
      app.globalData.trainBeginCity = cityNameTemp
    }

    if (this.data.cityType == "end") {
      app.globalData.trainEndCity = cityNameTemp
    }

    wx.navigateBack()
  },
  bindSarchInput: function (e) {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 0
    })

    var inputVal = e.detail.value;
    var cityResultsTemp = new Array()
    var citys = this.data.citys;

    if (inputVal == null || inputVal.trim() == '') {
      this.setData({
        cityResults: citys
      })
      return;
    }

    for (var i = 0; i < citys.length; i++) {
      if (citys[i].cityName.indexOf(inputVal) == 0 || citys[i].cityPY.indexOf(inputVal.toLowerCase()) == 0 || citys[i].cityPinYin.indexOf(inputVal.toLowerCase()) == 0) {
        //去除热门城市
        if (citys[i].cityPY.indexOf("#") != -1) {
          continue;
        }
        var ifHas = false;
        for (var j = 0; j < cityResultsTemp.length; j++) {
          if (cityResultsTemp[j] == citys[i]) {
            ifHas = true;
            break;
          }
        }
        if (!ifHas) {
          cityResultsTemp.push(citys[i]);
        }
      }
    }
    this.setData({
      cityResults: cityResultsTemp
    })
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

    console.log("/city/city 销毁")
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    setTimeout(function () {
      wx.stopPullDownRefresh();
    }, 1000)

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
   * 页面的初始数据
   */
  data: {
    startCity: null,
    transport: null,
    scrollAZ: null,
    scrollNow: 0,
    cityType: 'begin',
    cityResults: null,
    cityAZ: null, 
    citys: null,
  }
});