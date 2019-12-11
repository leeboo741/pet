// lee-components/leeNavigationBar/index.js

/** ====================================================================== */
/**                                                                        */
/** ============================ 自定义navigationBar 组件 ============================== */
/**                                                                        */
/** ====================================================================== */

const app = getApp();

Component({
  /** ==================================================== */
  /** ================= 组件数据 Start ==================== */
  /** ==================================================== */

  /**
   * 组件设置
   */
  options: {
    addGlobalClass: true, //等价于设置 styleIsolation: apply-shared ，但设置了 styleIsolation 选项后这个选项会失效。apply-shared 表示页面 wxss 样式将影响到自定义组件，但自定义组件 wxss 中指定的样式不会影响页面；
  },
  
  /**
   * 组件的属性列表
   */
  properties: {
    ableFloat: {
      type: Boolean,
      value: false,
    }, // 是否允许悬浮
    backgroundColor: {
      type: String,
      value: "#ffffff"
    }, // 背景色
    title: {
      type: String,
      value: "导航栏"
    }, // 标题
    titleSize: {
      type: Number,
      value: 32,
    }, // 标题字体
    titleWeight: {
      type: String,
      value: "bold",
    }, // 标题字体粗细
    titleColor: {
      type: String,
      value: "#000000"
    }, // 标题文字颜色
    showCustomCenter: {
      type: Boolean,
      value: false,
    }, // 是否使用自定义标题区
    showBackButton: {
      type: Boolean,
      value: true
    }, // 是否展示回退按钮
    showCustomButton: {
      type: Boolean,
      value: false
    }, // 是否展示自定义按钮
    customButtonIconType: {
      type: String,
      value: "home"
    }, // 自定义按钮 图标 类型
    iconBackgroundColor: {
      type: String,
      value: "#ffffff99"
    }, // 按钮背景色
    iconColor: {
      type: String,
      value: "#000000"
    }, // 按钮图标颜色
  },

  /**
   * 组件的初始数据 内部属性
   */
  data: {
    naviHeight: 0,
    naviHeightWithoutStatusbar: 0,
    leftAreaWidth: 0,
    naviLeftPadding: 0,
    naviTopPadding: 0,
    centerAreaWidth: 0,
    menuTop: 0,
    menuHeight: 0,
    menuWidth: 0,
    statusBarHeight: 0,
  },

  /**
   * 属性监听
   */
  observers: {
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
    tapBackButton: function () {
      console.log("tapNaviTitle")
      wx.navigateBack({
        delta: 1
      })
    },
    //回退
    tapCustomButton: function () {
      let callBackFunctionName = 'tapcustom'; // 触发事件 方法名
      let myEventDetail = {}; // detail对象，提供给事件监听函数
      let myEventOption = {
        'bubbles': false, // 事件是否冒泡
        'composed': false, // 事件是否可以穿越组件边界，为false时，事件将只能在引用组件的节点树上触发，不进入其他任何组件内部
        'capturePhase': false, // 事件是否拥有捕获阶段
      }; // 触发事件的选项
      this.triggerEvent(callBackFunctionName, myEventDetail, myEventOption);
    },
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
  },
  attached: function () {
    // 在组件实例进入页面节点树时执行

    // 计划将navigationBar切割成四块
    // 1. statusBar 显示手机信息的地方，空出来 不放任何东西
    // 2. 除去statusBar的区域
    //  1. leftarea 放置回退按钮及其他工具 或者 自定义的左部按钮 的地方 (默认样式打算要和胶囊按钮保持一致)
    //    1. 回退按钮
    //    2. 返回首页按钮
    //    3. 自定义控件 
    //  2. centerarea 放置标题栏 或者 自定义顶部按钮之类 的地方 (占满除左部区域和胶囊区域外的所有地方)
    //    1. 标题栏
    //    2. 自定义控件
    //  3. menuarea 胶囊按钮区域 不能遮挡胶囊按钮，就干脆放个空块占个地方

    // 胶囊相关 px
    let menuButtonObject = wx.getMenuButtonBoundingClientRect();
    let menuTop = menuButtonObject.top; //胶囊顶部坐标
    let menuBottom = menuButtonObject.bottom; // 胶囊底部坐标
    let menuLeft = menuButtonObject.left; // 胶囊左侧坐标
    let menuRight = menuButtonObject.right; // 胶囊右侧坐标
    let menuHeight = menuButtonObject.height; // 胶囊高度
    let menuWidth = menuButtonObject.width; // 胶囊宽度

    // 屏幕相关 px
    let systemInfoObject = wx.getSystemInfoSync();
    let statusBarHeight = systemInfoObject.statusBarHeight; // statusBar 高度
    let windowHeight = systemInfoObject.windowHeight; // 屏幕高度
    let windowWidth = systemInfoObject.windowWidth; // 屏幕宽度

    // 需要计算的 px
    let leftAreaWidth = windowWidth - menuLeft; // 左区宽度
    let naviLeftPadding = windowWidth - menuRight; // navi 左区内容距左距离
    let naviTopPadding = menuTop - statusBarHeight; // navi 据上距离（除去statusBar）
    let centerAreaWidth = windowWidth - (leftAreaWidth * 2); // 中区宽度
    let naviHeight = statusBarHeight + menuHeight + (naviTopPadding * 2); //导航高度
    let naviHeightWithoutStatusbar = menuHeight + (naviTopPadding * 2); // 导航除去statusBar的高度
    let pageHeight = windowHeight - naviHeight; // 屏幕除去navigationBar的高度

    // app Data
    app.globalData.pageHeight = pageHeight;
    app.globalData.naviHeight = naviHeight;
    app.globalData.naviHeightWithoutStatusbar = naviHeightWithoutStatusbar;
    app.globalData.windowWidth = windowWidth;
    app.globalData.windowHeight = windowHeight;

    this.setData({
      naviHeight: naviHeight,
      naviHeightWithoutStatusbar: naviHeightWithoutStatusbar,
      leftAreaWidth: leftAreaWidth,
      naviLeftPadding: naviLeftPadding,
      naviTopPadding: naviTopPadding,
      centerAreaWidth: centerAreaWidth,
      menuTop: menuTop,
      menuHeight: menuHeight,
      menuWidth: menuWidth,
      statusBarHeight: statusBarHeight,
      
    })
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
  lifeTimes: {
    created: function () {
      // 在组件实例刚刚被创建时执行
    },
    attached: function () {
      // 在组件实例进入页面节点树时执行

      // 胶囊相关
      let menuButtonObject = wx.getMenuButtonBoundingClientRect();
      let menuTop = menuButtonObject.top; //胶囊顶部坐标
      let menuHeight = menuButtonObject.height; // 胶囊高度
      let menuLeft = menuButtonObject.left; // 胶囊左侧坐标
      // 屏幕相关
      let statusBarHeight = wx.getSystemInfoSync()['statusBarHeight']; // statusBar 高度
      let windowHeight = wx.getSystemInfoSync()['windowHeight']; // 屏幕高度
      let windowWidth = wx.getSystemInfoSync()['windowWidth']; // 屏幕宽度
      // 能用上的
      let naviHeight = statusBarHeight + menuHeight + (menuTop - statusBarHeight) * 2; //导航高度
      let naviHeightWithoutStatusbar = menuHeight + (menuTop - statusBarHeight) * 2; // 导航除去statusBar的高度
      let pageHeight = windowHeight - naviHeight; // 屏幕除去navigationBar的高度
      let naviWidthWithoutMenu = windowWidth - 

      
      this.setData({
        naviHeight: naviHeight,
        naviTop: naviTop,
        menuHeight: menuHeight
      })
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

