import request from '@/utils/request'
import axios from 'axios'
export function getBatchPreSignUrl (fileNames) {
  const fileNamesArr = fileNames.split(',')
  return request({
    url: '/mall4cloud_biz/ua/oss/batch_pre_sign_url',
    method: 'post',
    data: fileNamesArr
  })
}

export function pageFileGroup (param) {
  return request({
    url: '/mall4cloud_biz/mp/attach_file_group/list',
    method: 'get',
    params: param
  })
}

export function getFileGroup (param) {
  return request({
    url: '/mall4cloud_biz/mp/attach_file_group',
    method: 'get',
    params: param
  })
}

export function saveFileGroup (data) {
  return request({
    url: '/mall4cloud_biz/mp/attach_file_group',
    method: 'post',
    data
  })
}

export function updateFileGroup (data) {
  return request({
    url: '/mall4cloud_biz/mp/attach_file_group',
    method: 'put',
    data
  })
}

export function deleteFileGroup (param) {
  return request({
    url: '/mall4cloud_biz/mp/attach_file_group',
    method: 'delete',
    params: param
  })
}

/**
 * minIo上传文件
 * @param {String} url  请求的url
 * @param {File} data 图片文件
 * @param {UploadRequestOptions} 可选参数options
 * @returns {Promise}
 */
export function awsImgUpdate (url, data, options) {
  return axios.put(url, data, {
    onUploadProgress: (progressEvent) => {
      // <el-upload/> 配置上传文件进度
      if (options) {
        const complete = (((progressEvent.loaded / progressEvent.total) * 100) | 0)
        options.onProgress({ percent: complete })
      }
    }
  })
}

// /**
//  * 腾讯云上传文件
//  * @param url 请求的url
//  * @param data 图片文件
//  */
// export function qcloudImgUpdate(url, data) {
//   console.log('腾讯云上传文件请求接口url：', url)
//   return request({
//     headers: {
//       'Content-Type': data.type
//     },
//     url: url,
//     method: 'put',
//     data
//   })
// }
