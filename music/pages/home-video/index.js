import { getTopMvs } from "../../service/api_video"

// pages/home-video/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    topMvs:[],
    hasMore: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    this.getTopMvsData(0)
  },

  async getTopMvsData(offset) {
    if(!this.data.hasMore && offset !== 0) return;

    // 显示导航栏加载动画
    wx.showNavigationBarLoading()

    const res = await getTopMvs(offset)
    let newData = this.data.topMvs

    if(offset === 0) {
      newData = res.data
    } else {
      newData = newData.concat(res.data)
    }
    this.setData({ topMvs: newData })
    this.setData({ hasMore: res.hasMore })

    wx.hideNavigationBarLoading()
    if(offset === 0) {
      // 停止当前页面下拉刷新
      wx.stopPullDownRefresh()
    }
  },
  
  handleVideoItemClick(event) {
    const id = event.currentTarget.dataset.item.id
    wx.navigateTo({
      url: '/pages/detail-video/index?id=' + id,
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: async function () {
    this.getTopMvsData(0)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: async function () {
    this.getTopMvsData(this.data.topMvs.length)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

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

  }
})