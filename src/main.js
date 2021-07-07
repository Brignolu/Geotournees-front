import Vue from 'vue';
import App from './App.vue';
import VueRouter from "vue-router";
import Vuex from 'vuex';

import Vuetify from 'vuetify/lib'
import {BootstrapVue, BootstrapVueIcons} from 'bootstrap-vue';
import "@/assets/app.scss";

//Importation des composants
import ConnexionRacine from "@/components/ConnexionRacine";
import VisualisationCarteListe from "@/components/VisualisationCarteListe";
import NouvelleIntervention from "@/components/NouvelleIntervention";
import NouvelUtilisateur from "@/components/NouvelUtilisateur";
import NouvellePersonne from "@/components/NouvellePersonne";
import AfficheAbonnes from "@/components/AfficheAbonnes.vue";
import AfficheUtilisateurs from "@/components/AfficheUtilisateurs";
import axios from "axios";
import SocketIO from "socket.io-client";
import VueSocketIO from "vue-socket.io";
import PanneauAdministration from "@/components/PanneauAdministration";


Vue.use(Vuetify)
const vuetify = new Vuetify({});
Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);
Vue.use(VueRouter);
Vue.use(Vuex);


Vue.config.productionTip = false;
let hostname = 'http://localhost:3000'
Vue.prototype.$hostname = hostname



// Association des routes aux composants
const routes = [
    //  Composant nommé
    {
        path: '/visualisation', name: 'visualisation', component: VisualisationCarteListe, beforeEnter: (to, from, next) => {
            if (store.state.utilisateur === null) {
                next(false);
            } else {
                next();
            }
        }
    },
    {
        path: '/intervention', name: 'intervention', component: NouvelleIntervention, beforeEnter: (to, from, next) => {
            if (store.state.utilisateur === null || store.state.utilisateur.roleId < 2) {
                next(false);
            } else {
                next();
            }
        }
    },
    {
        path: '/administration', name: 'administration', component: PanneauAdministration, beforeEnter: (to, from, next) => {
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
        component: NouvelUtilisateur,
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
    {path: '/', component: ConnexionRacine},
    {
        path: '/intervention/nouvelabonne', name: 'abonne', component: NouvellePersonne, beforeEnter: (to, from, next) => {
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
        abonnes: null,
        utilisateurs: null,
        message: null,
        mapcenter: [46.0736617, 6.4048087],
        zoom: 9,
        datalist: null,
        itemselected: null,

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
            axios.get(hostname + "/interventions")
                .then(function (value) {
                    return value.data;
                }).then(data => {
                state.datalist = data;
            }).catch(err => console.log(err));
        },
        setzoom(state,data){
          state.zoom = data;
        },
        individualzoom(state) {
            state.zoom = 15;
        },
        resetzoom(state) {
            state.zoom = 9;
        },
        mouseclickmarker(state, data){
            state.itemselected = data
        },
        markerclickreset(state){
            state.itemselected = null
        },
        updateAbonnes(state, abonnes){
            state.abonnes = abonnes;
        },
        updateUtilisateurs(state, utilisateurs){
            state.utilisateurs = utilisateurs;
        }
    },
    actions: {
      loadAbonnes({commit}){
          axios.get(hostname +'/abonnes')
              .then(function (response) {
                  commit('updateAbonnes', response.data);
              }).catch(err => console.log(err))
      },
        loadUtilisateurs({commit}){
            axios.get(hostname +'/utilisateurs')
                .then(function (response) {
                    commit('updateUtilisateurs', response.data);
                }).catch(err => console.log(err))
        },

    },
    getters: {
        centerUpdate: state => {
            return state.mapcenter
        },
        zoomUpdate: state => {
            return state.zoom
        },
        messageNotification: state => {
            return state.message;
        },
        listUpdate: state => {
            return state.datalist;
        },
        clickMarkerUpdate: state => {
            return state.itemselected;
        },
        userUpdate: state => {
            return state.utilisateur
        },
        userStatus: state => {
            return state.utilisateur.roleId
        },
        userName: state => {
            return state.utilisateur.nom_utilisateur
        }

    }
})

Vue.use( new VueSocketIO({connection: SocketIO('localhost:3000')
}) )
// Initialisation du module routeur
const router = new VueRouter({
    routes
})

// Initialisation de vue
let app = new Vue({
    router,
    store,
    vuetify,
    render: h => h(App),
}).$mount('#app')

global._vm = app;
