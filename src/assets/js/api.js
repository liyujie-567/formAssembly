import router from '../../router'
import axios from 'axios'
import { baseUrl } from '../../assets/js/env'
import { Message } from 'view-design'

axios.defaults.timeout = 10000 // 设置请求时间
axios.defaults.baseURL = baseUrl // 设置默认接口地址
axios.defaults.withCredentials = true

// 发送请求
axios.interceptors.request.use(config => {
  return config
}, err => {
  Message.warning('请求超时!')
  return Promise.resolve(err)
})

// 响应拦截
axios.interceptors.response.use(data => {
  if (data.status && data.status === 200) {
    if (data.data.success === false || data.data.success === 'false') {
      Message.warning(data.data.msg)
    } else if (data.data.result === 0) {
      Message.warning('检测到您还未登录,请登录后操作！')
      // 跳转登陆页
      setTimeout(() => {
        router.push({
          path: '/login'
        })
      }, 2000)
    }
  }
  return data
}, err => {
  // 返回错误吗处理
  if (err.response.status === 504 || err.response.status === 404) {
    Message.warning('服务器链接失败！')
  } else {
    Message.warning('未知错误!')
  }
  return Promise.resolve(err)
})

export const postRequest = (url, params) => {
  return axios({
    method: 'post',
    url: url,
    data: params,
    transformRequest: [function (data) {
      let ret = ''
      for (const it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
      return ret
    }],
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}
export const uploadFileRequest = (url, params) => {
  return axios({
    method: 'post',
    url: url,
    data: params,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
export const putRequest = (url, params) => {
  return axios({
    method: 'put',
    url: url,
    data: params,
    transformRequest: [function (data) {
      let ret = ''
      for (const it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
      return ret
    }],
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}
export const deleteRequest = (url) => {
  return axios({
    method: 'delete',
    url: url
  })
}
export const getRequest = (url) => {
  return axios({
    method: 'get',
    url: url
  })
}
