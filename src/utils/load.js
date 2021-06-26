// 防抖
export function debounce (fn, delay = 200) {
  let timer
  return function () {
    const th = this
    const args = arguments
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      timer = null
      fn.apply(th, args)
    }, delay)
  }
}
// 节流
export function throttle (method, delay) {
  let timer = null
  return function () {
    const context = this; const
      args = arguments
    clearTimeout(timer)
    timer = setTimeout(() => {
      method.apply(context, args)
    }, delay)
  }
}
