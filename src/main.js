import Vue from 'vue'
import App from './App.vue'
// 点击水波纹插件
import Ripple from 'vue-ripple-directive'
// 图标库
import 'vue-awesome/icons'

// Icon组件
import Icon from 'vue-awesome/components/Icon'
Vue.component('v-icon', Icon)

Vue.config.productionTip = false
Vue.directive('ripple', Ripple)
Vue.component('v-icon', Icon)

// mock假数据
if (process.env.NODE_ENV === 'development') {
  const mock = require('./mock') // eslint-disable-line
}

new Vue({
  render: h => h(App),
}).$mount('#app')
