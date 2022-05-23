// app.js
import { getLoginCode, codeToToken, checkToken, checkSession  } from './service/api_login'

App({
  globalData: {
    screenWidth: 0,
    screenHeight: 0,
    statusBarHeight: 0,
    navBarHeight: 44,
    deviceRadio: 0
  },
  onLaunch: function() {
    // 1.获取了设备信息
    const info = wx.getSystemInfoSync()
    this.globalData.screenWidth = info.screenWidth
    this.globalData.screenHeight = info.screenHeight
    this.globalData.statusBarHeight = info.statusBarHeight

    // const deviceRadio = info.screenHeight / info.screenWidth
    // this.globalData.deviceRadio = deviceRadio

    // 2.让用户默认进行登录
    this.handleLogin()
  },
  async handleLogin() {
    const token = wx.getStorageSync('token_key')
    // token有没有过期
    const checkResult = await checkToken(token)
    console.log(checkResult)
    // 判断session是否过期
    const isSessionExpire = await checkSession()

    if (!token || checkResult.errorCode || !isSessionExpire) {
      this.loginAction()
    }
  },
  async loginAction() {
    const code = await getLoginCode()
    console.log(code);

    const result = await codeToToken(code)
    const token = result.token
    wx.setStorageSync('token_key', token)
  }
})
