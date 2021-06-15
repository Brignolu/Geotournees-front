import Vue from 'vue'
import App from './App.vue'
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'
import "@/assets/bootstrap.css";
import "@/assets/bootstrap.min.css";
import "@/assets/style.css";
import 'bootstrap-vue/dist/bootstrap-vue.css'
Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)
Vue.config.productionTip = false

let app = new Vue({
  render: h => h(App),
}).$mount('#app')

/*app.config.globalProperties.$filters = {
  splitdate(value) {
    if(!value)return ''
    value = new Date(value);
    var formatDate = value.getDay() + value.getMonth() + value.getFullYear();
    return formatDate
  },
  splittime(value){
    if(!value)return ''
    value = new Date(value);
    var formatDate = value.getHours() + value.getMinutes();
    return formatDate
  }
}*/
global._vm = app;
