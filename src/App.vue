<head>
<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
</head>
<template>

  <b-container fluid class="px-0">
    <Header v-if=this.$store.state.utilisateur v-bind:UtilisateurCourant=this.$store.state.utilisateur></Header>
    <router-view/>
  </b-container>
</template>


<script>
import Header from "@/components/Header";

export default {
  name: 'App',
  components: {Header},
}
</script>