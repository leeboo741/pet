

/** ====================================================================== */
/**                                                                        */
/** ============================= 日历 组件 ============================== */
/**                                                                        */
/** ====================================================================== */
const timeUtils = require("../utils/timeUtils.js")
Component({
  /** ==================================================== */
  /** ================= 组件数据 Start ==================== */
  /** ==================================================== */
  /**
   * 配置项
   */
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   */
  properties: {
    lightingDayList:{
      type: Array,
      value: [],
    }
  },

  /**
   * 组件的初始数据 内部属性
   */
  data: {
    currentPageDate: null, // 当前页时间
    currentPageTitle: null, // 当前页月份
    today: null, // 今天
    weeks: ["周日","周一","周二","周三","周四","周五","周六"], // 星期
    dayDataSource: [], // 日期数据
  },

  /**
   * 属性监听
   */
  observers: {
    "lightingDayList": function (lightingDayList) {
      this._getDaySource(this.data.currentPageDate);
    }
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

    // 获取 当月 的 日期数据
    _getDaySource: function (date) {
      // 当月 月份
      let tempCurrentPageMonth = date.getMonth() + 1;
      this.setData({
        currentPageTitle: timeUtils.dateFormat(date,"yyyy年MM月")
      })
      // 每月第一天的 星期 | 每月最后一天的 星期 | 当月 天数
      let startWeek = timeUtils.getStartDayForMonth(date).getDay();
      let endWeek = timeUtils.getEndDayForMonth(date).getDay();
      let dayCount = timeUtils.getDayCountForMonth(date);
      let tempDaySource = [];
      // 插入 1号 之前 的空数据
      for (let i = 0; i < startWeek; i++) {
        tempDaySource.push(null);
      }
      // 插入 日期数据
      for (let i = 0; i < dayCount; i++) {
        let dayData = {};
        let tempDate = new Date(date);
        tempDate = tempDate.setDate(i + 1);
        tempDate = new Date(tempDate);
        dayData.date = tempDate;
        dayData.day = tempDate.getDate();
        dayData.month = tempDate.getMonth() + 1;
        dayData.year = tempDate.getFullYear();
        dayData.weeks = tempDate.getDay(); 
        dayData.lightingType = 'default';
        // 如果日期 和 今天日期相符 点亮类型 为 today
        // 其余的 默认为 default
        if (tempDate.getDate() == this.data.today.getDate()
          && tempDate.getFullYear() == this.data.today.getFullYear()
          && tempDate.getMonth() == this.data.today.getMonth()) {
          dayData.lightingType = "today";
        } else {
          // 日期数据 匹配 点亮列表 并
          // 点亮列表是否不空 不空 准备匹配
          if (this.properties.lightingDayList != null
            && this.properties.lightingDayList.length > 0) {
            // 循环点亮列表
            for (let j = 0; j < this.properties.lightingDayList.length; j++) {
              let tempLightingItem = this.properties.lightingDayList[j];
              // 如果时间 能 匹配上
              if (tempLightingItem.day == dayData.day
                && tempLightingItem.month == dayData.month
                && tempLightingItem.year == dayData.year) {
                // 根据点亮类型 赋值
                dayData.lightingType = tempLightingItem.lightingType;
                break;
              } 
            }
          }
        }
        tempDaySource.push(dayData);
      }
      // 插入 本月结束后 的空数据
      for (let i = endWeek; i < 6; i++) {
        tempDaySource.push(null);
      }
      console.log(JSON.stringify(tempDaySource));
      this.setData({
        dayDataSource: tempDaySource
      })
    },

    // 当前页时间
    _setCurrentPageDate: function (monthDuration) {
      let that = this;
      let tempCurrentPageDate = timeUtils.getDate(this.data.currentPageDate, 0, monthDuration, 0, 0, 0, 0, 0);
      this.setData({
        currentPageDate: tempCurrentPageDate,
      })
      this._getDaySource(this.data.currentPageDate);
    } ,

    // 点击日期
    tapDayItem: function (e) {
      let callBackFunctionName = 'calendar-tapday'; // 触发事件 方法名
      let myEventDetail = e; // detail对象，提供给事件监听函数
      let myEventOption = {
        'bubbles': false, // 事件是否冒泡
        'composed': false, // 事件是否可以穿越组件边界，为false时，事件将只能在引用组件的节点树上触发，不进入其他任何组件内部
        'capturePhase': false, // 事件是否拥有捕获阶段
      }; // 触发事件的选项
      if (this.data.dayDataSource[e.currentTarget.dataset.index] != null) {
        this.triggerEvent(callBackFunctionName, myEventDetail, myEventOption);
      }
    },

    /**
     * 月份选择
     */
    tapMonthSelecter: function (e) {
      let type = e.currentTarget.dataset.type;
      if (type == 'last') {
        this._setCurrentPageDate(-1);
      } else {
        this._setCurrentPageDate(1);
      }
    }
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
  created: function () {
    // 在组件实例刚刚被创建时执行
    this.setData({
      today: new Date()
    })
    this._setCurrentPageDate(0);
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
  externalClasses: ["i-class", "i-week-title-class", "i-day-item-empty-class", "i-day-item-class", "i-day-item-title-class", "i-day-item-lighting-class"],

  /** ==================================================== */
  /** ================= 样式 End ==================== */
  /** ==================================================== */
})
