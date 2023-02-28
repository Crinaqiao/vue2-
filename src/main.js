import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/font/iconfont.css'
import './assets/font/home.css'
import axios from 'axios'
// 导入树形依赖
import TreeTable from 'vue-table-with-tree-grid'
// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 获取根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 通过axios请求拦截器添加token 保证拥有获取数据的权限
//interceptors.request就是请求拦截器，config是请求对象
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
// 导入样式表
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

// 挂载
Vue.prototype.$http = axios
Vue.config.productionTip = false
Vue.component('tree-table', TreeTable)
// 将富文本编辑器注册为全局可用的插件
Vue.use(VueQuillEditor)
Vue.filter('formaDate', function (value) {
  var date = new Date(value);
  const Y = date.getFullYear()
  const M = (date.getMonth() + 1 + '').padStart(2, '0') //月份
  const D = (date.getDate() + '').padStart(2, '0') //日
  const h = (date.getHours() + '').padStart(2, '0')//小时
  const m = (date.getMinutes() + '').padStart(2, '0') //分
  const s = (date.getSeconds() + '').padStart(2, '0')//秒
  return `${Y}-${M}-${D} ${h}:${m}:${s}`
}),
  new Vue({
    router,
    render: h => h(App)
  }).$mount('#app')

