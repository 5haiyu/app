import axios from 'axios'
import {
  Toast
} from 'vant'
import router from '../router'
// import {
//   getSign,
//   getParams
// } from '../assets/js/sign'
import store from '../store'
/** **** 创建axios实例 ***** */
const service = axios.create({
  baseURL: process.env.VUE_APP_API, // api的base_url
  timeout: 10000, // 请求超时时间
  headers: {
    'Cache-Control': 'no-cache, no-store',
    Pragma: 'no-cache'
    // Authorization: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzaWduVGltZSI6IjIwMjAxMjE0MDc1MzEzIiwic2VjcmV0IjoiYWNmYjVlMmRhNDdmZmM4MmFkMDQyN2YxYjgyMzljYTc4Y2UxMWQ5NTNmMDdjN2ZhM2FmZjNiMTNhMTc3M2I3YTcyOGYyMDdiNTc3NGRkYThiOGNmMDk4ODQyYzA2ODcyMjM4NjczNmM3ZWVlYjcyOSIsInNpZCI6Im9vX01xNDUyOWUwUHRMSUhxVUtFQmNaY0VUTkkifQ.KuMovNp5x-f6bUJLwh_SzdnnejGYfO2NB3qZoiYubjY'
  }
})
// request 拦截器
service.interceptors.request.use(
  (config) => {
    // 获取token到请求头
    // config.headers.Authorization = localStorage.getItem('token')
    // if (!localStorage.getItem('token')) {
    //   config.headers['Client-Tag'] = 'html'
    // } else {
    //   config.headers['Client-Tag'] = ''
    // }
    // 登录接口和刷新token接口绕过
    // if (config.url.includes('auth/refresh') || config.url.includes('auth/login')) {
    //   // console.log('登录或者刷新token');
    //   if (config.method === 'post') {
    //     signParams = {
    //       ...config.data,
    //       ...getParams()
    //     }
    //     // eslint-disable-next-line no-param-reassign
    //     config.data = {
    //       ...getSign(signParams)
    //     }
    //   } else if (config.method === 'get') {
    //     signParams = {
    //       ...config.params,
    //       ...getParams()
    //     }
    //     // eslint-disable-next-line no-param-reassign
    //     config.params = {
    //       ...getSign(signParams)
    //     }
    //   }
    //   return config
    // }
    store.commit('showLoading')
    console.log(config)
    return config
  }, error => Promise.reject(error)
)

// 响应请求
service.interceptors.response.use(
  (response) => {
    // 关闭loding
    store.commit('hideLoading')
    // console.log('over=', response);
    if (response.status === 200) {
      return Promise.resolve(response.data)
    } else if (response.status === 401) {
      localStorage.removeItem('token')
    }
    return Promise.reject(response)
  },
  // 服务器状态码不是200的情况
  // eslint-disable-next-line consistent-return
  (error) => {
    store.commit('hideLoading')
    if (error.response.status) {
      switch (error.response.status) {
        // 401: 未登录
        case 401:
          // router.replace('/')
          localStorage.removeItem('token')
          break
        case 403:
          Toast({
            message: '登录过期，请重新登录',
            duration: 1000,
            forbidClick: true
          })
          router.push({
            name: "login",
            params: {
              back: 1
            }
          })
          break
        // 404请求不存在
        case 404:
          Toast({
            message: '网络请求不存在',
            duration: 1000,
            forbidClick: true
          })
          break
        case 502:
          Toast({
            message: 'Bad Gateway',
            duration: 1000,
            forbidClick: true
          })
          break
        // 其他错误，直接抛出错误提示
        default:
          console.log('---------', error.response)
          Toast({
            message: error.response.data.message,
            duration: 1500,
            forbidClick: true
          })
      }
      return Promise.reject(error.response)
    }
  }
)
export default service
