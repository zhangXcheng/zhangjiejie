import GzRequest from './index'

export function getTopMvs(offset, limit = 10) {
  return GzRequest.get('/top/mv',{offset, limit})
}

export function getMvUrl(id) {
  return GzRequest.get("/mv/url",{ id })
}

export function getMvDetail(mvid) {
  return GzRequest.get("/mv/detail",{ mvid })
}

export function getRelateVideo(id) {
  return GzRequest.get("/related/allvideo",{ id })
}