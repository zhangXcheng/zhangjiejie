const BASE_URL = 'http://123.207.32.32:9001'

const LOGIN_BASE_URL = "http://123.207.32.32:3000"

class GzService {
  constructor(baseURL) {
    this.baseURL = baseURL
  }

  request(url, method, params, header = {}) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: this.baseURL + url,
        method:method,
        data:params,
        header:header,
        success(res) {
          resolve(res.data)
        },
        fail(err) {
          reject(err)
        }
      })
    })
  }

  get(url, params, header) {
    return this.request(url, 'GET', params, header)
  }

  post(url, data, header) {
    return this.request(url, 'POST', data, header)
  }
}

const hyRequest = new GzService(BASE_URL)

const hyLoginRequest = new GzService(LOGIN_BASE_URL)

export default hyRequest
export {
  hyLoginRequest
}