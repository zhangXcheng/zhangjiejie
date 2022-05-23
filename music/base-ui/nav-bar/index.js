// base-ui/nav-bar/index.js

const globalData = getApp().globalData

Component({
  options: {
    // 使用多个slot
    multipleSlots: true
  },

  properties: {
    title: {
      type: String,
      value: "默认标题"
    }
  },

  data: {
    statusBarHeight: globalData.statusBarHeight,
    navBarHeight: globalData.navBarHeight
  },

  methods: {
    handleLeftClick() {
      this.triggerEvent('click')
    }
  }
})
