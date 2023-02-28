import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../components/login'
import home from '../components/home'
import welcome from '../components/welcome'
import users from '../components/user/users'
import Rights from '../components/power/Right'
import roles from '../components/power/roles'
import goods_cate from '../components/goods/goods_cate'
import params from '../components/goods/params'
import good_list from '../components/goods/good_list'
import add from '../components/goods/add'
import orders from '../components/orders/orders'
import report from '../components/report/report'



Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: login
  },
  {
    path: '/home',
    component: home,
    redirect: '/welcome',
    children: [{
      path: '/welcome',
      component: welcome
    },
    {
      path: '/users',
      component: users
    }, {
      path: '/rights',
      component: Rights
    }, {
      path: '/roles',
      component: roles
    },
    {
      path: '/categories',
      component: goods_cate
    },
    {
      path: '/params',
      component: params
    },
    {
      path: '/goods',
      component: good_list
    },
    {
      path: '/goods/add',
      component: add
    }, {
      path: '/orders',
      component: orders
    },
    {
      path: '/reports',
      component: report
    }



    ]
  }
]

const router = new VueRouter({
  routes
})

// 挂载路由守卫beforeEach
router.beforeEach((to, from, next) => {
  // to是目的路径，from是从哪个路径去访问，next表示放行
  if (to.path === '/login') return next();
  const tokenStr = window.sessionStorage.getItem('token');
  if (!tokenStr) return next('/login')
  next()
})
export default router
