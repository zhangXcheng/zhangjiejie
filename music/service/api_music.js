import GzRequest from './index'

export function getBanners() {
  return GzRequest.get("/banner", {
    type: 2
  })
}

export function getRankings(idx) {
  return GzRequest.get("/top/list",{
    idx
  })
}

export function getSongMenu(cat = "全部", limit = 6, offset = 0) {
  return GzRequest.get("/top/playlist", {
    cat, limit, offset
  })
}

export function getSongMenuDetail(id) {
  return GzRequest.get("/playlist/detail/dynamic", {
    id
  })
}