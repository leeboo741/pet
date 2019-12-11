// component/leeCountDown/index.js

/** ====================================================================== */
/**                                                                        */
/** ============================ 倒计时 组件 ============================== */
/**                                                                        */
/** ====================================================================== */

Component({

  /** ==================================================== */
  /** ================= 组件数据 Start ==================== */
  /** ==================================================== */
  /**
   * 组件的属性列表
   */
  properties: {
    target: {
      type: Number, // 数据类型
      value: 0, // 初始数据
    }, // 倒计时 目标时间
    stopCountDown: {
      type: Boolean,
      value: false,
    }, // 是否停止倒计时
  },

  /**
   * 组件的初始数据 内部属性
   */
  data: {
    intervalID: 0, // 计时器id
    targetTime: 0, // 内部计算用的时间
    timeStr: "00:00:00", // 时间显示
  },

  /**
   * 属性监听
   */
  observers:{
    "target": function (target) {
      this.data.targetTime = target;
      this._formatTimeStr(this.data.targetTime);
      this._startCountDown();
    },
    "stopCountDown": function (stopCountDown) {
      if (stopCountDown) {
        this._stopCountDown();
      } else {
        this._restartCountDown();
      }
    },
  },

  /** ==================================================== */
  /** ================= 组件数据 End ==================== */
  /** ==================================================== */

  /** ==================================================== */
  /** ================= 样式 Start ==================== */
  /** ==================================================== */

  /**
   * 外部样式类
   */
  externalClasses:["i-class"],


  /** ==================================================== */
  /** ================= 样式 End ==================== */
  /** ==================================================== */


  /** ==================================================== */
  /** ================= 生命周期 Start ==================== */
  /** ==================================================== */

  /**
   * 生命周期
   */
  lifeTimes:{
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
  /** ================= 方法 Start ==================== */
  /** ==================================================== */

  /**
   * 组件的方法列表
   */
  methods: {
    
    // 开始倒计时
    _startCountDown() {
      const that = this;
      // 清空计时器
      clearInterval(this.data.intervalID);
      // 重建计时器 开始倒计时
      let tempIntervalID = setInterval(function () {
        that._countDown();
      },1000);
      this.setData({
        intervalID: tempIntervalID,
      })
    },

    // 获取时间Str
    _formatTimeStr: function (timeTarget) {
      let day = 0; // 天
      let hour = 0; // 时
      let min = 0; // 分
      let sec = 0; // 秒if (this.data.targetTime > 0) { // 如果时间大于一秒 变更页面
      let tempCountDownDuration = parseInt(timeTarget / 1000);
      // 天数
      day = parseInt(tempCountDownDuration / (24 * 60 * 60));
      // 小时
      hour = parseInt((tempCountDownDuration % (24 * 60 * 60)) / (60 * 60));
      // 分钟
      min = parseInt(((tempCountDownDuration % (24 * 60 * 60)) % (60 * 60)) / 60);
      // 秒数
      sec = parseInt(((tempCountDownDuration % (24 * 60 * 60)) % (60 * 60)) % 60);
      // 拼接字符串
      let tempStr = "";

      if (day > 0) {
        if (day <= 9) {
          tempStr = "0" + day + "d ";
        } else {
          tempStr = day + "d ";
        }
      }

      if (hour > 0) {
        if (hour <= 9) {
          tempStr = tempStr + "0" + hour + ":";
        } else {
          tempStr = tempStr + hour + ":";
        }
      } else {
        tempStr = tempStr + "00:";
      }

      if (min > 0) {
        if (min <= 9) {
          tempStr = tempStr + "0" + min + ":";
        } else {
          tempStr = tempStr + min + ":";
        }
      } else {
        tempStr = tempStr + "00:";
      }

      if (sec > 0) {
        if (sec <= 9) {
          tempStr = tempStr + "0" + sec;
        } else {
          tempStr = tempStr + sec;
        }
      } else {
        tempStr = tempStr + "00";
      }

      this.setData({
        timeStr: tempStr
      })
    },

    // 倒计时
    _countDown() {
      this.data.targetTime = this.data.targetTime - 1000; // 减一秒
      if (this.data.targetTime > 0) {
        this._formatTimeStr(this.data.targetTime);
      }else {
        this._countDownEndCallBack();
      }
    },

    // 重新开始倒计时
    _restartCountDown: function () {
      this._startCountDown();
      let callBackFunctionName = 'countdown-restart'; // 触发事件 方法名
      let myEventDetail = {}; // detail对象，提供给事件监听函数
      let myEventOption = {
        'bubbles': false, // 事件是否冒泡
        'composed': false, // 事件是否可以穿越组件边界，为false时，事件将只能在引用组件的节点树上触发，不进入其他任何组件内部
        'capturePhase': false, // 事件是否拥有捕获阶段
      }; // 触发事件的选项
      this.triggerEvent(callBackFunctionName, myEventDetail, myEventOption);
    },

    // 暂停倒计时
    _stopCountDown: function () {
      let callBackFunctionName = 'countdown-stop'; // 触发事件 方法名
      let myEventDetail = {}; // detail对象，提供给事件监听函数
      let myEventOption = {
        'bubbles': false, // 事件是否冒泡
        'composed': false, // 事件是否可以穿越组件边界，为false时，事件将只能在引用组件的节点树上触发，不进入其他任何组件内部
        'capturePhase': false, // 事件是否拥有捕获阶段
      }; // 触发事件的选项
      // 结束倒计时定时器
      clearInterval(this.data.intervalID);
      this.triggerEvent(callBackFunctionName, myEventDetail, myEventOption);
    },

    // 倒计时结束
    _countDownEndCallBack: function () {
      this.setData({
        timeStr: "00:00:00",
      })
      let callBackFunctionName = 'countdown-end'; // 触发事件 方法名
      let myEventDetail = {}; // detail对象，提供给事件监听函数
      let myEventOption = {
        'bubbles': false, // 事件是否冒泡
        'composed': false, // 事件是否可以穿越组件边界，为false时，事件将只能在引用组件的节点树上触发，不进入其他任何组件内部
        'capturePhase': false, // 事件是否拥有捕获阶段
      }; // 触发事件的选项
      // 结束倒计时定时器
      clearInterval(this.data.intervalID);
      this.triggerEvent(callBackFunctionName, myEventDetail, myEventOption);
    },
  }

  /** ==================================================== */
  /** ================= 方法 End ==================== */
  /** ==================================================== */

})
