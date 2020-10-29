const { URL_Service, URL_UploadFile, URL_Upload } = require("../../utils/config");
const userManager = require("../../manager/userManager/userManager");
const util = require("../../utils/util");
const loginUtils = require("../../utils/loginUtils");
const pagePath = require("../../utils/pagePath");
const shareUtils = require("../../utils/shareUtils");

// pages/registerStation/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    serviceInfor:[
      { name: '宠物店', value: '宠物店', checked: 'true' },
      { name: '宠物医院', value: '宠物医院'},
      { name: '宠物酒店', value: '宠物酒店' },
      { name: '宠物乐园', value: '宠物乐园' },
      { name: '繁殖户', value: '繁殖户' },
      { name: '猫咖', value: '猫咖' },
      { name: '宠物摄影', value: '宠物摄影' },
      { name: '宠物旅游', value: '宠物旅游' }
    ], //服务类型
    serviceInforStr:null,//服务类型String
    serviceContent:[
      { name: '洗澡美容', value: '洗澡美容', checked: 'true' },
      { name: '医疗保健', value: '医疗保健' },
      { name: '用品销售', value: '用品销售' },
      { name: '宠物寄养', value: '宠物寄养' },
      { name: '训练', value: '训练' },
      { name: '摄影', value: '摄影' },
      { name: '旅游', value: '旅游' },
      { name: '乐园', value: '乐园' },
      { name: '殡葬', value: '殡葬' },
    ] ,//服务内容
    serviceContentString:null,  //服务内容String

    uploadUrl: URL_Service + URL_Upload,

    // idcardImagePath: null, // 身份证
    qrcodeImagePath: null, // 二维码
    licenseImagePath: null, // 营业执照
    photoImagePath: [], // 实体图片

    name: null, // 真实名称
    identifier: null, // 身份证号
    license: null, // 营业执照
    storeName: null, // 店铺名称
    region: [], // 所在区域
    detailAddress: null, // 详细地址
    xieyidx: false, 

    currentAuthType: 0, // 当前认证
  },

  /**
   * 上传图片回传
   * @param {*} e 
   */
  uploadComplete: function(e) {
    let type = e.currentTarget.dataset.type;
    console.log(type, e);
    switch(type) {
      case 'idcard': {
        // this.data.idcardImagePath =  [e.detail.uploadReturnDataList[0].fileAddress]
      } break;
      case 'qrcode': {
        this.data.qrcodeImagePath = util.checkEmpty(e.detail.uploadReturnDataList)?null:[e.detail.uploadReturnDataList[0].fileAddress];
      } break;
      case 'license': {
        this.data.licenseImagePath =  util.checkEmpty(e.detail.uploadReturnDataList)?null:[e.detail.uploadReturnDataList[0].fileAddress];
      } break;
      case 'photo': {
        let tempList = [];
        e.detail.uploadReturnDataList.forEach(item => {
          if (util.checkIsObject(item)) {
            tempList.push(item.fileAddress);
          } else {
            tempList.push(item);
          }
        });
        this.data.photoImagePath =  tempList;
      } break;
    }
  },

  /**
   * 删除图片
   * @param {*} e 
   */
  deleteImage: function(e) {
    let type = e.currentTarget.dataset.type;
    console.log(type, e);
    switch(type) {
      case 'idcard': {
        // this.data.idcardImagePath =  [e.detail.uploadReturnDataList[0].fileAddress]
      } break;
      case 'qrcode': {
        this.data.qrcodeImagePath =  util.checkEmpty(e.detail.uploadReturnDataList)?null:[e.detail.uploadReturnDataList[0].fileAddress];
      } break;
      case 'license': {
        this.data.licenseImagePath =  util.checkEmpty(e.detail.uploadReturnDataList)?null:[e.detail.uploadReturnDataList[0].fileAddress];
      } break;
      case 'photo': {
        let tempList = [];
        e.detail.uploadReturnDataList.forEach(item => {
          if (util.checkIsObject(item)) {
            tempList.push(item.fileAddress);
          } else {
            tempList.push(item);
          }
        });
        this.data.photoImagePath =  tempList;
      } break;
    }
  },

  addNewImage: function(e) {
    let type = e.currentTarget.dataset.type;
    console.log(type, e);
  },

/**
   * 输入名称
   */
  inputName: function(e) {
    this.setData({
      name: e.detail.value
    })
  },

  /**
   * 输入身份证号
   */
  inputIdentifier: function(e) {
    this.setData({
      identifier: e.detail.value
    })
  },

  /**
   * 输入营业执照编号
   */
  inputLicense: function (e) {
    this.setData({
      license: e.detail.value
    })
  },

  /**
   * 输入店铺名称
   */
  inputStoreName: function (e) {
    this.setData({
      storeName: e.detail.value
    })
  },

  /**
   * 选择店铺所在区域
   */
  selectRegion: function (e) {
    this.setData({
      region: e.detail.value
    })
  },

  /**
   * 输入店铺详细地址
   */
  inputDetailAddress: function (e) {
    this.setData({
      detailAddress: e.detail.value
    })
  },

  /**
   * 协议
   */
  radioClick: function (event) {
    var xieyidx = this.data.xieyidx;
    this.setData({ xieyidx: !xieyidx });
  },
/**
   * 服务基础资料
   * 
   */
  checkboxChange: function (e) {
    let es = e.detail.value;
    this.setData({
      serviceInforStr: es.toString()
    })
  },

  /**
   * 服务内容
   */
  checkboxChangeContent: function (e) {
    let es = e.detail.value;
    this.setData({
      serviceContentString: es.toString()
    })
  },

  /**
   * 点击提交
   * @param {*} e 
   */
  tapSubmit: function(e) {
    let submitData = this.getSubmitData();
    if (submitData == null) return;
    wx.showLoading({
      title: '提交中...',
    })
    userManager.authBusiness(submitData, function(success, data){
      wx.hideLoading({
        success: (res) => {},
      })
      if (success) {
        loginUtils.updateCustomer(function (isSuccess){
          wx.switchTab({
            url: pagePath.Path_Me_Index,
          })
        })
      } else {
        wx.showToast({
          title: data,
          icon: 'none'
        })
      }
    })
  },

  /**
   * 组装提交数据
   */
  getSubmitData: function() {
    if (util.checkEmpty(this.data.serviceInforStr)) {
      wx.showToast({
        title: '请选择基础资料',
        icon: 'none'
      })
      return null;
    }
    if (util.checkEmpty(this.data.serviceContentString)) {
      wx.showToast({
        title: '请选择服务内容',
        icon: 'none'
      })
      return null;
    }
    if (util.checkEmpty(this.data.name)) {
      wx.showToast({
        title: '请输入姓名',
        icon: 'none'
      })
      return null;
    }
    if (util.checkEmpty(this.data.identifier)) {
      wx.showToast({
        title: '请输入身份证',
        icon: 'none'
      })
      return null;
    }
    if (util.checkEmpty(this.data.region)) {
      wx.showToast({
        title: '请选择地区',
        icon: 'none'
      })
      return null;
    }
    if (!this.data.xieyidx) {
      wx.showToast({
        title: '请确认协议',
        icon: 'none'
      })
      return null;
    }
    if (this.data.currentAuthType >= 2) {
      if (util.checkEmpty(this.data.license) || util.checkEmpty(this.data.licenseImagePath)) {
        wx.showToast({
          title: "请补全营业执照",
          icon: "none"
        })
        return null;
      }
    }
    if (this.data.currentAuthType >= 3) {
      if (util.checkEmpty(this.data.storeName) || util.checkEmpty(this.data.detailAddress) || util.checkEmpty(this.data.photoImagePath)) {
        wx.showToast({
          title: '请补全店铺信息',
          icon: 'none'
        })
        return null;
      }
    }
    return {
      businessAuthType: 3,
      business: {
        businessNo: loginUtils.getBusinessNo()
      },
      realName: this.data.name,
      idCard: this.data.identifier,
      province: this.data.region[0],
      city: this.data.region[1],
      area: this.data.region[2],
      legalImg: util.checkEmpty(this.data.idcardImagePath)?"":this.data.idcardImagePath[0],
      weChatImg: util.checkEmpty(this.data.qrcodeImagePath)?"":this.data.qrcodeImagePath[0],
      licenseNo: this.data.license,
      licenseImg: util.checkEmpty(this.data.licenseImagePath)?"":this.data.licenseImagePath[0],
      shopName: this.data.storeName,
      detailAddress: this.data.detailAddress,
      baseData: this.data.serviceInforStr,
      services: this.data.serviceContentString,
      shopImg: this.data.photoImagePath
    }
  },
  
  /**
   * 循环遍历基础资料完善
   * erviceInforStr: JSON.parse(baseData),//基础资料
     serviceContentString: JSON.parse(services),  //服务内容
   */
  serviceInfoErgodic: function (){
    let that = this;
    let tempList = this.data.serviceInforStr.split(",");
    if (tempList != null && tempList.length > 0) {
      for (let i = 0; i < this.data.serviceInfor.length;++i){
        for (let j = 0; j < tempList.length; ++j){
          if (this.data.serviceInfor[i].value == tempList[j]){
            var showOneLine = "serviceInfor[" + i + "].checked";
            that.setData({
              [showOneLine]: "true"
            })
          }
        }
      }
    }
  },

  /**
   * 循环遍历服务内容
   */
  serviceContentErgodic:function(){
    let that = this;
    let tempList = this.data.serviceContentString.split(",");
    if (tempList != null && tempList.length>0){
      for (let i = 0; i < this.data.serviceContent.length; ++i) {
        for (let j = 0; j < tempList.length; ++j) {
          if ( this.data.serviceContent[i].value == tempList[j]) {
            var showOneLine = "serviceContent[" + i + "].checked";
            that.setData({
              [showOneLine]: "true"
            })
          }
        }
      }
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '请求中...',
    })
    let that = this;
    userManager.getBusinessAuthInfo(function(success, data) {
      wx.hideLoading({
        success: (res) => {},
      })
      if (success) {
        if (data != null) {
          let regions = [];
          regions.push(data.province);
          regions.push(data.city);
          regions.push(data.area);
          let licenseImagePath = data.licenseImg;
          let licenseNo = data.licenseNo;
          let name = data.realName;
          let storeName = data.shopName;
          let idcardNo = data.idCard;
          let idcardImg = data.legalImg;
          let wechatImg = data.weChatImg;
          let photoImgs = data.shopImg
          let detailAddress = data.detailAddress;
          let serviceInfoStr = data.baseData;
          let serviceContentStr = data.services;
          let currentAuthType = dataSource.businessAuthType;
          that.setData({
            currentAuthType: currentAuthType,
            serviceInforStr: serviceInfoStr?serviceInfoStr:that.data.serviceInforStr,
            serviceContentString: serviceContentStr?serviceContentStr:that.data.serviceContentString,
            idcardImagePath: idcardImg?[idcardImg]:null,
            qrcodeImagePath: wechatImg?[wechatImg]:null,
            licenseImagePath: licenseImagePath?[licenseImagePath]:null,
            photoImagePath: photoImgs,
            name: name,
            identifier: idcardNo,
            license: licenseNo,
            storeName: storeName,
            region: regions?regions:that.data.region,
            detailAddress: detailAddress,
            xieyidx: true
          })
          that.serviceInfoErgodic();
          that.serviceContentErgodic();
        }
      } else {
        wx.showToast({
          title: data,
          icon: 'none'
        })
      }
    })
    let tempServiceInfoList = [];
    let tempServiceContentList = [];
    for (let index = 0; index < this.data.serviceInfor.length; index++) {
      let tempServiceInfo = this.data.serviceInfor[index];
      if (tempServiceInfo.checked == 'true') {
        tempServiceInfoList.push(tempServiceInfo.value);
      }
    }
    for (let index = 0; index < this.data.serviceContent.length; index++) {
      let tempServiceContent = this.data.serviceContent[index];
      if (tempServiceContent.checked == 'true') {
        tempServiceContentList.push(tempServiceContent.value);
      }
    }
    this.setData({
      serviceInforStr: tempServiceInfoList.toString(),
      serviceContentString: tempServiceContentList.toString()
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
    return shareUtils.getOnShareAppMessageForShareOpenId();
  }
})