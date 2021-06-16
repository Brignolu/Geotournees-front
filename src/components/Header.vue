<template>
  <header>
    <b-navbar toggleable="lg" type="dark" variant="primary">
      <b-navbar-brand class="mr-auto">
        <img id="logo" alt="Conseil Départemental de Haute-Savoie" src="@/assets/Logo_Haute_Savoie.png">
        Visualisation des tournées
      </b-navbar-brand>

      <b-navbar-nav style="margin-left: auto" class="ml-auto">
        <b-nav-item-dropdown>

          <template #button-content>
            <em>Bonjour {{ UtilisateurCourant.nom_utilisateur }}</em>
          </template>

          <b-dropdown-item @click="deconnexion">
            Deconnexion
          </b-dropdown-item>

          <b-dropdown-item v-if="UtilisateurCourant.roleId===3 || UtilisateurCourant.roleId===2" @click="intervention">
            Ajouter une intervention
          </b-dropdown-item>

          <b-dropdown-item v-if="UtilisateurCourant.roleId===3" @click="administration">
            Panneau d'administration
          </b-dropdown-item>

        </b-nav-item-dropdown>

      </b-navbar-nav>
    </b-navbar>
  </header>
</template>
<script>
export default {
  name: 'Header',
  props: ['UtilisateurCourant'],
  methods: {
    deconnexion: function () {
      console.log("deconnexion");
      this.$router.push('/');
    },
    intervention: function () {
      console.log("intervention");
      this.$router.push('/intervention');
    },
    administration: function () {
      console.log("administration");
      this.$router.push('/administration');
    }
  }
}
</script>