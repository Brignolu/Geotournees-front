<template>
  <div>
    <b-button to="/administration" variant="warning">
      <b-icon-arrow-left></b-icon-arrow-left>
      Retour panneau d'administration</b-icon-arrow-bar-left></b-button>

    <b-row class="min-vh-100" align-v="center">
      <b-col></b-col>
      <b-col cols="12" sm="10" md="8" lg="6" xl="4">
      <b-card>

        <b-table responsive sticky-header
                 hover
                 :items="this.utilisateurs"
                 :fields="fields"
        >

          <template #cell(nompnom)="data">
            {{ data.item['nom'] }} ({{ data.item['nom_utilisateur'] }})
          </template>

          <template #cell(buttons)="data">
            <b-button-group>
              <b-button @click="deleteUtilisateur(data.item)" variant="danger"
                        v-if="$store.state.utilisateur.roleId > 2">
                <b-icon-trash></b-icon-trash>
              </b-button>
            </b-button-group>
          </template>

          <template #row-details="data">
            <b-card>
              {{ data.item["identifiant_wbb"] }}
            </b-card>
          </template>
        </b-table>
      </b-card>
      </b-col>
      <b-col></b-col>

    </b-row>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: 'AfficheAbonnes',
  data() {
    return {
      /* numero_abo, transmetteur, identifiant_wbb, nom prenom, numtel */
      fields: [
        {
          label: 'Nom Identifiant',
          key: 'nompnom',
        },
        {
          label: 'Supprimer',
          key: 'buttons',
        }],
    }
  },
  computed:{
    utilisateurs(){
      return this.$store.state.utilisateurs
    }
  },
  created(){
    this.$store.dispatch('loadUtilisateurs')
  },
  methods: {
    deleteUtilisateur(item) {
      console.log(item.id);
      axios.delete(this.$hostname +"/delete/utilisateur/" + item.id, {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': '*'
        }
      }).then(function (response) {
        if (response.status === 204)
          return response
      }).then(() => {
        this.$store.commit("messagecreate", "Utilisateur Supprimé")
        //this.$router.push("/administration")
        this.$store.dispatch('loadUtilisateurs')
      })

    }
  }

}
</script>