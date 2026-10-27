/*
* Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.
*
* https://www.mall4j.com/
*
* 未经允许，不可做商业用途！
*
* 版权所有，侵权必究！
*/
import axios from 'axios'
import Qs from 'qs'

// create an axios instance
const service = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  responseType: 'blob',
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 500000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    if (useUserStore().token) {
      config.headers.Authorization = useUserStore().token
    }
    if (config.method === 'get' || config.method === 'GET') {
      config.paramsSerializer = {
        serialize: function (params) {
          return Qs.stringify(params, { arrayFormat: 'repeat' })
        }
      }
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    return response.data
  }
)

export default service
