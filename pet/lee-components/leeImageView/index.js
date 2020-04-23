// lee-components/leeImageView/index.js

const Image_Load_State_Before = 0;
const Image_Load_State_Success = 1;
const Image_Load_State_Fail = 2;

const Image_Type_Image = 0;
const Image_Type_Video = 1;
const Image_Type_Unkown = -1;

const Image_Content_Style_None = 'none'; // 无样式
const Image_Content_Style_Round = 'round'; // 圆
const Image_Content_Style_Card = 'card'; // 方

Component({

  /** ==================================================== */
  /** ================= 组件数据 Start ==================== */
  /** ==================================================== */

  /**
   * 组件的属性列表
   */
  properties: {
    // video 属性
    videoShowControls: {
      type: Boolean,
      value: false,
    }, // 是否展示 视频控件
    videoAutoPlay: {
      type: Boolean,
      value: false,
    }, // 视频是否 自动播放
    videoMuted: {
      type: Boolean,
      value: true,
    }, // 视频是否静音
    videoShowMuteButton: {
      type: Boolean,
      value: false,
    }, // 是否显示静音按钮
    videoShowProgress: {
      type: Boolean,
      value: null,
    }, // 是否显示 进度条 null时宽度大于240时才会显示
    videoLoop: {
      type: Boolean,
      value: false,
    }, // 是否是否循环播放
    videoShowFullScreenButton: {
      type: Boolean,
      value: false,
    }, // 是否显示全屏按钮
    videoShowBottomPlayButton: {
      type: Boolean,
      value: false,
    }, // 是否显示底部播放按钮
    videoShowCenterPlayButton: {
      type: Boolean,
      value: false,
    }, // 是否显示中间播放按钮

    // image 属性
    lazyLoad: {
      type: Boolean,
      value: true
    }, // 懒加载
    mode: {
      type: String,
      value: "scaleToFill",
    }, // 图片剪裁缩放模式
    failMode: {
      type: String,
      value: 'aspectFit'
    }, // 失败图片裁剪缩放模式
    placeholderMode: {
      type: String,
      value: "aspectFit"
    }, // 占位图片裁剪缩放模式
    failSrc: {
      type: String,
      value: "/lee-components/leeImageView/fail.jpg",
    }, // 加载失败图片地址
    placeholderSrc: {
      type: String,
      value: "/lee-components/leeImageView/placeholder.jpg",
    }, // 占位图地址

    // common
    contentMargin: {
      type: String,
      value: "0rpx, 0rpx, 0rpx, 0rpx",
    }, // 内容边距
    contentStyle: { 
      type: String,
      value: Image_Content_Style_None, // none 无样式 card 方块 round 圆形
    }, // 内容样式

    // 资源对象
    imageSrc: null, // 图片地址

    // 控制
    showPreview: {
      type: Boolean,
      value: false,
    }, // 是否 预览
  },

  /**
   * 组件的初始数据
   */
  data: {
    loadState: Image_Load_State_Before,
    videoTypeList: [
      'mp4',
      "mov",
      "m4v",
      "3gp",
      "avi",
      "m3u8",
      "webm"
    ],
    imageTypeList: [
      'png',
      'jpg',
      'jpeg',
      'gif',
      'bmp'
    ],
    srcType: Image_Type_Unkown,
    src: null,
  },

  /**
   * 属性监听
   */
  observers: {
    'imageSrc': function (imageSrc) {
      this.setData({
        srcType: this.getSrcType(imageSrc),
        src: this.getSrc(imageSrc)
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
    // 图片加载错误
    loadError: function (e) {
      this.setData({
        loadState: Image_Load_State_Fail,
      })
    },
    // 图片加载成功
    load: function (e) {
      this.setData({
        loadState: Image_Load_State_Success,
      })
    },

    /**
     * 获取文件地址
     * @param 文件资源
     */
    getSrc: function(src) {
      if (src != null && typeof src == 'string') {
        return src;
      } else if (src != null && typeof src == 'object') {
        return src.fileAddress;
      } else {
        throw new Error("LeeImageView ==> src 只接收 string 和 object类型数据  当前类型:" + typeof src);
        return null;
      }
    },

    /**
     * 获取文件类型
     * @param 文件资源
     */
    getSrcType: function (src) {
      if (src != null && typeof src == 'string') {
        return this.compareSubVideoType(src);
      } else if (src != null && typeof src == 'object') {
        return this.compareVideoType(src.fileTypeEnum);
      } else {
        throw new Error("LeeImageView ==> src 只接收 string 和 object类型数据  当前类型:" + typeof src);
        return Image_Type_Unkown;
      }
    },

    compareSubVideoType(path) {
      path = path.toLowerCase();
      for (var index = 0; index < this.data.videoTypeList.length; index++) {
        var type = '.' + this.data.videoTypeList[index];
        if (path.indexOf(type) != -1) {
          return Image_Type_Video;
        }
      }
      for (var index = 0; index < this.data.imageTypeList.length; index++) {
        var type = '.' + this.data.imageTypeList[index];
        if (path.indexOf(type) != -1) {
          return Image_Type_Image;
        }
      }
      // throw new Error("LeeImageView ==> 无法读取当前路径文件类型 当前路径:"+path);
      return Image_Type_Image;
    },

    /**
     * 比较类型 确定 文件类型
     * @type 文件类型
     */
    compareVideoType: function (type) {
      type = type.toLowerCase();
      for (var index = 0; index < this.data.videoTypeList.length; index++) {
        var tempType = this.data.videoTypeList[index];
        if (tempType == type) {
          return Image_Type_Video;
        }
      }
      for (var index = 0; index < this.data.imageTypeList.length; index++) {
        var tempType = this.data.imageTypeList[index];
        if (tempType == type) {
          return Image_Type_Image;
        }
      }
      // throw new Error("LeeImageView ==> 无法读取当前路径文件类型 当前路径:"+path);
      return Image_Type_Image;
    },

  },

  /** ==================================================== */
  /** ================= 生命周期 Start ==================== */
  /** ==================================================== */

  /**
   * 生命周期
   */
  created: function () {
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
  externalClasses: ["i-class","i-image-class"],

  /** ==================================================== */
  /** ================= 样式 End ==================== */
  /** ==================================================== */
})
