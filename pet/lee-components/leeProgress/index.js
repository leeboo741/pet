// lee-components/leeProgress/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    percent: {
      type: Number,
      value: 25, 
    }, // 百分比 int 类型 0-100
    status: {
      type: String,
      value: "normal"
    }, // 进度条样式 custom 自定义 | normal 正常 | success 成功 | wrong 警告 | error 错误
    ableActive: {
      type: Boolean,
      value: false,
    }, // 是否展示动态效果
    strokWidth: {
      type: Number,
      value: 30,
    }, // 进度条宽度 rpx 单位
    progressColor: {
      type: String,
      value: "#2db7f5",
    }, // 进度条颜色 16进制 例如：#ffffff
    showInfoStatus: {
      type: String,
      value: "none",
    }, // 信息展示样式 none 不展示 | left 左边展示 | right 右边展示
  },


  externalClasses: ['i-class'],

  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
