import md5 from 'js-md5'

// eslint-disable-next-line import/prefer-default-export
export function getParams () {
  const date = new Date()
  let month = date.getMonth() + 1
  let strDate = date.getDate()
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const seconds = date.getSeconds()
  if (month >= 1 && month <= 9) {
    month = `0${month}`
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = `0${strDate}`
  }
  const reqtime = `${date.getFullYear()}${month}${strDate}${hours}${minutes}${seconds}`
  const appId = 'da110ad717cc11eaa8115254006a5c52'
  const rancode = Math.random().toString(16).substr(6)
  return {
    appId, rancode, reqtime
  }
}
export function getSign (params) {
  const keys = 'deb1aa2a17cc11eaa8115254006a5c52'
  const newkey = Object.keys(params).sort()
  const newObj = {} // 创建一个新的对象，用于存放排好序的键值对
  for (let i = 0; i < newkey.length; i += 1) {
    // 如果是数组就用json，如果是对象就键值对
    if (Object.prototype.toString.call(params[newkey[i]]) === '[object Array]') {
      newObj[newkey[i]] = JSON.stringify(params[newkey[i]])
    } else { // 遍历newkey数组
      newObj[newkey[i]] = params[newkey[i]]
      // 向新创建的对象中按照排好的顺序依次增加键值对}
    }
  }
  let sign = ''
  Object.keys(newObj).map((key) => {
    if (newObj[key] !== '' && newObj[key] !== null && newObj[key] !== undefined) {
      sign = (sign += `${key}=${newObj[key]}&`)
    }
    return sign
  })
  sign += `key=${keys}`
  sign = md5(sign).toLocaleUpperCase()
  return { sign, ...params }
}
