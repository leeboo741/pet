// lee-components/leeShowTime/index.js

/** ====================================================================== */
/**                                                                        */
/** ============================ 倒计时 组件 ============================== */
/**                                                                        */
/** ====================================================================== */
const utils = require("../utils/timeUtils.js")
Component({
  /** ==================================================== */
  /** ================= 组件数据 Start ==================== */
  /** ==================================================== */
  /**
   * 组件的属性列表
   */
  properties: {
    showType:{
      type: String,
      value: "yyyy-MM-dd HH:mm:ss EEE", // 年份（y） 月份（M）日期（d）小时（H|h）分钟（m）秒钟（s）毫秒（S）星期（E） 
    }, // 时间格式
    yearDuration: {
      type: Number,
      value: 0,
    }, // 年份
    monthDuration: {
      type: Number,
      value: 0,
    }, // 月份
    weekDuration: {
      type: Number,
      value: 0,
    }, // 星期
    dayDuration: {
      type: Number,
      value: 0,
    }, // 天数
    hourDuration: {
      type: Number,
      value: 0,
    }, // 小时
    minDuration: {
      type: Number,
      value: 0,
    }, // 分钟
    secDuration: {
      type: Number,
      value: 0,
    }, // 秒数
  },

  /**
   * 组件的初始数据 内部属性
   */
  data: {
    showContent: null, // 展示内容
  },

  /**
   * 属性监听
   */
  observers: {
    "showType,yearDuration,monthDuration,weekDuration,dayDuration,hourDuration,minDuration,secDuration": function (showType, yearDuration, monthDuration, weekDuration, dayDuration, hourDuration, minDuration, secDuration){
      this.setData({
        showContent: utils.dateFormat(utils.getDate(new Date(), 
                                                    yearDuration, 
                                                    monthDuration, 
                                                    weekDuration, 
                                                    dayDuration, 
                                                    hourDuration, 
                                                    minDuration, 
                                                    secDuration), 
                                          showType)
      })
    },
  },

  /** ==================================================== */
  /** ================= 组件数据 End ==================== */
  /** ==================================================== */

  /** ==================================================== */
  /** ================= 方法 Start ==================== */
  /** ==================================================== */

  /**
   * 组件的方法列表
   */
  methods: {

  },

  /** ==================================================== */
  /** ================= 方法 End ==================== */
  /** ==================================================== */

  /** ==================================================== */
  /** ================= 生命周期 Start ==================== */
  /** ==================================================== */

  /**
   * 生命周期
   */
  lifeTimes: {
    created: function () {
      // 在组件实例刚刚被创建时执行
    },
    attached: function () {
      // 在组件实例进入页面节点树时执行
    },
    ready: function () {
      // 在组件在视图层布局完成后执行
    },
    moved: function () {
      // 在组件实例被移动到节点树另一个位置时执行
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    },
    error: function () {
      // 每当组件方法抛出错误时执行
    },
  },
  /**
   * 组件所在页面的生命周期
   */
  pageLifetimes: {
    show: function () {
      // 页面被展示
    },
    hide: function () {
      // 页面被隐藏
    },
    resize: function (size) {
      // 页面尺寸变化
    }
  },

  /** ==================================================== */
  /** ================= 生命周期 End ==================== */
  /** ==================================================== */

  /** ==================================================== */
  /** ================= 样式 Start ==================== */
  /** ==================================================== */

  /**
   * 外部样式类
   */
  externalClasses: ["i-class"],

  /** ==================================================== */
  /** ================= 样式 End ==================== */
  /** ==================================================== */
})
