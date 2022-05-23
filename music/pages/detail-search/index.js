// pages/detail-search/index.js
import { getSongMenuDetail } from "../../service/api_music"
import { getSearchHot, getSearchSuggest, getSearchResult } from "../../service/api_search"

import stringToNodes from '../../utils/string2nodes'
import debounce from '../../utils/debounce'
const debounceGetSearchSuggest = debounce(getSearchSuggest, 300)


Page({
  data: {
    hotKeywords: [],
    searchValue:"",
    suggestSongs: [],
    suggestSongsNodes: [],
    resultSongs:[]
  },

  onLoad: function (options) {
    this.getPageData()
  },

  getPageData() {
    getSearchHot().then(res => {
      this.setData({ hotKeywords: res.result.hots })
    })
  },

  handleSearchChange(event) {
    const searchValue = event.detail

    this.setData({searchValue})
    if(!searchValue) {
      this.setData({ suggestSongs: []})
      this.setData({ resultSongs: []})
      debounceGetSearchSuggest.cancel()
      return;
    }

    debounceGetSearchSuggest(searchValue).then(res => {
      // 1.获取建议的关键字歌曲
      const suggestSongs = res.result.allMatch
      this.setData({ suggestSongs })
      if(!suggestSongs) return ;
      // 2.转成node节点
      const suggestKeywords = suggestSongs.map(item => item.keyword)
      const suggestSongsNodes = []
      for(let keyWord of suggestKeywords) {
        const nodes = stringToNodes(keyWord, searchValue)
        suggestSongsNodes.push(nodes)
      }
      this.setData({suggestSongsNodes})
    })
  },
  handleSearchAction() {
    const searchValue = this.data.searchValue

    getSearchResult(searchValue).then(res => {
      this.setData({ resultSongs: res.result.songs })
    })
  },
  handleKeywordItemClick(event) {
    const keyword = event.currentTarget.dataset.keyword
    this.setData({searchValue: keyword})

    this.handleSearchAction()
  }
})