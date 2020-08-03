// pages/staffManager/staffManager.js

const Config = require("../../utils/config.js");
const LoginUtil = require("../../utils/loginUtils.js");
const ShareUtil = require("../../utils/shareUtils");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    staffList: [],
  },

  /**
   * 调整职位
   * @param {*} e 
   */
  tapChangeRole: function(e) {
    let index = e.currentTarget.dataset.index;
    let staff = this.data.staffList[index];
    wx.showActionSheet({
      itemList: ['客服','司机'],
      success(res) {
        let role = staff.role;
        if (res.tapIndex == 0) {
          // 客服 2
          console.log(staff.staffName, '调职成客服', Config.Role_Staff_Service)
          role = Config.Role_Staff_Service;
        } else if (res.tapIndex == 1) {
          // 司机 3
          console.log(staff.staffName, '调职成司机', Config.Role_Staff_Diver)
          role = Config.Role_Staff_Diver;
        }
        wx.request({
          url: Config.URL_Service + Config.URL_Edit_Staff,
          data: {
            phone: staff.phone,
            staffSex: staff.sex,
            staffName: staff.staffName,
            staffNo: staff.staffNo,
            role: role
          },
          method: 'PUT',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success(res) {
            console.log(res);
            if (res.data.code == Config.RES_CODE_SUCCESS) {
              wx.startPullDownRefresh({
                success: (res) => {},
              })
            } else {
              wx.showToast({
                title: '请求失败',
                icon: 'none'
              })
            }
          },
          fail(res) {
            console.log(res);
            wx.showToast({
              title: '网络错误',
              icon: 'none'
            })
          }

        })
      }
    })
  },

  /**
   * 移除员工
   * @param {*} e 
   */
  tapRemove: function(e) {
    let index = e.currentTarget.dataset.index;
    let staff = this.data.staffList[index];
    console.log(staff.staffName, "移除");
    wx.showModal({
      title:'确定移除?',
      content: "确定移除员工:" + staff.staffName,
      confirm: "确定",
      cancel: "取消",
      success(res) {
        if (res.confirm) {
          wx.request({
            url: Config.URL_Service + Config.URL_Delete_Staff,
            data: {
              staffNo: staff.staffNo
            },
            method: "PUT",
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success(res) {
              console.log(res);
              if (res.data.code == Config.RES_CODE_SUCCESS) {
                wx.startPullDownRefresh({
                  success: (res) => {},
                })
              } else {
                wx.showToast({
                  title: '请求失败',
                  icon: 'none'
                })
              }
            },
            fail(res){
              console.log(res);
              wx.showToast({
                title: '网络错误',
                icon: 'none'
              })
            }
          })
        }
      }      
    })
  },

  /**
   * 请求员工列表
   */
  requestStaffList: function () {
    wx.showLoading({
      title: '请稍等...',
    })
    let that = this;
    wx.request({
      url: Config.URL_Service + Config.URL_GetSubStaff + LoginUtil.getCustomerNo(),
      success(res) {
        wx.hideLoading();
        console.log("请求下属员工 success: \n" + JSON.stringify(res));
        that.setData({
          staffList: res.data.data
        })
      },
      fail(res) {
        wx.hideLoading();
        console.log("请求下属员工 fail: \n" + JSON.stringify(res));
        wx.showToast({
          title: '系统异常',
          icon: "none"
        })
      },
      complete(res){
        wx.stopPullDownRefresh({
          success: (res) => {},
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.startPullDownRefresh({
      success: (res) => {},
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
    this.requestStaffList();
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