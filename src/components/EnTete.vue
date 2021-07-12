<template>
  <header>
    <b-navbar toggleable="lg" type="dark" variant="primary">
      <b-navbar-brand class="mr-auto">
        <img @click="accueil" id="logo" alt="Conseil Départemental de Haute-Savoie"
             src="@/assets/Logo_Haute_Savoie_Blanc.png">
      </b-navbar-brand>
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav class="ml-auto mr-5">
            <b-nav-item-dropdown>

              <template #button-content>
                <em>Bonjour {{ UtilisateurCourant.nom_utilisateur }}</em>
              </template>

              <b-dropdown-item @click="deconnexion">
                Deconnexion
              </b-dropdown-item>

              <b-dropdown-item v-if="this.$store.getters.userStatus === 3 || this.$store.getters.userStatus === 2"
                               @click="intervention">
                Ajouter une intervention
              </b-dropdown-item>

              <b-dropdown-item v-if="this.$store.getters.userStatus === 3" @click="administration">
                Panneau d'administration
              </b-dropdown-item>

              <b-dropdown-item v-if="this.$store.getters.userStatus === 3 || this.$store.getters.userStatus === 2" @click="postSoplanning">
                Synchronisation SoPlanning
              </b-dropdown-item>
            </b-nav-item-dropdown>
          </b-navbar-nav>
        </b-collapse>
    </b-navbar>

  </header>
</template>
<script>
import {mapGetters} from "vuex";
import axios from "axios";

export default {
  name: 'EnTete',
  props: {
    UtilisateurCourant: Object,
  },
  methods: {
    accueil: function () {
      console.log("accueil");
      this.$store.commit('setMarkerClicked',null)
      this.$store.dispatch("loadZoom",9)
      this.$store.dispatch("loadCenter", [46.0736617, 6.4048087])
      this.$router.push('/visualisation').catch(err => console.log(err));
    },
    deconnexion: function () {
      console.log("deconnexion");
      this.$router.push('/');
      this.$store.commit("setUtilisateur",null);
    },
    intervention: function () {
      console.log("intervention");
      this.$router.push('/intervention');
    },
    administration: function () {
      console.log("administration");
      this.$router.push('/administration');
    },
    postSoplanning: async function (){
      await axios.get(this.$hostname +'/synchronisationplanning').catch(err => console.log(err))
    }
  },
  computed: {
    ...mapGetters({messageNot: 'messageNotification'})
  },
  watch: {
    messageNot: function (newMessage) {
      this.$bvToast.toast(newMessage, {
        title: 'Notification',
        autoHideDelay: 5000,
        appendToast: false
      });
      this.$store.commit("setNotification", null);
    }
  }
}
</script>