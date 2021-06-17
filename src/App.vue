
<head>
<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
</head>
<template>

<b-container-fluid>
  <Header v-if = this.$store.state.utilisateur v-bind:UtilisateurCourant = this.$store.state.utilisateur></Header>
    <router-view />
</b-container-fluid>
</template>


<script>
import Header from "@/components/Header";
export default {
  name: 'App',
  components: { Header }
}
</script>