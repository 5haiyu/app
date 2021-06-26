import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'


import './utils/flexible'
import './icons'
// 阿里字体图标
import './assets/iconfont/iconfont.css'

// 复制
import VueClipboard from 'vue-clipboard2'
import './plugins/vant.js'
Vue.use(VueClipboard)

// 注册一个全局自定义指令 `v-focus`
Vue.directive('focus', {
  // 当被绑定的元素插入到 DOM 中时……
  inserted: function (el) {
    // 聚焦元素
    el.focus()
  }
})

Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }
  // global.isInWx = true
  // if (to.query.isInWx) {
  //   global.isInWx = true
  // }
  // if (to.query.latitude) {
  //   localStorage.setItem('latitude', to.query.latitude)
  //   localStorage.setItem('longitude', to.query.longitude)
  // }
  // if (to.query.paymentCode) {
  //   global.payment = to.query.paymentCode
  // localStorage.setItem('payment', to.query.paymentCode)
  // }
  next()
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
