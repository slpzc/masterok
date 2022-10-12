import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/global.scss'

import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.config.productionTip = false

Vue.use(VueAxios, axios)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

// wheres is my anothing and come on to beef ьand dreest for my need
// kame became without bed and bad or nad to succ

// came with out
