
/**
  * [HTTP GET 请求]
  * @param [第1种使用方法是URL不带参数。第2种使用方法是在请求URL后带参数，如：?id=1&name=ming]
  * 1. HTTP.get(url).then((data) => {}).catch((error) => {})
  * 2. HTTP.get({url: url, params: [JSON Object] }).then((data) => {}).catch((error) => {})
  */
export function get (requestHandler) {
  if (typeof requestHandler === 'string') {
    requestHandler = {
      url: String(requestHandler),
      params: {}
    }
  }
  return request('GET', requestHandler)
}
/**
 * [HTTP POST 请求]
 * @param [可自定义 headers，如需 Authorization 等，默认：'Content-Type': 'application/json']
 * HTTP.post({url: url, params: [JSON Object], headers: [JSON Object] }).then((data) => {}).catch((error) => {})
 */
export function post (requestHandler) {
  return request('POST', requestHandler)
}

// request
function request (method, requestHandler) {
  const { url, params, headers, mask, loading } = requestHandler

  if (loading === undefined || loading) {
    wx.showLoading && wx.showLoading({ title: '加载中...', mask: mask || false })
  }

  return new Promise((resolve, reject) => {
    wx.request({
      url: url,
      data: params,
      method: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'].indexOf(method) > -1 ? method : 'GET',
      header: Object.assign({
        'Content-Type': 'application/json'
        /*
         这里可以自定义全局的头信息，这是一个栗子
         'Authorization': 'Bearer ' + wx.getStorageSync('token'),
         'X-Requested-With': 'XMLHttpRequest',
         'Content-Type': 'application/x-www-form-urlencoded'
         */
      }, headers),
      success: function (res) {
        const { data, statusCode } = res
        // 处理数据
        statusCode === 200 ? resolve(data) : reject(data, statusCode)
      },
      fail: function () {
        reject(new Error('Network request failed'))
      },
      complete: function () {
        wx.hideLoading && wx.hideLoading()
      }
    })
  })
}

export default {
  get,
  post
}
