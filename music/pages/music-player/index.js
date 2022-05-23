// pages/music-player/index.js

import { audioContext, playerStore } from '../../store/index'
const playModeNames = ["order", "repeat", "random"]

Page({
  data: {
    currentSong:{},
    durationTime:0,
    lyricInfos:[],

    playModeIndex: 0,
    playModeName:'order',

    isPlaying: false,
    playingName: "pause",

    currentPage:0,
    contentHeight:0,
    currentTime:0,
    sliderValue:0,
    isSliderChanging: false,
    currentLyricText: "",
    currentLyricIndex: 0,
    lyricScrollTop:0
  },

  onLoad: function (options) {
    // 获得 id
    const id = options.id
    
    // 根据id获取歌曲信息
    this.setupPlayerStoreListener()

    // 动态计算高度
    const globalData = getApp().globalData
    const screenHeight = globalData.screenHeight
    const statusBarHeight = globalData.statusBarHeight
    const navBarHeight = globalData.navBarHeight
    // const deviceRadio = globalData.deviceRadio
    const contentHeight = screenHeight - statusBarHeight - navBarHeight
    this.setData({ contentHeight })
  },

  handleSwiperChange(event) {
    const current = event.detail.current
    this.setData({ currentPage: current })
  },
  handleSliderChange(event) {
    const sliderValue = event.detail.value

    const currentTime = this.data.durationTime * sliderValue / 100
    
    //audioContext.pause()
    audioContext.seek(currentTime / 1000)

    this.setData({sliderValue, isSliderChanging: false })
  },
  handleSliderChanging(event) {
    const sliderValue = event.detail.value
    const currentTime = this.data.durationTime * sliderValue / 100
    this.setData({ isSliderChanging: true, currentTime })
  },
  handleBackBtnClick() {
    wx.navigateBack()
  },
  handleModeBtnClick() {
    let playModeIndex = this.data.playModeIndex + 1
    if(playModeIndex === 3) playModeIndex = 0
    playerStore.setState("playModeIndex", playModeIndex)
  },
  handlePlayBtnClick() {
    playerStore.dispatch("changeMusicPlayStatusAction", !this.data.isPlaying)
  },
  handlePrevBtnClick() {
    playerStore.dispatch("changeNewMusicAction", false)
  },
  handleNextBtnClick() {
    playerStore.dispatch("changeNewMusicAction")
  },
  setupPlayerStoreListener() {
    // 1.监听currentSong/durationTime/lyricInfos
    playerStore.onStates(["currentSong","durationTime","lyricInfos"], ({
      currentSong,
      durationTime,
      lyricInfos
    }) => {
      if (currentSong) this.setData({ currentSong })
      if (durationTime) this.setData({ durationTime })
      if (lyricInfos) this.setData({ lyricInfos })
    })

    // 2.监听currentTime/currentLyricIndex/currentLyricText
    playerStore.onStates(["currentTime", "currentLyricIndex", "currentLyricText"], ({
      currentTime,
      currentLyricIndex,
      currentLyricText
    }) => {
      // 时间变化
      if (currentTime && !this.data.isSliderChanging) {
        const sliderValue = currentTime / this.data.durationTime * 100
        this.setData({ currentTime, sliderValue })
      }
      // 歌词变化
      if (currentLyricIndex) {
        this.setData({ currentLyricIndex, lyricScrollTop: currentLyricIndex * 35 })
      }
      if (currentLyricText) {
        this.setData({ currentLyricText })
      }
    })

    playerStore.onStates(["playModeIndex", "isPlaying"], ({playModeIndex, isPlaying}) => {
      if (playModeIndex !== undefined) {
        this.setData({ 
          playModeIndex, 
          playModeName: playModeNames[playModeIndex] 
        })
      }

      if (isPlaying !== undefined) {
        this.setData({ 
          isPlaying,
          playingName: isPlaying ? "pause": "resume" 
        })
      }
    })
  }
})