// 返回缩略图地址
import router from '../router'
import {
  Toast
} from 'vant'

export const iconPic = (list) => {
  const item = list.find(element => element.type === 'ICON')
  // console.log(item.url)
  return decodeURIComponent(item.url)
}

// 是否禁止页面滚动
export const bodyOverflow = () => {
  const classList = document.body.classList
  classList.toggle('van-overflow-hidden')
}

// 判断是否需要跳转到登录页
export const validateLogin = (autoRedirect) => {
  const token = localStorage.getItem('token')
  if (!token) {
    Toast({
      message: '请先登录',
      duration: 1500,
      forbidClick: true
    })
    if (autoRedirect) {
      gotoLogin()
    }
    return false
  }
  return true
}

// 跳转到登录页
export const gotoLogin = () => {
  router.push({
    name: 'login',
    params: {
      back: '1'
    }
  })
}

// 获取url指定参数
export const getQueryString = (name) => {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = window.location.hash.split("?")[1].match(reg);
  if (r != null) return unescape(r[2]);
  return null;
}
