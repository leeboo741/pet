// lee-components/leeLoadingFootItem/index.js
/** ====================================================================== */
/**                                                                        */
/** ============================ loadMore 底部 loading item 组件 ============================== */
/**                                                                        */
/** ====================================================================== */

const LoadFootObj = require("../leeLoadingFootItem/loadFootObj.js") 

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
    show: {
      type: Boolean,
      value: true,
    },
    loadState: {
      type: Number,
      value: LoadFootObj.Loading_State_Normal,
    },
    showBackground: {
      type: Boolean,
      value: true,
    }
  },

  /**
   * 组件的初始数据 内部属性
   */
  data: {
    loadTitle: null,
  },

  /**
   * 属性监听
   */
  observers: {
    "loadState": function (loadState) {
      let loadTitle = "";
      if (loadState == LoadFootObj.Loading_State_Loading) {
        loadTitle = "正在加载中...";
      } else if (loadState == LoadFootObj.Loading_State_End) {
        loadTitle = "已经到底了！";
      } else if (loadState == LoadFootObj.Loading_State_Normal) {
        loadTitle = '上拉加载';
      } else {
        loadTitle = "呀！暂时没有数据";
      }
      this.setData({
        loadTitle: loadTitle
      })
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