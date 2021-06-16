import Vue from 'vue';
import App from './App.vue';
import VueRouter from "vue-router";
import Vuex from 'vuex'



import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue';
import 'bootstrap-vue/dist/bootstrap-vue.css';

import "@/assets/bootstrap.css";
import "@/assets/bootstrap.min.css";
import "@/assets/style.css";

//Importation des composants
import Login from "@/components/Login";
import Sub from "@/components/Sub";
import Administration from "@/components/Administration";
import Intervention from "@/components/Intervention";

Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);
Vue.use(VueRouter);
Vue.use(Vuex)

Vue.config.productionTip = false;

// Association des routes aux composants
const routes = [
  //  Composant nommé
  { path: '/visualisation', name: 'visualisation', component: Sub },
  { path: '/intervention', name: 'intervention', component: Intervention },
  { path: '/administration', name: 'administration', component: Administration },
  { path: '/', component: Login }
]

// Initialisation du module store
const store = new Vuex.Store({
  state: {
    utilisateur: null
  },
  mutations: {
    login (state, utilisateur) {
      state.utilisateur = utilisateur;
    },
    logout (state){
      state.utilisateur = null
    }
  }
})

// Initialisation du module routeur
const router = new VueRouter({
  routes
})

// Initialisation de vue
let app = new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')

global._vm = app;
