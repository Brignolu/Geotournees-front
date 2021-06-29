<template>
  <header>
    <b-navbar toggleable="lg" type="dark" variant="primary">
      <b-navbar-brand class="mr-auto">
        <img @click="accueil" id="logo" alt="Conseil Départemental de Haute-Savoie"
             src="@/assets/Logo_Haute_Savoie_Blanc.png">
        Visualisation des tournées
      </b-navbar-brand>

      <b-navbar-nav class="ml-auto mr-5">
        <b-nav-item-dropdown>

          <template #button-content>
            <em>Bonjour {{ UtilisateurCourant.nom_utilisateur }}</em>
          </template>

          <b-dropdown-item @click="deconnexion">
            Deconnexion
          </b-dropdown-item>

          <b-dropdown-item v-if="UtilisateurCourant.roleId === 3 || UtilisateurCourant.roleId === 2"
                           @click="intervention">
            Ajouter une intervention
          </b-dropdown-item>

          <b-dropdown-item v-if="UtilisateurCourant.roleId === 3" @click="administration">
            Panneau d'administration
          </b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-navbar>
  </header>
</template>
<script>
import {mapGetters} from "vuex";

export default {
  name: 'Header',
  props: {
    UtilisateurCourant: Object,
},
  methods: {
    accueil: function () {
      console.log("accueil");
      this.$store.commit("resetmapcenter");
      this.$store.commit("resetzoom");
      this.$router.push('/visualisation').catch(err => console.log(err));
    },
    deconnexion: function () {
      console.log("deconnexion");
      this.$router.push('/');
      this.$store.commit("logout");
    },
    intervention: function () {
      console.log("intervention");
      this.$router.push('/intervention');
    },
    administration: function () {
      console.log("administration");
      this.$router.push('/administration');
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
      this.$store.commit("messagedestroy");
    }
  }
}
</script>