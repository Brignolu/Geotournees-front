<template>
  <div>
    {{ this.$store.state.mapcenter }}{{ this.$store.state.zoom }}
    <b-input-group
        size="sm"
    >
      <b-form-input
          id="filter-input"
          v-model="filter"
          type="search"
          placeholder="Recherche"
      >
      </b-form-input>
      <b-input-group-append>
        <b-button
            :disabled="!filter"
            @click="resetFilter">
          Effacer
        </b-button>
      </b-input-group-append>
    </b-input-group>
    <b-table responsive sticky-header="80vh"
             hover
             :items="SubData"
             :fields="fields"
             :filter="filter"
             @row-clicked="click"
             @row-hovered="mouseOver"
             @row-unhovered="mouseLeave"
             ref="myTable"
             selectable
             select-mode="single"
             id="myTable"
             primary-key="id"
    >

      <template #cell(dateformat)="data">
        {{ data.item.date.split('T')[0] }}
      </template>

      <template #cell(nompnom)="data">
       {{ data.item["abonne.personne.nom"] }} {{ data.item["abonne.personne.prenom"] }}
      </template>

      <template #cell(fulladdr)="data">
        {{ data.item["abonne.personne.adresses.numero"] }} {{ data.item["abonne.personne.adresses.rue"] }}
        {{ data.item["abonne.personne.adresses.codepostal"] }} {{ data.item["abonne.personne.adresses.ville"] }}
      </template>

      <template #cell(show_details)="data">
        <b-button-group>
          <b-button
              :href="'http://10.200.2.102/webbuncher/gestionAbonne/rechercher.php?idA=' + data.item['abonne.identifiant_wbb']">
            {{ data.item['abonne.numero_abo'] }}
          </b-button>
          <b-button size="sm" @click="data.toggleDetails" variant="primary">
            <b-icon-clipboard-plus></b-icon-clipboard-plus>
          </b-button>
          <b-button @click="deleteIntervention(data.item)" variant="danger" v-if="$store.state.utilisateur.roleId > 1">
            <b-icon-trash></b-icon-trash>
          </b-button>
        </b-button-group>
      </template>

      <template #row-details="data">
        <b-card>
          <b-row class="mb-2">
            <b-col sm="3" class="text-sm-right">
              <b>Intervention:</b>
            </b-col>
            <b-col>
              {{ data.item["type.type"] }} {{ data.item["motif.motif"] }}
            </b-col>
            <b-col sm="3" class="text-sm-right">
              <b>Heure:</b>
            </b-col>
            <b-col>
              {{ data.item.date.split('T')[1].substr(0, 5) }}
            </b-col>
          </b-row>
          <b-row>
            <b-col sm="3" class="text-sm-right">
              <b>
                n° Téléphone:
              </b>
            </b-col>
            <b-col>
              {{ data.item["abonne.personne.numtel"] }}
            </b-col>
          </b-row>
        </b-card>
      </template>
    </b-table>

  </div>
</template>

<script>
import axios from "axios";
import { mapGetters } from "vuex";

export default {
  name: 'VisualisationListe',
  emits: ['tablehover', 'tableclick'],
  props: {
    SubData: Array,
  },
  data() {
    return {
      /* date; heure; numabo; nom; pnom; nvoie; addr; postc; comm; telabo; agent; motif; intertype; numtrans; idabo; */
      fields: [
        {
          label: 'Date',
          key: 'dateformat',
          sortable: true
        },
        {
          label: 'Nom Prénom',
          key: 'nompnom',
          sortable: false
        },
        {
          label: 'Adresse',
          key: 'fulladdr',
          sortable: false
        },
        {label: 'Agent', key: 'agent.nom', sortable: true}, {
          label: 'Transmetteur n°',
          key: 'abonne.transmetteur',
          sortable: false
        },
        {
          label: 'Numéro Abonné',
          key: 'show_details',
          sortable: false
        }],
      filter: '',
    }
  },
  methods: {

    resetFilter(){
      this.filter = ''
      this.$store.commit('markerclickreset')
      this.$store.commit('resetzoom')
      this.$store.commit('resetmapcenter')
    },

    click(item) {

      this.$root.$emit('mouse-click-abo', item)

      console.log('emit => mouse-click-abo')
      console.log(item)
      console.log(item.id)
    },

    mouseOver(item) {
      var coords = [item['abonne.personne.adresses.coordonne.lat'], item['abonne.personne.adresses.coordonne.long']]
      this.$store.commit("updatemapcenter", coords)
      this.$store.commit("individualzoom")
    },

    mouseLeave() {
      console.log("mouseleave")
    },

    deleteIntervention(item) {
      console.log(item.id);
      axios.delete("http://localhost:3000/delete/intervention/" + item.id, {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': '*'
        }
      }).then(function (response) {
        if (response.status === 204)
          return response
      }).then(() => {
        this.$store.commit("messagecreate", "Intervention Supprimée")
        this.$socket.emit('ws-refresh-intervention')
        this.$store.commit("updatedatalist")
      })
    },
  },
  watch:{
    markerup:function (){
      console.log(this.$store.state.itemselected.id)
      let myTable = this.$refs.myTable.$el,
          tableBody = myTable.getElementsByTagName('tbody')[0],
          tableRows = tableBody.getElementsByTagName('tr');

      this.filter = this.$store.state.itemselected['abonne.personne.nom'];
      tableRows[this.$store.state.itemselected.id - 1].click()


    }
  },
  computed: {
    ...mapGetters({markerup: "clickMarkerUpdate"}),
    splitDate: function () {
      var isoDate = new Date(this.item["date"]);
      var formatDate = isoDate.getDay() + isoDate.getMonth() + isoDate.getFullYear();
      return formatDate;
    },
  },


};
</script>

