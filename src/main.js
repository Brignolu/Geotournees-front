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
import AfficheAbonnes from "@/components/AfficheAbonnes.vue";
import AfficheUtilisateurs from "@/components/AfficheUtilisateurs";
import axios from "axios";

Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);
Vue.use(VueRouter);
Vue.use(Vuex);


Vue.config.productionTip = false;

// Association des routes aux composants
const routes = [
    //  Composant nommé
    {
        path: '/visualisation', name: 'visualisation', component: Sub, beforeEnter: (to, from, next) => {
            if (store.state.utilisateur === null) {
                next(false);
            } else {
                next();
            }
        }
    },
    {
        path: '/intervention', name: 'intervention', component: Intervention, beforeEnter: (to, from, next) => {
            if (store.state.utilisateur === null || store.state.utilisateur.roleId < 2) {
                next(false);
            } else {
                next();
            }
        }
    },
    {
        path: '/administration', name: 'administration', component: Administration, beforeEnter: (to, from, next) => {
            if (store.state.utilisateur === null || store.state.utilisateur.roleId < 3) {
                next(false);
            } else {
                next();
            }
        }
    },
    {
        path: '/administration/nouvelutilisateur',
        name: 'utilisateur',
        component: Utilisateur,
        beforeEnter: (to, from, next) => {
            if (store.state.utilisateur === null || store.state.utilisateur.roleId < 3) {
                next(false);
            } else {
                next();
            }
        }
    },
    {
        path: '/administration/utilisateurs',
        name: 'utilisateurs',
        component: AfficheUtilisateurs,
        beforeEnter: (to, from, next) => {
            if (store.state.utilisateur === null || store.state.utilisateur.roleId < 3) {
                next(false);
            } else {
                next();
            }
        }
    },

    {
        path: '/administration/abonnes',
        name: 'abonnes',
        component: AfficheAbonnes,
        beforeEnter: (to, from, next) => {
            if (store.state.utilisateur === null || store.state.utilisateur.roleId < 3) {
                next(false);
            } else {
                next();
            }
        }
    },
    {path: '/', component: Login},
    {
        path: '/intervention/nouvelabonne', name: 'abonne', component: Personne, beforeEnter: (to, from, next) => {
            if (store.state.utilisateur === null || store.state.utilisateur.roleId < 2) {
                next(false);
            } else {
                next();
            }
        }
    }
]

// Initialisation du module store
const store = new Vuex.Store({
    state: {
        utilisateur: null,
        message: null,
        mapcenter: [46.0736617, 6.4048087],
        zoom: 9,
        datalist: null,

    },
    mutations: {
        login(state, utilisateur) {
            state.utilisateur = utilisateur;
        },
        logout(state) {
            state.utilisateur = null
        },
        messagecreate(state, message) {
            state.message = message
        },
        messagedestroy(state) {
            state.message = null
        },
        updatemapcenter(state, mapcenter) {
            state.mapcenter = mapcenter;
        },
        resetmapcenter(state) {
            state.mapcenter = [46.0736617, 6.4048087];
        },
        updatedatalist(state) {
            axios.get("http://127.0.0.1:3000/interventions")
                .then(function (value) {
                    return value.data;
                }).then(data => {
                state.datalist = data;
            }).catch(err => console.log(err));
        },
        initdatalist(state) {
            console.log("oui")
            axios.get("http://127.0.0.1:3000/interventions")
                .then(function (value) {
                    return value.data;
                }).then(data => {
                state.datalist = data;
            }).catch(err => console.log(err));
        },
        individualzoom(state) {
            state.zoom = 15;
        },
        resetzoom(state) {
            state.zoom = 9;
        }
    },
    getters: {
        messageNotification: state => {
            return state.message;
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
