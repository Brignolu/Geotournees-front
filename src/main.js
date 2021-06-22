import Vue from 'vue';
import App from './App.vue';
import VueRouter from "vue-router";
import Vuex from 'vuex';


import {BootstrapVue, BootstrapVueIcons} from 'bootstrap-vue';
import "@/assets/app.scss";


//Importation des composants
import Login from "@/components/Login";
import Sub from "@/components/Sub";
import Administration from "@/components/Administration";
import Intervention from "@/components/Intervention";
import Utilisateur from "@/components/Utilisateur";
import Personne from "@/components/Personne";

Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);
Vue.use(VueRouter);
Vue.use(Vuex);

Vue.config.productionTip = false;

// Association des routes aux composants
const routes = [
    //  Composant nommé
    {path: '/visualisation', name: 'visualisation', component: Sub},
    {path: '/intervention', name: 'intervention', component: Intervention},
    {path: '/administration', name: 'administration', component: Administration},
    {path: '/administration/utilisateur', name: 'utilisateur', component: Utilisateur},
    {path: '/', component: Login},
    {path: '/intervention/abonne',name: 'abonne', component: Personne}
]

// Initialisation du module store
const store = new Vuex.Store({
    state: {
        utilisateur: null,
        message: null,
        mapcenter : [45.9182227,6.1248421]

    },
    mutations: {
        login(state, utilisateur) {
            state.utilisateur = utilisateur;
        },
        logout(state) {
            state.utilisateur = null
        },
        messagecreate(state, message){
            state.message = message
        },
        messagedestroy(state, message){
            state.message = null
        },
        updatemapcenter(state,mapcenter){
            state.mapcenter=mapcenter;
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
