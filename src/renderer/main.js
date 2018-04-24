import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import interceptorSetup from './services/interceptors'

import 'element-ui/lib/theme-chalk/index.css'
import '@fortawesome/fontawesome-free-solid'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))

axios.defaults.baseURL = 'http://localhost:3000/v2'

Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false
Vue.use(ElementUI)

interceptorSetup()

Vue.filter('capitalize', function (name) {
  if (!name) return ''
  let values = name
    .toString()
    .replace(/_/g, ' ')
    .split(' ')
  return values.map(n => n.charAt(0).toUpperCase() + n.slice(1)).join(' ')
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
  router,
  store
})
