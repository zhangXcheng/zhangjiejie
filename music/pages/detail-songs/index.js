// pages/detail-songs/index.js
import { rankingStore } from "../../store/index"
import { getSongMenuDetail } from "../../service/api_music"

Page({
  data: {
    type:"",
    songInfo:[],
    ranking:""
  },

  onLoad: function (options) {
    const type = options.type
    this.setData({type})

    if(type === "rank") {
      const ranking = options.ranking
      this.setData({ranking})
      rankingStore.onState(ranking, this.getRankingDataHanlder)
    } else if(type === "menu") {
      const id = options.id
      getSongMenuDetail(id).then(res => {
        this.setData({songInfo: res.playlist})
      })
    }
    
  },

  onUnload: function () {
     this.data.ranking && rankingStore.offState(this.data.ranking, this.getRankingDataHanlder)
  },

  getRankingDataHanlder(res) {
    this.setData({ songInfo: res })
  } 
  
})