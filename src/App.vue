
<head>
<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
</head>
<template>

  <html lang="fr">
  <Header v-if = this.$store.state.utilisateur v-bind:UtilisateurCourant = this.$store.state.utilisateur></Header>
    <router-view />
  </html>
</template>


<script>
import Header from "@/components/Header";
export default {
  name: 'App',
  components: { Header }
}
</script>
