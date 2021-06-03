import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import TableList from '../views/tableList.vue'
import TableRowInfo from '../views/tableRowInfo'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/list',
    name: 'tableList',
    component: TableList
  },
  {
    path: '/row',
    name: 'rowInfo',
    component: TableRowInfo
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
