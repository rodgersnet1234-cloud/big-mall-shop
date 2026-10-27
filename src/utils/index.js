/*
* Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.
*
* https://www.mall4j.com/
*
* 未经允许，不可做商业用途！
*
* 版权所有，侵权必究！
*/
/**
 * Created by PanJiaChen on 16/11/18.
 */

import Big from 'big.js'

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime (time, cFormat) {
  if (arguments.length === 0 || !time) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string')) {
      if ((/^[0-9]+$/.test(time))) {
        // support "1548221490638"
        time = parseInt(time)
      } else {
        // support safari
        // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
        time = time.replace(/-/gm, '/')
      }
    }

    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  // eslint-disable-next-line no-unused-vars
  const timeStr = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    return value.toString().padStart(2, '0')
  })
  return timeStr
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime (time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function getQueryObject (url) {
  url = url == null ? window.location.href : url
  const search = url.substring(url.lastIndexOf('?') + 1)
  const obj = {}
  const reg = /([^?&=]+)=([^?&=]*)/g
  search.replace(reg, (rs, $1, $2) => {
    const name = decodeURIComponent($1)
    let val = decodeURIComponent($2)
    val = String(val)
    obj[name] = val
    return rs
  })
  return obj
}

/**
 * @param {string} str value
 * @returns {number} output value
 */
export function byteLength (str) {
  // returns the byte length of an utf8 string
  let s = str.length
  for (let i = str.length - 1; i >= 0; i--) {
    const code = str.charCodeAt(i)
    if (code > 0x7f && code <= 0x7ff) s++
    else if (code > 0x7ff && code <= 0xffff) s += 2
    if (code >= 0xDC00 && code <= 0xDFFF) i--
  }
  return s
}

/**
 * @param {Array} actual
 * @returns {Array}
 */
export function cleanArray (actual) {
  const newArray = []
  for (let i = 0; i < actual.length; i++) {
    if (actual[i]) {
      newArray.push(actual[i])
    }
  }
  return newArray
}

/**
 * @param {Object} json
 * @returns {Array}
 */
export function param (json) {
  if (!json) return ''
  return cleanArray(
    Object.keys(json).map(key => {
      if (json[key] === undefined) return ''
      return encodeURIComponent(key) + '=' + encodeURIComponent(json[key])
    })
  ).join('&')
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj (url) {
  const search = decodeURIComponent(url.split('?')[1]).replace(/\+/g, ' ')
  if (!search) {
    return {}
  }
  const obj = {}
  const searchArr = search.split('&')
  searchArr.forEach(v => {
    const index = v.indexOf('=')
    if (index !== -1) {
      const name = v.substring(0, index)
      const val = v.substring(index + 1, v.length)
      obj[name] = val
    }
  })
  return obj
}

/**
 * @param {string} val
 * @returns {string}
 */
export function html2Text (val) {
  const div = document.createElement('div')
  div.innerHTML = val
  return div.textContent || div.innerText
}

/**
 * Merges two objects, giving the last one precedence
 * @param {Object} target
 * @param {(Object|Array)} source
 * @returns {Object}
 */
export function objectMerge (target, source) {
  if (typeof target !== 'object') {
    target = {}
  }
  if (Array.isArray(source)) {
    return source.slice()
  }
  Object.keys(source).forEach(property => {
    const sourceProperty = source[property]
    if (typeof sourceProperty === 'object') {
      target[property] = objectMerge(target[property], sourceProperty)
    } else {
      target[property] = sourceProperty
    }
  })
  return target
}

/**
 * @param {HTMLElement} element
 * @param {string} className
 */
export function toggleClass (element, className) {
  if (!element || !className) {
    return
  }
  let classString = element.className
  const nameIndex = classString.indexOf(className)
  if (nameIndex === -1) {
    classString += '' + className
  } else {
    classString =
      classString.substr(0, nameIndex) +
      classString.substr(nameIndex + className.length)
  }
  element.className = classString
}

/**
 * @param {string} type
 * @returns {Date}
 */
export function getTime (type) {
  if (type === 'start') {
    return new Date().getTime() - 3600 * 1000 * 24 * 90
  } else {
    return new Date(new Date().toDateString())
  }
}

/**
 * @param {Function} func
 * @param {number} wait
 * @param {boolean} immediate
 * @return {*}
 */
export function debounce (func, wait, immediate) {
  let timeout, args, context, timestamp, result

  const later = function () {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp

    // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }

  return function (...args) {
    context = this
    timestamp = +new Date()
    const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }
}

/**
 * This is just a simple version of deep copy
 * Has a lot of edge cases bug
 * If you want to use a perfect deep copy, use lodash's _.cloneDeep
 * @param {Object} source
 * @returns {Object}
 */
export function deepClone (source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'deepClone')
  }
  const targetObj = source.constructor === Array ? [] : {}
  Object.keys(source).forEach(keys => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys])
    } else {
      targetObj[keys] = source[keys]
    }
  })
  return targetObj
}

/**
 * @param {Array} arr
 * @returns {Array}
 */
export function uniqueArr (arr) {
  return Array.from(new Set(arr))
}

/**
 * @returns {string}
 */
export function createUniqueString () {
  const timestamp = +new Date() + ''
  const randomNum = parseInt((1 + Math.random()) * 65536) + ''
  return (+(randomNum + timestamp)).toString(32)
}

/**
 * Check if an element has a class
 * @param {HTMLElement} ele
 * @param {string} cls
 * @returns {boolean}
 */
export function hasClass (ele, cls) {
  return !!ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'))
}

/**
 * Add class to element
 * @param {HTMLElement} ele
 * @param {string} cls
 */
export function addClass (ele, cls) {
  if (!hasClass(ele, cls)) ele.className += ' ' + cls
}

/**
 * Remove class from element
 * @param {HTMLElement} ele
 * @param {string} cls
 */
export function removeClass (ele, cls) {
  if (hasClass(ele, cls)) {
    const reg = new RegExp('(\\s|^)' + cls + '(\\s|$)')
    ele.className = ele.className.replace(reg, ' ')
  }
}

/**
 * 树形数据转换
 * @param {*} data
 * @param {*} id
 * @param {*} pid
 */
export function treeDataTranslate (data, id = 'id', pid = 'parentId') {
  const res = []
  const temp = {}
  for (let i = 0; i < data.length; i++) {
    temp[data[i][id]] = data[i]
  }
  for (let k = 0; k < data.length; k++) {
    if (temp[data[k][pid]] && data[k][id] !== data[k][pid]) {
      if (!temp[data[k][pid]].children) {
        temp[data[k][pid]].children = []
      }
      if (!temp[data[k][pid]]._level) {
        temp[data[k][pid]]._level = 1
      }
      data[k]._level = temp[data[k][pid]]._level + 1
      temp[data[k][pid]].children.push(data[k])
    } else {
      res.push(data[k])
    }
  }
  return res
}

/**
 * 获取uuid
 */
export function getUUID () {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    return (c === 'x' ? (Math.random() * 16 | 0) : ('r&0x3' | '0x8')).toString(16)
  })
}

/**
 * 将数组中的parentId列表取出，倒序排列
 * @param {*} data
 * @param {*} id
 * @param {*} val
 */
export function idList (data, val, id = 'id') {
  const res = []
  idListFromTree(data, val, res, id)
  return res
}

/**
 * @param {*} data
 * @param {*} val
 * @param {*} id
 * @param {*} res
 * @param {*} children
 * @param {*} name
 */
// eslint-disable-next-line max-params
function idListFromTree (data, val, res = [], id = 'id', children = 'children', name = 'name') {
  for (let i = 0; i < data.length; i++) {
    const element = data[i]
    if (element[children]) {
      if (idListFromTree(element[children], val, res, id, children)) {
        res.push({ id: element[id], name: element[name] })
        return true
      }
    }
    if (element[id] === val) {
      res.push({ id: element[id], name: element[name] })
      return true
    }
  }
}

// 计算每个sku后面有多少项
export function getLevels (tree) {
  const level = []
  for (let i = tree.length - 1; i >= 0; i--) {
    if (tree[i + 1] && tree[i + 1].leaf) {
      level[i] = tree[i + 1].leaf.length * level[i + 1] || 1
    } else {
      level[i] = 1
    }
  }
  return level
}

/**
 * 笛卡尔积运算
 * @param  {[type]} tree
 * @param  {Array}  stocks
 * @param  {Object}  options
 * @return {[type]}
 */
export function flatten (tree, stocks = [], options) {
  const { optionValue = 'id', optionText = 'text', extraData = {} } = options || {}
  const result = []
  let skuLen = 0
  const stockMap = {} // 记录已存在的stock的数据
  const level = getLevels(tree)
  if (tree.length === 0) return result
  tree.forEach(sku => {
    const { leaf } = sku
    if (!leaf || leaf.length === 0) return true
    skuLen = (skuLen || 1) * leaf.length
  })
  // 根据已有的stocks生成一个map
  stocks?.forEach(stock => {
    const { spuSkuAttrValues, ...attr } = stock
    stockMap[spuSkuAttrValues.map(item => `${item.attrId}_${item.attrValueId}`).join('|')] = attr
  })
  for (let i = 0; i < skuLen; i++) {
    const spuSkuAttrValues = []
    const mapKey = []
    tree.forEach((sku, column) => {
      const { leaf } = sku
      let item = {}
      if (!leaf || leaf.length === 0) return true
      if (leaf.length > 1) {
        const row = parseInt(i / level[column], 10) % leaf.length
        item = tree[column].leaf[row]
      } else {
        item = tree[column].leaf[0]
      }
      if (!sku[optionValue] || !item[optionValue]) return
      mapKey.push(`${sku[optionValue]}_${item[optionValue]}`)
      spuSkuAttrValues.push({
        attrId: sku[optionValue], // 属性ID
        attrName: sku[optionText], // 属性名称
        attrValueId: item[optionValue], // 属性值ID
        attrValueName: item[optionText] // 属性值
      })
    })
    const { ...data } = stockMap[mapKey.join('|')] || {}
    // 从map中找出存在的sku并保留其值
    result.push({ ...extraData, ...data, spuSkuAttrValues })
  }
  return result
}

/**
 * 清除详情富文本自带样式
 */
export function formatHtml (content) {
  content = content.replace(/<img/gi, '<img style="width:100% !important;height:auto !important;margin:0;display:flex;" ')
  content = content.replace(/style="/gi, 'style="max-width:100% !important;table-layout:fixed;word-wrap:break-word;word-break;break-word;')
  // content = content.replace(/\<table/gi, '<table style="table-layout:fixed;word-wrap:break-word;word-break;break-all;" ');
  // content = content.replace(/\<td/gi, '<td  cellspacing="0" cellpadding="0" border="0" style="display:block;vertical-align:top;margin: 0px; padding: 0px; border: 0px;outline-width:0px;" ');
  content = content.replace(/width=/gi, 'sss=')
  content = content.replace(/height=/gi, 'sss=')
  content = content.replace(/class=/gi, 'sss=')
  content = content.replace(/ \/\\>/gi, ' style="max-width:100% !important;height:auto !important;margin:0;display:block;" \\/\\>')
  return content
}

export function formatPrice (price, type = 0) {
  if (!price) {
    return 0
  }
  Big.DP = 2
  if (type === 0) {
    return +new Big(price).times(100).valueOf()
  }
  return +new Big(price).div(100).valueOf()
}

/**
 * 判断用户是否拥有进入路由页面的权限
 * @param {[]} routeList 用户的权限列表
 * @param {[]} pathArray 需要验证的权路由path组成的数组
 * @returns {boolean} 返回true则表示用户拥有权限，false则用户没有权限
 */
export function isAuth (routeList, pathArray = []) {
  let flag = false
  for (let i = 0; i < routeList.length; i++) {
    // 当该路由path与数组中的首位相同时，从数组中移除首位数据，并将routeList的children作为参数进行递归
    if (routeList[i].path === pathArray[0]) {
      pathArray.shift()
      // 当pathArray中所有数据都找到对应数据，则跳出循环
      if (pathArray.length > 0) {
        if (routeList[i].children && routeList[i].children.length > 0) {
          flag = isAuth(routeList[i].children, pathArray, false)
        }
      } else {
        flag = true
        break
      }
    }
  }
  return flag
}

/**
 * reactive数组响应式赋值
 * @param arr
 * @param data
 */
export function handleArr (arr, data) {
  arr.length = 0
  arr.push(...data)
}

/**
 * 添加图片域名
 * @param path 获取到的文件路径
 */
export function checkFileUrl (path) {
  if (path === '') return ''
  const resourcesUrl = import.meta.env.VITE_APP_RESOURCES_URL
  // 适配el-image 图片组件预览功能
  if (path && typeof path === 'object') {
    // eslint-disable-next-line no-return-assign
    return path.map(el => el = checkFileUrl(el))
  } else {
    if (path && path.indexOf('http') === -1) {
      return resourcesUrl + path
    } else {
      return path
    }
  }
}
export function getDomain () {
  const link = document.createElement('a')
  link.href = window.location.href
  const domain = window.location.protocol + '//' + link.hostname
  return domain
}
