import Vue from 'vue'
import Vuelidate from 'vuelidate'
import './plugins/vuetify'
import App from './App.vue'
import './registerServiceWorker'

Vue.config.productionTip = false
Vue.use(Vuelidate)

new Vue({
  render: h => h(App),
}).$mount('#app')
