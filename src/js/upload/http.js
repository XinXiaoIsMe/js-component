import { isType } from '../utils/type.js'

export default function http(options = {}) {
  const {
    type = 'GET',
    url,
    headers,
    data = null,
    params = {},
    async = true,
    user = null,
    password = null,
    timeout,
    onProgress = function () { },
    onTimeout = function () { }
  } = options

  // eslint-disable-next-line no-console
  console.log(headers)

  let onResolve, onReject
  const res = new Promise((resolve, reject) => {
    onResolve = resolve
    onReject = reject
  })
  const xhr = new XMLHttpRequest()
  const finalUrl = getUrl(url, params)
  xhr.open(type, finalUrl, async, user, password)
  setRequestTimeout(xhr, timeout, onTimeout)
  setRequestHeaders(xhr, headers)
  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200)
      onResolve(xhr.response)
  }
  xhr.onerror = onReject
  xhr.onprogress = onProgress
  xhr.send(data)

  return res
}

http.post = function (url, data, options) {
  return http({
    type: 'POST',
    url,
    data,
    ...options
  })
}

function getUrl(url, params) {
  const queryArr = []
  for (const key in params) {
    if (params.hasOwnProperty(key))
      queryArr.push(`${key}=${params[key]}`)
  }
  return queryArr.length ? `${url}?${queryArr.join('&')}` : url
}

function setRequestHeaders(xhr, headers) {
  for (const key in headers) {
    if (headers.hasOwnProperty(key))
      xhr.setRequestHeader(key, headers[key])
  }
}

function setRequestTimeout(xhr, timeout, onTimeout) {
  if (isType(timeout, 'number')) {
    xhr.timeout = timeout
    xhr.ontimeout = onTimeout
  }
}
