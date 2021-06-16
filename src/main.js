import Vue from 'vue'
import App from './App.vue'
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import "@/assets/bootstrap.css";
import "@/assets/bootstrap.min.css";
import "@/assets/style.css";

Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)

Vue.config.productionTip = false

let app = new Vue({
  render: h => h(App),
}).$mount('#app')

global._vm = app;
