import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

let myComponentVuex = new Vue({
  render: h => h(App)
}).$mount('#app')
