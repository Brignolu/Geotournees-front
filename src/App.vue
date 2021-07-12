<!--
<head>
<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
</head>
-->
<template>

  <b-container fluid class="min-vh-100 m-0 p-0">
    <EnTete v-if=this.$store.state.utilisateur v-bind:UtilisateurCourant=this.$store.state.utilisateur></EnTete>
    <router-view/>
  </b-container>
</template>


<script>
import EnTete from "@/components/EnTete";
import {mapGetters} from "vuex";

export default {
  name: 'App',
  components: { EnTete },
  computed: {
    ...mapGetters({markerup: "clickMarkerUpdate"}),
  },
  sockets:{
    refreshinterventionlist:function (){
      console.log('socket recv refresh intervention list')
      this.$store.dispatch("loadInterventions")
    },


  }

}


//TODO: Associer un agent a un utilisateur optionnellement et ajouter un filtre sur la table principale afin de filtrer si la personnes à le statut utilisateur


</script>

