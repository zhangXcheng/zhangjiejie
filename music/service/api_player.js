import GzRequest from './index'

export function getSongDetail(ids) {
  return GzRequest.get("/song/detail", {
    ids
  })
}

export function getSongLyric(id) {
  return GzRequest.get("/lyric", {
    id
  })
}