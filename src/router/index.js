import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [{
    path: '/',
    redirect: '/inbound',
  },
  // 烟草
  {
    path: '/inbound',
    name: 'inbound',
    component: () => import('../views/inbound/inbound.vue'),
    meta: {
      title: '绑定入库'
    }
  },
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router
