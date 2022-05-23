import GzRequest from "./index"

export function getSearchHot() {
  return GzRequest.get("/search/hot")
}

export function getSearchSuggest(keywords) {
  return GzRequest.get("/search/suggest", {
    keywords,
    type: "mobile"
  })
}

export function getSearchResult(keywords) {
  return GzRequest.get("/search", {
    keywords
  })
}