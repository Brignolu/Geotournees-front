import Vue from 'vue'
import App from './App.vue'
import VueRouter from "vue-router";
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import "@/assets/bootstrap.css";
import "@/assets/bootstrap.min.css";
import "@/assets/style.css";

import Login from "@/components/Login";
import Sub from "@/components/Sub";

Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)
Vue.use(VueRouter)

Vue.config.productionTip = false

// Association des routes aux composants
const routes = [
  //  Composant nommé
  { path: '/visualisation', name: 'visualisation', component: Sub },
  { path: '/', component: Login }
]

// Initialisation du module routeur
const router = new VueRouter({
  routes
})

// Initialisation de vue
let app = new Vue({
  router,
  render: h => h(App),
}).$mount('#app')

global._vm = app;
