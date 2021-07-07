<template>
  <div>

    <b-button to="/administration" variant="warning">
      <b-icon-arrow-left></b-icon-arrow-left>
      Retour panneau d'administration</b-button>

    <b-table responsive sticky-header="80vh"
             hover
             :items="this.abonnes"
             :fields="fields"
    >

      <template #cell(nompnom)="data">
        {{ data.item['personne.nom'] }} {{ data.item['personne.prenom'] }}
      </template>

      <template #cell(numtel)="data">
        {{ data.item['personne.numtel'] }}
      </template>

      <template #cell(transmetteur)="data">
        {{ data.item.transmetteur }}
      </template>

      <template #cell(show_details)="data">
        <b-button-group>
          <b-button
              :href="'http://10.200.2.102/webbuncher/gestionAbonne/rechercher.php?idA=' + data.item['identifiant_wbb']">
            {{ data.item['numero_abo'] }}
          </b-button>
          <b-button size="sm" @click="data.toggleDetails" variant="primary">
            <b-icon-clipboard-plus></b-icon-clipboard-plus>
          </b-button>
          <b-button @click="deleteAbonne(data.item)" variant="danger" v-if="$store.state.utilisateur.roleId > 2">
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
          label: 'Nom Prénom',
          key: 'nompnom',
          sortable: true
        },
        {
          label: "N°Téléphone(s)",
          key: 'numtel'
        },
        {
          label: 'Transmetteur n°',
          key: 'transmetteur',
          sortable: true
        },
        {
          label: 'Numéro Abonné',
          key: 'show_details',
          sortable: false
        }],
      abonnes: null
    }
  },
  beforeMount() {
    axios.get(this.$hostname +'/abonnes')
        .then(function (response) {
          if (response.status === 200) {
            return response.data
          }
        }).then((data) => {
      this.abonnes = data;
    })
  },
  methods: {
    deleteAbonne: async function(item) {
      console.log(item.id);
      await axios.delete(this.$hostname +"/delete/abonne/personne/" + item.id, {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': '*'
        }
      }).then(function () {
        console.log("personne supprimée")
      }).catch(err=> console.log(err))
      await axios.delete(this.$hostname +"/delete/abonne/" + item.id, {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': '*'
        }
      }).then(function (response) {
        if (response.status === 204)
          return response
      }).then(() => {
        this.$store.commit("messagecreate", "Abonné Supprimé")
        //this.$router.push("/administration")
      }).catch(err => console.log(err))

    }
  }

}
</script>