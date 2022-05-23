// pages/home-music/index.js
import { getBanners, getSongMenu } from '../../service/api_music'
import queryRect from "../../utils/query-rect"
import throttle from "../../utils/throttle"
import { rankingStore, rankingMap, playerStore } from "../../store/index"

const throttleQueryRect = throttle(queryRect, 500, { trailing: true })

Page({
  data: {
    swiperHeight:0,
    banners:[],
    recommendSongs:[],
    hotSongMenu:[],
    recommendSongMenu:[],
    rankings:{0: {}, 2: {}, 3: {}},

    currentSong: {},
    isPlaying: false,
    playAnimState: "paused"
  },

  onLoad: function (options) {

    // 获取页面数据
    this.getPageData()

    // 发起共享数据请求
    rankingStore.dispatch("getRankingDataAction")

    this.setupPlayerStoreListener()
  },

  handleSearchClick() {
    wx.navigateTo({
      url: '/pages/detail-search/index',
    })
  },

  handleMoreClick() {
    this.navigateToDetailSongsPage("hotRanking")
  },

  handleRankingItemClick(event) {
    const idx = event.currentTarget.dataset.idx
    const rankingName = rankingMap[idx]
    this.navigateToDetailSongsPage(rankingName)
  },

  handleSongItemClick(event) {
    const currentIndex = event.currentTarget.dataset.index
    playerStore.setState('playListSongs',this.data.recommendSongs)
    playerStore.setState('playListIndex',currentIndex)
  },

  handlePlayBtnClick() {
    playerStore.dispatch("changeMusicPlayStatusAction", !this.data.isPlaying)
  },

  handlePlayBarClick() {
    wx.navigateTo({
      url: '/pages/music-player/index?id=' + this.data.currentSong.id,
    })
  },

  navigateToDetailSongsPage: function(rankingName) {
    wx.navigateTo({
      url: `/pages/detail-songs/index?ranking=${rankingName}&type=rank`,
    })
  },


  //监听图片加载并获得图片高度
  handleSwiperImageLoaded() {
    throttleQueryRect('.swiper-image').then(res => {
      this.setData({swiperHeight: res[0].height})
    })
  },

  setupPlayerStoreListener() {
    rankingStore.onState('hotRanking', res => {
      if(!res.tracks) return;
      const recommendSongs = res.tracks.slice(0, 6)
      this.setData({recommendSongs})
    })

    rankingStore.onState("newRanking", this.getRankingHandler(0))
    rankingStore.onState("originRanking", this.getRankingHandler(2))
    rankingStore.onState("upRanking", this.getRankingHandler(3))
    
    playerStore.onStates(["currentSong", "isPlaying"], ({currentSong, isPlaying}) => {
      if (currentSong) this.setData({ currentSong })
      if (isPlaying !== undefined) {
        this.setData({ 
          isPlaying, 
          playAnimState: isPlaying ? "running": "paused" 
        })
      }
    })
  },

  getPageData() {
    getBanners().then(res => {
      this.setData({ banners: res.banners })
    })

    getSongMenu().then(res => {
      this.setData({ hotSongMenu: res.playlists })
    })

    getSongMenu("华语").then(res => {
      this.setData({ recommendSongMenu: res.playlists })
    })
  },

  // 获得榜单数据
  getRankingHandler(idx) {
    return res => {
      if (Object.keys(res).length === 0) return;
      const name = res.name
      const coverImgUrl = res.coverImgUrl
      const playCount = res.playCount
      const songList = res.tracks.slice(0, 3)
      const rankingObj = {name, coverImgUrl, playCount, songList}
      const newData = {...this.data.rankings, [idx]: rankingObj}
      this.setData({rankings: newData})
    }
  }
})