import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    { path: '/', redirect: '/home' },
    { path: '/', redirect: '/minesweeper' },
    { path: '/home', component: () => import('@/views/home/index') },
    { path: '/minesweeper', component: () => import('@/views/minesweeper/index') },
  ]
})
