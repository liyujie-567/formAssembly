import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'

import Home from '../views/Home.vue'
import TableList from '../views/tableList.vue'
import TableRowInfo from '../views/tableRowInfo'

import Login from '../components/middlewarePipeline/login'
import Dashboard from '../components/middlewarePipeline/dashboard'
import Movies from '../components/middlewarePipeline/movies'

import guest from './middleware/guest'
import auth from './middleware/auth'
import isSubscribed from './middleware/isSubscribed'
import middlewarePipeline from './middlewarePipeline'

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
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: {
      middleware: [
        guest
      ]
    }
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: Dashboard,
    meta: {
      middleware: [
        auth
      ]
    },
    children: [
      {
        path: '/dashboard/movies',
        name: 'dashboard.movies',
        component: Movies,
        meta: {
          middleware: [
            auth,
            isSubscribed
          ]
        }
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if (!to.meta.middleware) {
    return next()
  }
  const middleware = to.meta.middleware
  const context = {
    to,
    from,
    next,
    store
  }

  return middleware[0]({
    ...context,
    next: middlewarePipeline(context, middleware, 1)
  })
})

export default router
