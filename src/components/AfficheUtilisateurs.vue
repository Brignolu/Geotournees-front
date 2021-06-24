<template>
  <div>
    <b-button to="/administration" variant="warning">
      <b-icon-arrow-left></b-icon-arrow-left>
      Retour panneau d'administration</b-icon-arrow-bar-left></b-button>

    <div class="d-flex flex-column min-vh-100 justify-content-center align-items-center">
      <b-card class="col-6">

        <b-table responsive sticky-header="80vh"
                 hover
                 :items="this.abonnes"
                 :fields="fields"
        >

          <template #cell(nompnom)="data">
            {{ data.item['nom'] }} {{ data.item['nom_utilisateur'] }}
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
    </div>
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
      abonnes: null
    }
  },
  beforeMount() {
    axios.get('http://localhost:3000/utilisateurs')
        .then(function (response) {
          if (response.status === 200) {
            return response.data
          }
        }).then((data) => {
      this.abonnes = data;
    })
  },
  methods: {
    deleteUtilisateur(item) {
      console.log(item.id);
      axios.delete("http://localhost:3000/delete/utilisateur/" + item.id, {
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
        this.$router.push("/administration")
      })

    }
  }

}
</script>