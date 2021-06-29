<template>
  <div>
    <b-button-group>
      <b-button to="/administration/nouvelutilisateur" variant="success">
        <b-icon-person-plus-fill></b-icon-person-plus-fill>
        Ajouter un Utilisateur
      </b-button>
      <b-button to="/administration/utilisateurs" variant="warning">
        <b-icon-person-fill></b-icon-person-fill>
        Voir/Supprimer un Utilisateur
      </b-button>
    </b-button-group>

    <b-button-group>
      <b-button to="/intervention/nouvelabonne" variant="success">
        <b-icon-file-earmark-plus-fill></b-icon-file-earmark-plus-fill>
        Ajouter un Abonné
      </b-button>
      <b-button to="/administration/abonnes" variant="warning">
        <b-icon-file-earmark-minus-fill></b-icon-file-earmark-minus-fill>
        Voir/Supprimer un Abonné
      </b-button>
    </b-button-group>

  </div>
</template>
<script>
export default {
  name: 'Administration'
}
</script>