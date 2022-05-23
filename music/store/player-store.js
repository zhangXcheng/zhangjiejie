import { HYEventStore } from 'hy-event-store'
import { getSongDetail, getSongLyric } from '../service/api_player'
import { parseLyric } from '../utils/parse-lyric'

// const audioContext = wx.createInnerAudioContext()
const audioContext = wx.getBackgroundAudioManager()

const playerStore = new HYEventStore({
  state: {
    isFirstPlay: true,
    isStoping: false,

    id: 0,
    currentSong:{},
    durationTime:0,
    lyricInfos:[],

    currentTime: 0,
    currentLyricIndex: 0,
    currentLyricText: "",

    isPlaying: false,

    playModeIndex: 0, // 0: 顺序播放 1: 单曲循环 2: 随机播放
    playListSongs: [],
    playListIndex: 0
  },
  actions: {
    playMusicWithSongIdAction(ctx, { id, isRefresh = false }) {
      if (ctx.id == id && !isRefresh) {
        this.dispatch("changeMusicPlayStatusAction", true)
        return
      }
      ctx.id = id

      // 0.修改播放的状态
      ctx.isPlaying = true
      ctx.currentSong = {}
      ctx.durationTime = 0
      ctx.lyricInfos = []
      ctx.currentTime = 0
      ctx.currentLyricIndex = 0
      ctx.currentLyricText = ""

      // 1.根据id请求数据
      // 请求歌曲详情
      getSongDetail(id).then(res => {
        ctx.currentSong = res.songs[0]
        ctx.durationTime = res.songs[0].dt
        audioContext.title = res.songs[0].name
      })
      // 请求歌词数据
      getSongLyric(id).then(res => {
        const lyricString = res.lrc.lyric
        const lyrics = parseLyric(lyricString)
        ctx.lyricInfos = lyrics
      })

      // 2.使用audioContext播放歌曲
      audioContext.stop()
      audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`
      audioContext.title = id

      // 3.监听audioContext一些事件
      if(ctx.isFirstPlay) {
        this.dispatch("setupAudioContextListenerAction")
        ctx.isFirstPlay = false
      }

      // 4.监听背景音乐暂停/播放/停止（背景音乐关闭）
      // 播放状态
      audioContext.onPlay(() => {
        ctx.isPlaying = true
      })
      // 暂停状态
      audioContext.onPause(() => {
        ctx.isPlaying = false
      })
      audioContext.onStop(() => {
        ctx.isPlaying = false
        ctx.isStoping = true
      })
    },

    setupAudioContextListenerAction(ctx) {
      audioContext.onCanplay(() => {
        audioContext.play()
      })
  
      audioContext.onTimeUpdate(() => {
        const currentTime = audioContext.currentTime * 1000
        ctx.currentTime = currentTime

        if(!ctx.lyricInfos.length) return;
        let i = 0
        for (; i < ctx.lyricInfos.length; i++) {
          const lyricInfo = ctx.lyricInfos[i]
          if (currentTime < lyricInfo.time) {
            break
          }
        }
        // 设置当前歌词的索引和内容
        const currentIndex = i - 1
        
        if (ctx.currentLyricIndex !== currentIndex) {
          const currentLyricInfo = ctx.lyricInfos[currentIndex]
          ctx.currentLyricIndex = currentIndex
          ctx.currentLyricText = currentLyricInfo.text
        }
      })

      // 3.监听歌曲播放完成
      audioContext.onEnded(() => {
        this.dispatch("changeNewMusicAction")
      })
    },
    
    changeMusicPlayStatusAction(ctx, isPlaying = true) {
      ctx.isPlaying = isPlaying
      if (ctx.isPlaying && ctx.isStoping) {
        audioContext.src = `https://music.163.com/song/media/outer/url?id=${ctx.id}.mp3`
        audioContext.title = ctx.currentSong.name
        // audioContext.startTime = ctx.currentTime / 1000
        ctx.isStoping = false
      }
      ctx.isPlaying ? audioContext.play(): audioContext.pause()
    },

    changeNewMusicAction(ctx, isNext = true) {
      let index = ctx.playListIndex
      switch(ctx.playModeIndex) {
        case 0: 
          index = isNext ? index + 1: index - 1
          if(index === ctx.playListSongs.length) index = 0
          if(index === -1)index = ctx.playListSongs.length - 1 
          break;
        case 1: break;
        case 2:
          index = Math.floor(Math.random() * ctx.playListSongs.length) 
          break;
      }
      ctx.playListIndex = index
      let currentSong = ctx.playListSongs[index]

      this.dispatch("playMusicWithSongIdAction", { id: currentSong.id, isRefresh: true })
    }
  }
})

export {
  playerStore,
  audioContext
}
