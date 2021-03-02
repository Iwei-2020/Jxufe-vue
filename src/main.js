// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// 必须在最开始引入垫片
import 'babel-polyfill'
import './plugins/axios'
import './plugins/element.js'
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import api from "./request/api";
import i18n from './lang'
import echarts from 'echarts'
// 引入全局工具函数
import * as utils from './utils'
// import 'font-awesome/scss/font-awesome.scss'
// 在入口处引入模拟的假数据
import '@/mock'
// 引入完整的饿了么组件库
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'
import './assets/scss/element-variables.scss'
import './icons'
import Common from './utils/common'
import VueParticles from 'vue-particles'
import animated from 'animate.css'
import 'xe-utils'
import VXETable from 'vxe-table'
import 'vxe-table/lib/style.css'
import * as filters from './utils/filter'
import Router from 'vue-router'
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
const originalPush = Router.prototype.push
Router.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}
Vue.use(VXETable)
Vue.use(Common)
Vue.use(animated)
Vue.use(ElementUI)
Vue.use(VueParticles)
// 将http绑定到vue原型上
Vue.prototype.$echarts = echarts
Vue.prototype.$api = api
// 将公共汽车绑定到vue原型上
Vue.prototype.$bus = new Vue()
// Vue 的全局配置
Vue.config.productionTip = false

new Vue({
  i18n,
  router,
  store,
  render: h => h(App)
}).$mount("#app")

