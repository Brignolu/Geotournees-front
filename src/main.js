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
import CalculItineraires from "@/components/CalculItineraires";
import PanneauAdministration from "@/components/PanneauAdministration";

import axios from "axios";
import SocketIO from "socket.io-client";
import VueSocketIO from "vue-socket.io";
import moment from "moment";



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
        path: '/visualisation',
        name: 'visualisation',
        component: VisualisationCarteListe,
        beforeEnter: (to, from, next) => {
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
        path: '/administration',
        name: 'administration',
        component: PanneauAdministration,
        beforeEnter: (to, from, next) => {
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
        path: '/intervention/nouvelabonne',
        name: 'abonne',
        component: NouvellePersonne,
        beforeEnter: (to, from, next) => {
            if (store.state.utilisateur === null || store.state.utilisateur.roleId < 2) {
                next(false);
            } else {
                next();
            }
        }
    },
    {path: '/calculitineraires',
    name:'itineraires',
    component: CalculItineraires
    }
]

// Initialisation du module store
const store = new Vuex.Store({
    state: {
        utilisateur: null,
        abonnes: null,
        utilisateurs: null,
        agents:null,
        type: null,
        message: null,
        mapcenter: null,
        zoom: 9,
        interventions: null,
        itemselected: null,
        events: null,
        selectedDate: null,
        interventionsfiltered:null,
    },
    mutations: {
        setUtilisateur(state, utilisateur) {
            state.utilisateur = utilisateur;
        },
        setNotification(state, message) {
            state.message = message
        },
        setMapCenter(state, mapcenter) {
            state.mapcenter = mapcenter;
        },
        setZoom(state, data) {
            state.zoom = data;
        },
        setMarkerClicked(state, data) {
            state.itemselected = data
        },
        setAbonnes(state, abonnes) {
            state.abonnes = abonnes;
        },
        setUtilisateurs(state, utilisateurs) {
            state.utilisateurs = utilisateurs;
        },
        setInterventions(state, interventions) {
            state.interventions = interventions;
        },
        setInterventionsFiltered(state, interventionsfiltered) {
            state.interventionsfiltered = interventionsfiltered;
        },
        setAgents(state, agents){
            state.agents = agents;
        },
        setTypes(state, type){
            state.type = type
        },
        setEvents(state, events){
            state.events = events
        },
        setSelectedDate(state, selectedDate){
            state.selectedDate = selectedDate
        }
    },
    actions: {
        loadAbonnes({commit}) {
            axios.get(hostname + '/abonnes')
                .then(function (response) {
                    commit('setAbonnes', response.data);
                }).catch(err => console.log(err))
        },
        loadUtilisateurs({commit}) {
            axios.get(hostname + '/utilisateurs')
                .then(function (response) {
                    commit('setUtilisateurs', response.data);
                }).catch(err => console.log(err))
        },
        loadInterventions({commit}) {
            axios.get(hostname + '/interventions')
                .then(function (response) {
                    commit('setInterventions', response.data);
                }).catch(err => console.log(err))
        },
        loadAgents({commit}) {
            axios.get(hostname + '/agents')
                .then(function (response) {
                    commit('setAgents', response.data);
                }).catch(err => console.log(err))
        },
        loadTypes({commit}) {
            axios.get(hostname + '/types')
                .then(function (response) {
                    commit('setTypes', response.data);
                }).catch(err => console.log(err))
        },
        loadCenter({commit}, coords) {
            commit("setMapCenter", coords)
        },
        loadZoom({commit}, zoomlvl) {
            commit("setZoom", zoomlvl)
        },
        async loadEvents({commit}) {
            let interventions = await axios.get('http://localhost:3000/interventions').catch(err => console.log(err))
            var events = []
            for (let i = 0; i < interventions.data.length; i++) {
                events.push({
                    id: interventions.data[i].id,
                    title: interventions.data[i]['agent.nom'] + " - " + interventions.data[i]['type.type'],
                    start: moment(interventions.data[i].date).utc().toISOString(),
                    end: moment(interventions.data[i].date).utc().add(30, 'minutes').toISOString()
                })
            }
            console.log('events action')
            console.log(events)
            commit("setEvents", events)
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
        },
        selectedDateGetter: state => {
            return state.selectedDate
        }

    }
})

Vue.use(new VueSocketIO({
    connection: SocketIO('http://localhost:3000')
}))
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
