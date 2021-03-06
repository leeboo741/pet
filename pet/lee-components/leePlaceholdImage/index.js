// lee-components/leePlaceholdImage/index.js
/** ====================================================================== */
/**                                                                        */
/** ============================ 带 占位图 的 image 组件 ============================== */
/**                                                                        */
/** ====================================================================== */

const Load_State_Before = 0;
const Load_State_Success = 1;
const Load_State_Fail = 2;

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    failSrc: {
      type: String,
      value: "/lee-components/leePlaceholdImage/fail.jpg",
    },
    placeholderSrc: {
      type: String,
      value: "/lee-components/leePlaceholdImage/placeholder.jpg",
    }, // 占位图地址
    imageSrc: {
      type: String,
      value: null,
    }, // 图片地址
    mode: {
      type: String,
      value: "scaleToFill",
    }, // 图片剪裁缩放模式
    lazyLoad: {
      type: Boolean,
      value: true
    }, // 懒加载
  },

  /**
   * 组件的初始数据 内部属性
   */
  data: {
    loadState: Load_State_Before,
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
    // 图片加载错误
    loadError: function (e) {
      this.setData({
        loadState: Load_State_Fail,
      })
    },
    // 图片加载成功
    load: function (e) {
      this.setData({
        loadState: Load_State_Success,
      })
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
  created: function() {
  },
  attached: function () {
  },
  ready: function () {
  },
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
